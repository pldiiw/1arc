/*This array contain all possible instruction in CHIP-8
 *`N` is a hexadecimal digit.
 *`X` and `Y` represents arbitrary data registers.*/
instructions_table = {
	'00E0' : function(){},
	'00EE' : function(){},
	'0NNN' : function(){},
	'1NNN' : function(){},
	'2NNN' : function(){},
	'3XNN' : function(){},
	'4XNN' : function(){},
	'5XY0' : function(){},
	'6XNN' : function(){},
	'7XNN' : function(){},
	'8XY0' : function(){},
	'8XY1' : function(){},
	'8XY2' : function(){},
	'8XY3' : function(){},
	'8XY4' : function(){},
	'8XY5' : function(){},
	'8XY6' : function(){},
	'8XY7' : function(){},
	'8XYE' : function(){},
	'9XY0' : function(){},
	'ANNN' : function(){},
	'BNNN' : function(){},
	'CXNN' : function(){},
	'DXYN' : function(){},
	'EX9E' : function(){},
	'EXA1' : function(){},
	'FX07' : function(){},
	'FX0A' : function(){},
	'FX15' : function(){},
	'FX18' : function(){},
	'FX1E' : function(){},
	'FX29' : function(){},
	'FX33' : function(){},
	'FX55' : function(){},
	'FX65' : function(){}
};

// Allow importation of the instruction_table when import ./instructions.js
module.exports.instructions_table = instructions_table;