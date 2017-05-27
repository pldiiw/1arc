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
 *   help [subcommand]
 *     Show the help.
 */

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
    'format': 2,
    'range': [0, -1]
  };
  let args = process.argv;
  let subcommands = {
    'load': load,
    'cycle': cycle,
    'display': display,
    'input': input,
    'inspect': inspect,
    'help': help
  };

  return [query, args, subcommands];
}

function parseArgument (query, args) {
  args = args.slice(2);
  if (args[0] === '-s' || args[0] === '--state') {
    query.state = args[1];
    args.splice(0, 2);
  }

  let actualCommand = '';
  let i;
  for (i = 0; i < args.length; i++) {
    if (args[i].charAt(0) !== '-') {
      query.subcommand = args[i];
      if (args[i + 1].charAt(0) !== '-') {
        query.subparameter = args[i + 1];
        args.splice(i, 1);
      }
      actualCommand = args[i];
      args.splice(i, 1);
      i = args.length;
    }
  }

  if (actualCommand === '') {
    throw Error('No command found');
  } else {
    for (i = 0; i < args.length; i++) {
      console.log(args[i], args[i] === '--range');
      switch (args[i]) {
        case '-d':
        case '--dry-run' :
          query.dryrun = true;
          break;
        case '-1':
        case '--pixel-on':
          query.pixelon = args[i + 1];
          i++;
          break;
        case '-0':
        case '--pixel-off':
          query.pixeloff = args[i + 1];
          i++;
          break;
        case '-n':
        case '--no':
          query.no = true;
          break;
        case '-f':
        case '--format':
          query.format = parseInt(args[i + 1]);
          i++;
          break;
        case '-r':
        case '--range':
          query.range = args[i + 1].split('-');
          i++;
          break;
        default:
          throw Error(args[i] + ' is not an option');
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
  const program = utility.purifyFile(query.subparameter);
  const engineState = engine.prepare(engine.initialize(), program);
  if (!query.dryrun) {
    utility.dumpEngine(engineState, query.state);
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
  const engineState = utility.loadEngine(query.state);
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
  const engineState = utility.loadEngine(query.state);
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
  const cliSource = require('fs').readFileSync(process.argv[1], 'UTF-8');
  const commentedHelp = cliSource
    .match(new RegExp('\\/\\*\\*(.|\\n)*?\\*\\/', 'g'));
  const cleanedHelp = commentedHelp.map(helpSection => {
    return helpSection
      .split('\n')
      .slice(1, -1)
      .map(line => line.replace(/^\s*?\*/, ''))
      .join('\n');
  });
  cleanedHelp.forEach(v => console.log(v, '\n'));
}

function main () {
  [query, args, subcommands] = init();
  query = parseArgument(query, args);
  subcommands[query.subcommand](query);
}

main();
