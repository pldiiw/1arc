var querry = {
	//Options :
	options:{
		state: '.engine_state.chip8.txt',
	},
	//subcommand :
	subcommand:{
		load: {
			command: false,
			dryrun: false,
		},
		cycle: {
			command: false,
			dryrun: false,
		},
		display: {
			command: false,
			pixelon: false,
			pixeloff: false,
		},
		input: {
			command: false,
			no: false,
		},
		inspect: {
			command:false,
			format: false,
			range: false,
		},
		help: {
			command: false,
		},
	},
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

