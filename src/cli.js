/**
 * CHIP-8 interpreter CLI tool.
 *
 * General usage:
 *   ./cli.js [options] <subcommand> [suboptions] [subparameter]
 *
 * Options:
 *   -s, --state <file>  The file where the engine's state resides.
 *                       (default: .engine_state.chip8.txt)
 *
 * Subcommands:
 *   load [-d,--dry-run] <source-file>
 *     Load program into a new CHIP-8 engine.
 *   cycle [-d,--dry-run] [amount]
 *     Run one or multiple cycle, i.e. read next instruction(s).
 *   display [-1,--pixel-on <character>] [-0,--pixel-off <character>]
 *     Print the engine's display.
 *   input [-n,--no] <key>
 *     Press or not a key of the engine's keypad.
 *   inspect [-f,--format <base>] [-r,--range [start]-[end]] [component]
 *     Show engine's components bare data.
 *   edit
 *     Open the state file in your favorite editor to edit it safely.
 *   help [subcommand]
 *     Show the help.
 */

const fs = require('fs');
const spawn = require('child_process').spawn;
const createInterface = require('readline').createInterface;
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
  let argumentToParse = args.slice(2);
  let notArgument = 0;
  for (let i = 0; i < argumentToParse.length; i++) {
    switch (argumentToParse[i]) {
      case '-s':
      case '--state':
        query.state = argumentToParse[i + 1];
        i++;
        break;
      case '-d':
      case '--dry-run' :
        query.dryrun = true;
        break;
      case '-1':
      case '--pixel-on':
        query.pixelon = argumentToParse[i + 1];
        i++;
        break;
      case '-0':
      case '--pixel-off':
        query.pixeloff = argumentToParse[i + 1];
        i++;
        break;
      case '-n':
      case '--no':
        query.no = true;
        break;
      case '-f':
      case '--format':
        query.format = parseInt(argumentToParse[i + 1]);
        i++;
        break;
      case '-r':
      case '--range':
        query.range = argumentToParse[i + 1].split('-');
        i++;
        break;
      default:
        if (notArgument === 0) {
          query.subcommand = argumentToParse[i];
          notArgument++;
        } else if (notArgument === 1) {
          query.subparameter = argumentToParse[i];
          notArgument++;
        } else {
          throw Error('Parsing failed:', args[i]);
        }
    }
  }
  return query;
}

/**
 * Load subcommand - Create a new CHIP-8 engine with the given source code fed
 * into its memory and ready to be executed.
 *
 * Usage: ./cli.js [options] load [subptions] <source-file>
 *
 * source-file: Path to the file containing the CHIP-8 code you want to load
 *              into the new engine.
 *
 * Options:
 *   -s, --state <file>  Save new engine to file, instead of default.
 *                       (default: .engine_state.chip8.txt)
 *
 * Suboptions:
 *   -d, --dry-run       Do not save the new engine to the state file. Can help
 *                       to verify that a given CHIP-8 program is free of any
 *                       syntax error.
 */
function load (query) {
  const sourceCode = fs.readFileSync(query.subparameter, 'utf8');
  const program = utility.removeArtefacts(sourceCode);
  const engineState = engine.prepare(engine.initialize(), program);
  if (!query.dryrun) {
    dumpEngineToFile(engineState, query.state);
  }
}

/**
 * Cycle subcommand - Execute engine's next instruction(s).
 *
 * Usage: ./cli.js [options] cycle [suboptions] [amount]
 *
 * amount: How many instructions to read, defaults to 1.
 *
 * Options:
 *   -s, --state <file>  Where to retrieve and save back the engine's state.
 *                       (default: .engine_state.chip8.txt)
 *
 * Suboptions:
 *   -d, --dry-run       Do not save the new engine, display the differences
 *                       between them.
 */
function cycle (query) {
  const engineState = loadEngineFromFile(query.state);
  const amount = query.subparameter === '' ? 1 : query.subparameter;
  let cycledEngineState;
  for (let i = 0; i <= amount; i++) {
    cycledEngineState = engine.cycle(engineState);
  }
  if (query.dryrun) {
    console.log(utility.compareEngines(engineState, cycledEngineState));
  } else {
    dumpEngineToFile(cycledEngineState, query.state);
  }
}

/**
 * Display subcommand - Show the engine's display in a pretty format.
 *
 * Usage: ./cli.js [options] display [suboptions]
 *
 * Options:
 *   -s, --state <file>           The file containing the engine's state.
 *                                (default: .engine_state.chip8.txt)
 *
 * Suboptions:
 *   -1, --pixel-on <character>   Use given character for non-transparent
 *                                pixels.
 *   -0, --pixel-off <character>  Use given character for transparent pixels.
 */
function display (query) {
  const engineState = loadEngineFromFile(query.state);
  const engineDisplay = engineState.get('display');
  engineDisplay.forEach(row => {
    console.log(row.map(v => v ? query.pixelon : query.pixeloff).join(''));
  });
}

/**
 * Input subcommand - Simulate the input of a keypad's key.
 *
 * Usage: ./cli.js [options] input [suboptions] <key>
 *
 * key: The key to press, 0 through F.
 *
 * Options:
 *   -s, --state <file>  Where to retrieve and save back the engine's state.
 *                       (default: .engine_state.chip8.txt)
 *
 * Suboptions:
 *   -n, --no            Release the pressure on a key.
 */
function input (query) {
  const engineState = .loadEngineFromFile(query.state);
  engineState.keypad[parseInt(query.subcommand, 16)] = !query.no;
}

/**
 * Inspect subcommand - Show the bare data of the engine's various components.
 *
 * Usage: ./cli.js [options] inspect [suboptions] [component]
 *
 * component: The component of the engine to inspect, defaults to "all".
 *            Possible values: data,  data.[0-F], I,      timer,
 *                             sound, memory,     pc,     pointer,
 *                             stack, display,    keypad, all
 *
 * Options:
 *   -s, --state <file>         The file containing the engine's state to
 *                              inspect.
 *                              (default: .engine_state.chip8.txt)
 *
 * Suboptions:
 *   -f, --format <base>        Change the base in which to display
 *                              the engine's data, defaults to 10.
 *
 *   -r, --range [start]-[end]  For certain components, display only a portion
 *                              of it. Defaults to "-", which is from 0 until
 *                              the end.
 */
function inspect (query) {
  const engineState = .loadEngineFromFile(query.state);

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
      const end = query.range[1] === -1 ? 4096 : query.range[1];
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
      const end = query.range[1] === -1 ? 64 : query.range[1];
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

/**
 * Help subcommand - Show the help.
 *
 * Usage: ./cli.js help [subcommand]
 *
 * subcommand: Display detailed information about one particular subcommand,
 *             defaults to "short".
 *             Possible values: short, load, cycle, display, input, inspect
 */
function help (query) {
  const cliSource = require('fs').readFileSync(process.argv[1], 'utf8');
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
        dumpEngineToFile(loadEngineFromFile(tmp), query.state);
        fs.unlinkSync(tmp);
        console.log('Committed!');
      } else {
        console.log('Not committing, your modifications are still accessible',
          'in', tmp);
      }
    });
  });
}

function dumpEngineToFile (engineState, file) {
  const dump = utility.dumpEngine(engineState);
  fs.writeFileSync(file, dump, 'utf8');
}

function loadEngineFromFile (file) {
  const dump = fs.readFileSync(file, 'utf8');
  return utility.loadEngine(dump);
}

function main () {
  [query, args, subcommands] = init();
  query = parseArgument(query, args);
  subcommands[query.subcommand](query);
}

main();
