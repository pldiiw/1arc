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

function help (query){
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


