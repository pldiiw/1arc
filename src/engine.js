
instructions_table = require('./instructions.js').instructions_table

function serialization_layer(unserialized_string)
{
	/* This function take the chip-8 code as a simple string
	 * if the string was wrote correctly return it with all
	 * letter uppercase else raise an exception */
	if(unserialized_string.length % 4 != 0){
	 	console.error(Error('Instruction must be 4 characters long'));
	 	return null;
	};

	unserialized_string = unserialized_string.toUpperCase();

 	for (var i = 0; i < unserialized_string.length; i += 4)
	{
	//take 4 char in the string and add it to the array serialized_instruction
		if(!check_instruction(unserialized_string.substring(i,i+4))){
			console.error(Error('Unexsting instuction '+ unserialized_string.substring(i,i+4)));
			return null;
		};
	};

	return unserialized_string;
}


function check_instruction(unserialized_instruction)
{
	/* Check if the instruction in parameter exist
	 * First it will check if each characters in the instructions are hexadecimal
	 * Then it will test if the instruction exist in the instruction table */
	for(var letter in unserialized_instruction)
	{
		// Check if all characters are hexadecimal
		if(!/[0-9]|[A-F]/.test(unserialized_instruction[letter])){
			return false;
		};
	};

	instructions_array = Object.keys(instructions_table);

	for(var instruction in instructions_array)
	{
		for (var i = 0; i < unserialized_instruction.length; i++) {
			//Condition test if the character of the unseralized_instructions is correct
			if (!(RegExp(unserialized_instruction[i]+'|N|X|Y').test(instructions_array[instruction][i]))){
				break;
			};
			if(i == unserialized_instruction.length - 1){
				return true;
			};
		}
	}
	return false;
}
