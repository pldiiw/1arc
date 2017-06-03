/**
 * @module instruction-set
 */

/**
 * Given a CHIP-8 instruction, it will return a function that represents the
 * effects of this instruction on a CHIP-8 engine.
 * @param {number} inst The instruction from which we will generate the
 * corresponding function.
 * @return {function} The function that the given instruction is linked to, it
 * will only awaits an engine as a parameter.
 */
function instruction (inst) {
  // Determining the instruction
  const stringInstruction = inst.toString(16).padStart(4, '0');
  const allInstructionSchemes = Object.keys(instructions);
  const allInstructionRegexes = allInstructionSchemes
    .map(v => new RegExp(v.replace(/(X|Y|N)/ig, '[0-F]'), 'i'));
  const instructionScheme = allInstructionSchemes
    .filter((v, i) => allInstructionRegexes[i].test(stringInstruction))[0];

  // Determining the arguments
  const X = instructionScheme.indexOf('X');
  const Y = instructionScheme.indexOf('Y');
  const firstN = instructionScheme.indexOf('N');
  const lastN = instructionScheme.lastIndexOf('N');
  const args = [
    stringInstruction[X],
    stringInstruction[Y],
    stringInstruction.slice(firstN, lastN + 1)
  ].filter(v => v !== undefined && v !== '');

  return (engine) => instructions[instructionScheme](engine, ...args);
}

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
 * @param {number} registerA The reigster which imports the value.
 * @param {number} registerB The register which exports the value.
 * @return {Map} Engine with the same value stored in both register.
 */
function copyRegister (engine, registerA, registerB) {
  let data = engine.get('data');
  data[registerA] = data[registerB];

  return engine.set('data', data);
}

/**
 * Add a value to a register.
 * @param {Map} engine
 * @param {number} register The register to which the value will be added.
 * @param {number} value The value added to a register.
 * @return {Map} A new engine.
 */
function addToRegister (engine, register, value) {
  let data = engine.get('data');
  data[0xF] = data[register] + value > 255 ? 1 : 0;
  data[register] += value;

  return engine.set('data', data);
}

/**
 * Add the value of one register onto another one.
 * @param {Map} engine
 * @param {number} registerA The register that will receive the result of the
 * addition.
 * @param {number} registerB The second register to add.
 * @return {Map} A new engine.
 */
function addRegisters (engine, registerA, registerB) {
  let data = engine.get('data');
  data[0xF] = data[registerA] + data[registerB] > 255 ? 1 : 0;
  data[registerA] += data[registerB];

  return engine.set('data', data);
}

/**
 * Subtract value in one register to another one and
 * set VF register to 0 or 1 if borrow occurs or not.
 * @param {Map} engine
 * @param {number} registerA The register which gives the minuend
 * @param {number} registerB The register which gives the subtrahend
 * @return {Map} Engine with the result in the first register.
 */

function subRegisters (engine, registerA, registerB) {
  let data = engine.get('data');

  if (data[registerA] < data[registerB]) {
    data[0xF] = 0x00;
  } else { data[0xF] = 0x01; }

  data[registerA] = -data[registerB];

  return engine.set('data', data);
}

/**
 * Set in one register the result of its value
 * reduced by another one.
 * @param {Map} engine
 * @param {number} registerA The register where result will be stored.
 * @param {number} registerB The register which gives the minuend.
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

/**
 * Set one register to (its value OR value of another).
 * @param {Map} engine
 * @param {number} registerA The register where result will be stored.
 * @param {number} registerB Second register.
 * @return {Map} Engine with stored in registerA, (registerA OR registerB).
 */
function or (engine, registerA, registerB) {
  let data = engine.get('data');
  data[registerA] = data[registerA] | data[registerB];

  return engine.set('data', data);
}

/**
 * Set one register to (its value AND another's value).
 * @param {Map} engine
 * @param {number} registerA The register where result will be stored.
 * @param {number} registerB Second register.
 * @return {Map} Engine with stored in registerA, (registerA AND registerB).
 */
function and (engine, registerA, registerB) {
  let data = engine.get('data');
  data[registerA] = data[registerA] & data[registerB];

  return engine.set('data', data);
}

/**
 * Set one register to (its value XOR another's value).
 * @param {Map} engine
 * @param {number} registerA The register where result will be stored.
 * @param {number} registerB Second register.
 * @return {Map} Engine withe stored un registerA, (registerA XOR registerB).
 */
function xor (engine, registerA, registerB) {
  let data = engine.get('data');
  data[registerA] = data[registerA] ^ data[registerB];

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

/**
 * Skip the following instruction if the register is equal to a given value.
 * @param {Map} engine
 * @param {number} register The register to compare against.
 * @param {number} value The value to compare against the register.
 * @return {Map} A new engine with a pc increased by 2 if register and value
 * were the same, skipping the instruction that was following.
 */
function skipIfValue (engine, register, value) {
  return engine.get('data')[register] === value
    ? engine.set('pc', engine.get('pc') + 2)
    : engine;
}

/**
 * Skip the following instruction if the register is equal to the other
 * register.
 * @param {Map} engine
 * @param {number} registerA The first register to compare.
 * @param {number} registerB The second register to compare against the first.
 * @return {Map} A new engine with a pc increased by 2 if the two registers
 * hold the same value.
 */
function skipIfRegister (engine, registerA, registerB) {
  return engine.get('data')[registerA] === engine.get('data')[registerB]
    ? engine.set('pc', engine.get('pc') + 2)
    : engine;
}

/**
 * Skip the following instruction if the register isn't equal to the given
 * value.
 * @param {Map} engine
 * @param {number} register The register to compare against.
 * @param {number} value The value to compare against the register.
 * @return {Map} A new engine with a pc increased by 2 if register and value
 * aren't equal.
*/
function skipIfNotValue (engine, register, value) {
  return engine.get('data')[register] !== value
    ? engine.set('pc', engine.get('pc') + 2)
    : engine;
}

/**
 * Skip the following instruction if the register is not equal to the other
 * register.
 * @param {Map} engine
 * @param {number} registerA The first register to compare.
 * @param {number} registerB The second register to compare against the first.
 * @return {Map} A new engine with a pc increased by 2 if the two registers
 * didn't hold the same value.
 */
function skipIfNotRegister (engine, registerA, registerB) {
  return engine.get('data')[registerA] !== engine.get('data')[registerB]
    ? engine.set('pc', engine.get('pc') + 2)
    : engine;
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
function fillRegisters (engine, number) {
  const memory = engine.get('memory');
  let data = engine.get('data');

  for (let i = 0; i <= number; i++) {
    data[i] = memory[engine.get('I') + i];
  }

  return engine.set('data', data).set('I', engine.get('I') + number + 1);
}

/**
 */
function dumpBCD (engine, register) {
  let memory = engine.get('memory');
  let value = String(engine.get('data')[register]);
  while (value.length < 3) {
    value = '0'.concat(value);
  }
  for (var a = 0; a < 3; a++) {
    memory[engine.get('I') + a] = parseInt(value[a]);
  }
  engine.set('memory', memory);

  return engine;
}

/**
 * Return from a subroutine
 * @param {Map} engine
 * @return {Map} A new engine that has returned from a subroutine.
 */
function uncall (engine) {
  const newPointer = engine.get('pointer') - 1;
  const newPc = engine.get('stack')[newPointer];

  return engine
    .set('pointer', newPointer)
    .set('pc', newPc);
}

/**
 * Jump to a subroutine.
 * @param {Map} engine
 * @param {number} address Where the start of the subroutine is located.
 * @return {Map} A new engine ready to execute the subroutine.
 */
function call (engine, address) {
  const pointer = engine.get('pointer');
  const pc = engine.get('pc');
  let stack = engine.get('stack');
  stack[pointer] = pc;

  return engine
    .set('pointer', pointer + 1)
    .set('pc', address)
    .set('stack', stack);
}

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

const instructions = {
  //  '00E0': clearDisplay,
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
  //  '8XY6': rightShift,
  '8XY7': subnRegisters,
  //  '8XYE': leftShift,
  '9XY0': skipIfNotRegister,
  'ANNN': setI,
  'BNNN': jump0,
  'CXNN': storeRandom,
  //  'DXYN': drawSprite,
  //  'EX9E': skipIfKeyPress,
  //  'EXA1': skipIfNotKeyPress,
  //  'FX07': dumpTimer,
  //  'FX0A': waitKeyPress,
  //  'FX15': setTimer,
  //  'FX18': setSound,
  'FX1E': addRegisterToI,
  //  'FX29': setIFont,
  'FX33': dumpBCD,
  'FX55': dumpRegisters,
  'FX65': fillRegisters
};

let fn = {};
Object.values(instructions).forEach(v => { fn[v.name] = v; });

module.exports = {
  instruction: instruction,
  instructions: instructions,
  fn: fn
};
