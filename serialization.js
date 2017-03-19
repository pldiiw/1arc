function serialization_layer(unserialized_string)
{
/*Take a string in input and return an array
 *This function  cut the string into multiples string with 4 chars in it and
 *push in an array */
	var serialized_instruction = [];
	for (var i = 0; i < unserialized_string.length; i += 4)
	{
		//take 4 chars in the string and add it to the array serialized_instruction
		serialized_instruction.push(unserialized_string.substring(i,i+4));
	};	
	return serialized_instruction
}