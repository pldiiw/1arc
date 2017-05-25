const engine = require('./engine.js');
const utility = require('./utility.js');

let query = {
  'state': '.engine_state.chip8.txt',
  'subcommand': 'none',
  'subparameter': '',
  'dryrun': false,
  'pixelon': 'x',
  'pixeloff': 'o',
  'no': false,
  'format': 2,
  'range': []
};

var args = process.argv.slice(2);

function parseArgument(querry, args){
	var actual_command = '';
	for (var i = 0; i < args.length; i ++) {
		if (args[i].charAt(0) != '-') {
			if (Object.keys(querry.subcommand).indexOf(args[i]) != -1) {
				querry.subcommand[args[i]]['command']=true;
				actual_command = args[i];
				args.splice(i,1);
				i = args.length;
			};
		};
	};
	if (actual_command == '') {
		console.error('No command found')
	};
	for (var i = 0; i < args.length; i++) {
		switch(args[i]){
			case '-s' || '--state':
				querry.options['state']=args[i+1];
				i++;
				break;
			case '-d' || '--dry-run' :
				if(actual_command == 'load' || actual_command == 'cycle'){
					querry.subcommand[actual_command].dryrun = true;
				};
				break;
			case '-1' || '--pixel-on':
				if (actual_command == 'display') {
					querry.subcommand[actual_command].pixelon = args[i+1];
					i++;
				};
				break;
			case '-0' || '--pixel-off':
				if (actual_command == 'display') {
					querry.subcommand[actual_command].pixeloff = args[i+1];
					i++;
				};
				break;
			case '-n' || '--no':
				if (actual_command == 'input') {
					querry.subcommand[actual_command].no = true;
				};
				break;
			case '-f' || '--format':
				if (actual_command == 'inspect') {
					querry.subcommand[actual_command].format = args[i+1];
					i++;
				};
				break;
			case '-r' || '--range':
				if (actual_command == 'inspect') {
					querry.subcommand[actual_command].range = args[i+1];
					i++;
				};
				break;
			default:
				console.log(args[i]+' is not an option');
		};
	};
	return querry;
};

console.log(parseArgument(querry, args));

function load (query) {
  const program = utility.purifyFile(query.subparameter);
  const EngineState = engine.initialize().prepare(newEngineState, program);
  if (!query.dryrun) {
    utility.dumpEngine(preparedEngineState, query.state);
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
        .map((row, row_index) => {
          return row
            .map((pixel, col_index) => `${col_index},${row_index} ${pixel}`)
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
  const cliSource = require('fs').readFileSync(process.argv[1], "UTF-8");
  const commentedHelp = cliSource
    .match(new RegExp('\\/\\*\\*(.|\\n)*?\\*\\/', 'g'));
  const cleanedHelp = commentedHelp.map(helpSection => {
    return helpSection
      .split('\n')
      .slice(1, -1)
      .map(line => line.replace(/^\s*?\*\, ''))
      .join('\n');
  });
  cleanedHelp.forEach(v => console.log(v, '\n'));
}
