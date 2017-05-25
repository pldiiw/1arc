/**
 * Store a number in a register.
 * @param {Map} engine
 * @param {number} register The register where the number will be stored.
 * @param {number} value Value which will be store .
 * @return {Map} Engine with value stored in register.
 */
function setRegister (engine, register, value) {
  let data = engine.get('data');
  data[register] = value;

  return engine.set('data', data);
}

/**
 * Store the value in one register to another register
 * @param {Map} engine
 * @param {number} register1 The reigster which imports the value.
 * @param {number} register2 The register which exports the value.
 * @return {Map} Engine with the same value stored in both register.
 */
function copyRegister (engine, register1, register2) {
  let data = engine.get('data');
  data[register1] = data[register2];

  return engine.set('data', data);
}

/**
 * Add a number to a register.
 * @param {Map} engine
 * @param {number} register The register to which the value will be add.
 * @param {number} value The value added to a register.
 * @return {Map} Engine with number added to a register.
 */
function addToRegister (engine, register, value) {
  let data = engine.get('data');

  if (data[register] + value > 255) {
    data[0xF] = 0x01;
  } else { data[0xF] = 0x00; }

  data[register] = +value;

  return engine.set('data', data);
}

/**
 * Add value in one register to another one and
 * set VF register to 1 or 0 if carry occurs or not.
 * @param {Map} engine
 * @param {number} register1 The register to which the value will be add.
 * @param {number} register2 The register of which the value added came from.
 * @return {Map} Engine with one register's value added to another one.
 */
function addRegisters (engine, register1, register2) {
  let data = engine.get('data');

  if ((data[register1] + data[register2]) > 255) {
    data[0xF] = 0x01;
  } else { data[0xF] = 0x00; }

  data[register1] = +data[register2];

  return engine.set('data', data);
}

/**
 * Subtract value in one register to another one and
 * set VF register to 0 or 1 if borrow occurs or not.
 * @param {Map} engine
 * @param {number} register1 The register which gives the minuend
 * @param {number} register2 The register which gives the subtrahend
 * @return {Map} Engine with the result in the first register.
 */

function subRegisters (engine, register1, register2) {
  let data = engine.get('data');

  if (data[register1] < data[register2]) {
    data[0xF] = 0x00;
  } else { data[0xF] = 0x01; }

  data[register1] = -data[register2];

  return engine.set('data', data);
}

/**
 * Set in one register the result of its value
 * reduced by another one.
 * @param {Map} engine
 * @param {number} register1 The register where result will be stored.
 * @param {number} register2 The register which gives the minuend.
 * @return {Map} Engine with result in the first register.
 */
function subnRegisters (engine, minRegister, subsRegister) {
  let data = engine.get('data');

  if (data[minRegister] < data[subsRegister]) {
    data[0xF] = 0x00;
  } else { data[0xF] = 0x01; }

  data[minRegister] = data[minRegister] - data[subsRegister];

  return engine.set('data', data);
}

/// Logic

/**
 * Set one register to (its value OR value of another).
 * @param {Map} engine
 * @param {number} register1 The register where result will be stored.
 * @param {number} register2 Second register.
 * @return {Map} Engine with stored in register1, (register1 OR register2).
 */
function or (engine, register1, register2) {
  let data = engine.get('data');
  data[register1] = data[register1] | data[register2];

  return engine.set('data', data);
}

/**
 * Set one register to (its value AND another's value).
 * @param {Map} engine
 * @param {number} register1 The register where result will be stored.
 * @param {number} register2 Second register.
 * @return {Map} Engine with stored in register1, (register1 AND register2).
 */
function and (engine, register1, register2) {
  let data = engine.get('data');
  data[register1] = data[register1] & data[register2];

  return engine.set('data', data);
}

/**
 * Set one register to (its value XOR another's value).
 * @param {Map} engine
 * @param {number} register1 The register where result will be stored.
 * @param {number} register2 Second register.
 * @return {Map} Engine withe stored un register1, (register1 XOR register2).
 */
function xor (engine, register1, register2) {
  let data = engine.get('data');
  data[register1] = data[register1] ^ data[register2];

  return engine.set('data', data);
}

// Jumps

/**
 * Jump to a memory address.
 * @param {Map} engine
 * @param {number} instructionNumber Memory's value that it will jump to.
 * @return {Map} Engine with new value for program counter.
 */
function jump (engine, instructionNumber) {
  return engine.set('pc', instructionNumber);
}

/**
 * Jump to location nnn + VO.
 * @param {Map} engine
 * @param {number} numberToAdd Value to add to V0 to constitute.
 * program counter new value.
 * @preturn {Map} Engine with new value for program counter.
 */
function jump0 (engine, numberToAdd) {
  return engine.set('pc', engine.get('data')[0] + numberToAdd);
}

// I register

/**
 * Store a memory address in register I.
 * @param {Map} engine
 * @param {number} newValue Memory address to assign to I.
 * @return {Map} Engine with new value for I register.
 */
function setI (engine, newValue) {
  return engine.set('I', newValue);
}

/**
 * Add register's value to register I.
 * @param {Map} engine
 * @param {number} register The register where came from added value
 * @preturn {Map} Engine with new value for I register.
 */
function addRegisterToI (engine, register) {
  return engine.set('I', engine.get('I') + engine.get('data')[register]);
}

// Skip instructions

/**
 * Skip the following instruction if a register value equals to another value.
 * @param {Map} engine
 * @param {number} register Gives The comparative.
 * @param {number} number Is the comparing.
 * @return {Map} Engine with pc value increase by 2 if equal or not otherwise.
 */
function skipIfValue (engine, register, number) {
  let data = engine.get('data');

  if (data[register] === number) {
    return engine.set('pc', engine.get('pc') + 2);
  } else { return engine.get('pc'); }
}

/**
 * Skip the following instruction if register's value equals
 * to another register's value.
 * @param {Map} engine
 * @param {number} register1 Gives the comparative.
 * @param {number} register2 Gives the comparing.
 * @return {Map} Engine with pc value increase by 2 if equal or not otherwise.
 */
function skipIfRegister (engine, register1, register2) {
  let data = engine.get('data');

  if (data[register1] === data[register2]) {
    return engine.set('pc', engine.get('pc') + 2);
  } else { return engine.get('pc'); }
}

/**
 * Skip the following instruction if a register value isn't equal to another value.
 * @param {Map} engine
 * @param {number} register Gives The comparative.
 * @param {number} number Is the comparing.
 * @return {Map} Engine with pc value increase by 2 if different or not otherwise.
*/
function skipIfNotValue (engine, register, number) {
  let data = engine.get('data');

  if (data[register] !== number) {
    return engine.set('pc', engine.get('pc') + 2);
  } else { return engine.get('pc'); }
}

/**
 * Skip the following instruction if register's value is different
 * to another register's value.
 * @param {Map} engine
 * @param {number} register1 Gives the comparative.
 * @param {number} register2 Gives the comparing.
 * @return {Map} Engine with pc value increase by 2 if different or not otherwise.
 */
function skipIfNotRegister (engine, register1, register2) {
  let data = engine.get('data');

  if (data[register1] !== data[register2]) {
    return engine.set('pc', engine.get('pc') + 2);
  } else { return engine.get('pc'); }
}

/**
 * Store the values of registers V0 though lastRegister in memory starting
 * at address stored in register I
 * @param {Map} engine
 * @param {number} lastRegister Is the last register, inclusive
 * @return {Map} Engine with
 */
function dumpRegisters (engine, lastRegister) {
  let memory = engine.get('memory');
  const data = engine.get('data');

  for (let i = 0; i <= lastRegister; i++) {
    memory[engine.get('I') + i] = data[i];
  }

  return engine.set('memory', memory).set('I', engine.get('I') + lastRegister + 1);
}
/**
 * Fill register V0 through VX with values stored in  memory starting
 * at address I. 
 * @param {Map} engine
 * @param {number} lastMemory Is the last register, inclusive
 */

function fillRegisters(engine, number){
	const memory = engine.get('memory');
	let data = engine.get('data');
	
	for (let i = 0 ; a <= number ; i++){
		data[i] = memory[engine.get('I') + i]
	};
	
	return engine.set('data', data).set('I', engine.get('I') + number + 1)
}




/**
 */
function dumpBCD(engine, register){
	let memory = engine.get('memory');
	let value = String(engine.get('data')[register]);
	while (value.length < 3) {
		value = '0'.concat(value)};
	for (var a = 0 ; a<3 ; a++) {
		memory[engine.get('I') + a] = parseInt(value [a])};
	engine.set('memory', memory);
	
	return engine
}


