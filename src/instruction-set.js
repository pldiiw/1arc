
function clearDisplay(engine){}
function uncall(engine){}
function jump(engine, instruction_number){}
function call(engine, jumpto){}
function skipIfValue(engine, register, number){}
function skipIfNotValue(engine, register, number){}
function skipIfRegister(engine, register1, register2){}
function setRegister(engine, register, data){}
function or(engine, register1, register2){}
function and(engine, register1, register2){}
function xor(engine, register1, register2){}
function addToRegister(engine, register, data){}
function copyRegister(engine, register1, register2){}
function addRegisters(engine, register1, register2){}
function subRegisters(engine, register1, register2){}
function rightShift(engine, register1, register2){}
function subnRegisters(engine, register1, register2){}
function leftShift(engine, register1, register2){}
function skipIfNotRegister(engine, register1, register2){}
function setI(engine, value){}
function jump0(engine, number_to_add){}

/**
 * Store a random number in a register.
 * @param {Map} engine
 * @param {number} register The register where the random number will be stored.
 * @param {number} mask ANDed with the random number.
 * @return {Map} Engine with the random number stored in register.
 */
function storeRandom (engine, register, mask) {
	let data = engine.get('data');
	data[register] = Math.floor(Math.random() * 256) & mask;
	return engine.set('data', data);
}

function drawSprite(engine, register1, register2, number){}
function skipIfKeyPress(engine, register){}
function skipIfNotKeyPress(engine, register){}
function dumpTimer(engine, register){}
function waitKeyPress(engine, register){}
function setTimer(engine, register){}
function setSound(engine, register){}
function addRegisterToI(engine, register){}
function setIFont(engine, register){}
function dumpBCD(engine, register){}
function dumpRegisters(engine, number){}
function fillRegisters(engine, number){}

const instructions = {
	'00E0': clearDisplay,
	'00EE': uncall,
	'1NNN': jump,
	'2NNN': call,
	'3XNN': skipIfValue,
	'4XNN': skipIfNotValue,
	'5XY0': skipIfRegister,
	'6XNN': setRegister,
	'7XNN': addToRegister,
	'8XY0': copyRegister,
	'8XY1': or,
	'8XY2': and,
	'8XY3': xor,
	'8XY4': addRegisters,
	'8XY5': subRegisters,
	'8XY6': rightShift,
	'8XY7': subnRegisters,
	'8XYE': leftShift,
	'9XY0': skipIfNotRegister,
	'ANNN': setI,
	'BNNN': jump0,
	'CXNN': storeRandom,
	'DXYN': drawSprite,
	'EX9E': skipIfKeyPress,
	'EXA1': skipIfNotKeyPress,
	'FX07': dumpTimer,
	'FX0A': waitKeyPress,
	'FX15': setTimer,
	'FX18': setSound,
	'FX1E': addRegisterToI,
	'FX29': setIFont,
	'FX33': dumpBCD,
	'FX55': dumpRegisters,
	'FX65': fillRegisters
};

let fn = {};
Object.values(instructions).forEach(v => fn[v.name] = v);

module.exports = {
	instructions: instructions,
	fn: fn
};