const engine = require('./engine.js');
const utility = require('./utility.js');

function init () {
  let query = {
    'state': '.engine_state.chip8.txt',
    'subcommand': 'none',
    'subparameter': '',
    'dryrun': false,
    'pixelon': 'x',
    'pixeloff': 'o',
    'no': false,
    'format': 10,
    'range': [0, -1]
  };
  let args = process.argv;
  let subcommands = {
    'load': load,
    'cycle': cycle,
    'display': display,
    'input': input,
    'inspect': inspect,
    'edit': edit,
    'help': help
  };

  return [query, args, subcommands];
}

function parseArgument (query, args) {
  let argument_to_parse = args.slice(2);
  let not_argument = 0;
  for (let i = 0; i < argument_to_parse.length; i++) {
    switch (argument_to_parse[i]) {
      case '-s':
      case '--state':
        query.state = argument_to_parse[i + 1];
        i++;
        break;
      case '-d':
      case '--dry-run' :
        query.dryrun = true;
        break;
      case '-1':
      case '--pixel-on':
        query.pixelon = argument_to_parse[i + 1];
        i++;
        break;
      case '-0':
      case '--pixel-off':
        query.pixeloff = argument_to_parse[i + 1];
        i++;
        break;
      case '-n':
      case '--no':
        query.no = true;
        break;
      case '-f':
      case '--format':
        query.format = parseInt(argument_to_parse[i + 1]);
        i++;
        break;
      case '-r':
      case '--range':
        query.range = argument_to_parse[i + 1].split('-');
        i++;
        break;
      default:
        if (not_argument === 0) {
          query.subcommand = argument_to_parse[i];
          not_argument++;
		  } else if (not_argument === 1){
			query.subparameter = argument_to_parse[i];
			not_argument++;
		  } else {
            throw Error(args[i] + ' is not an option');
        }
    }
  }
  return query;
}

function load (query) {
  const program = utility.purifyFile(query.subparameter);
  const engineState = engine.prepare(engine.initialize(), program);
  if (!query.dryrun) {
    utility.dumpEngine(engineState, query.state);
  }
}

function cycle (query) {
  const engineState = utility.loadEngine(query.state);
  const amount = query.subparameter === '' ? 1 : query.subparameter;
  let cycledEngineState;
  for (let i = 0; i <= amount; i++) {
    cycledEngineState = engine.cycle(engineState);
  }
  if (query.dryrun) {
    console.log(utility.compareEngines(engineState, cycledEngineState));
  } else {
    utility.dumpEngine(cycledEngineState, query.state);
  }
}

function display (query) {
  const engineState = utility.loadEngine(query.state);
  const engineDisplay = engineState.get('display');
  engineDisplay.forEach(row => {
    console.log(row.map(v => v ? query.pixelon : query.pixeloff).join(''));
  });
}

function input (query) {
  const engineState = utility.loadEngine(query.state);
  engineState.keypad[parseInt(query.subcommand, 16)] = !query.no;
}

function inspect (query) {
  const engineState = utility.loadEngine(query.state);

  const inspecters = {
    'data': (engineState) => {
      engineState.get('data').forEach((v, i) => {
        console.log(i.toString(16), v.toString(query.format));
      });
    },
    'data.X': (engineState) => {
      const regIndex = parseInt(query.subcommand.split('.')[1], 16);
      console.log(regIndex.toString(16),
        engineState.get('data')[regIndex].toString(query.format));
    },
    'I': (engineState) => {
      console.log('I', engineState.get('I').toString(query.format));
    },
    'timer': (engineState) => {
      console.log('timer', engineState.get('timer').toString(query.format));
    },
    'sound': (engineState) => {
      console.log('sound', engineState.get('sound').toString(query.format));
    },
    'memory': (engineState) => {
      const start = query.range[0];
      const end = query.range[1] === -1 ? 4097 : query.range[1];
      const result = engineState.get('memory')
        .map((v, i) => {
          const base = query.format === 16 ? '0x' : '';
          const pos = i.toString(query.format);
          const value = v.toString(query.format);
          return `${base}${pos} ${value}`;
        })
        .slice(start, end)
        .join('\n');

      console.log(result);
    },
    'pc': (engineState) => {
      console.log('pc', engineState.get('pc').toString(query.format));
    },
    'pointer': (engineState) => {
      console.log('pointer', engineState.get('pointer').toString(query.format));
    },
    'stack': (engineState) => {
      engineState.get('stack').forEach((v, i) => {
        console.log(i.toString(16), v.toString(query.format));
      });
    },
    'display': (engineState) => {
      const start = query.range[0];
      const end = query.range[1] === -1 ? 65 : query.range[1];
      return engineState.get('display')
        .map((row, rowIndex) => {
          return row
            .map((pixel, colIndex) => `${colIndex},${rowIndex} ${pixel}`);
        })
        .reduce((a, v) => a.concat(v))
        .slice(start, end);
    },
    'keypad': (engineState) => {
      engineState.get('keypad').forEach((v, i) => {
        console.log(i.toString(16));
      });
    }
  };

  if (query.subparameter === 'all') {
    Object.keys(inspecters).forEach(k => inspecters[k](engineState));
  } else if (/data.[0-F]/i.test(query.subparameter)) {
    inspecters['data.X'](engineState);
  } else {
    inspecters[query.subparameter](engineState);
  }
}

function help (query) {
  const cliSource = require('fs').readFileSync(process.argv[1], 'UTF-8');
  const commentedHelp = cliSource
    .match(new RegExp('\\/\\*\\*(.|\\n)*?\\*\\/', 'g'));
  const cleanedHelp = commentedHelp.map(helpSection => {
    return helpSection
      .split('\n')
      .slice(1, -1)
      .map(line => line.replace(/^\s*?\* /, ''))
      .join('\n');
  });

  const requestedHelp = query.subparameter === 'short'
    ? cleanedHelp[0]
    : cleanedHelp
        .filter(v => v.split(' ')[0].toLowerCase() === query.subparameter)[0];
  console.log(requestedHelp);
}

/**
 * Edit subcommand - Open the state file in the default editor.
 *
 * Usage: ./cli.js [options] edit
 *
 * Options:
 *   -s, --state <file>  File path to the original engine you want to edit.
 *                       (default: .engine_state.chip8.txt)
 */
function edit (query) {
  const fs = require('fs');
  const spawn = require('child_process').spawn;
  const createInterface = require('readline').createInterface;

  const tmp = query.state + '-tmp';

  fs.createReadStream(query.state).pipe(fs.createWriteStream(tmp));

  let editorProcess;
  if (process.platform === 'darwin') {
    editorProcess = spawn('open', ['-W', tmp]);
  } else if (process.platform === 'win32') {
    editorProcess = spawn('start', [tmp]);
  } else {
    editorProcess = spawn('xdg-open', [tmp]);
  }

  editorProcess.on('exit', () => {
    // We import and then dump it in order to test that the modifications have
    // been done correctly.
    const prompt = createInterface({
      input: process.stdin,
      output: process.stdout
    });
    prompt.question('Commit your changes? (y/n)', (answer) => {
      if (answer.toLowerCase() === 'y') {
        utlity.dumpEngine(utility.loadEngine(tmp), query.state);
        fs.unlinkSync(tmp);
        console.log('Committed!');
      } else {
        console.log('Not committing, your modifications are still accessible',
          'in', tmp);
      }
    });
  });
}

function main () {
  [query, args, subcommands] = init();
  query = parseArgument(query, args);
  subcommands[query.subcommand](query);
}

main();
