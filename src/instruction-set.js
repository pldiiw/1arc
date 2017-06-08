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
  ].filter(v => v !== undefined && v !== '').map(v => parseInt(v, 16));

  return (engine) => instructions[instructionScheme](engine, ...args);
}

/**
 * Does nothing, just return the engine. Used when reading a '0000'
 * instruction.
 * @param {Map} engine
 * @return {Map} The same engine.
 */
function idle (engine) {
  return engine;
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
 * @param {number} registerA The register to copy the value into.
 * @param {number} registerB The register from which the value will be copied.
 * @return {Map} A new engine.
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
  let result = data[register] + value;
  data[0xF] = result > 255 ? 1 : 0;
  data[register] = result;

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
  let result = data[registerA] + data[registerB];
  data[0xF] = result > 255 ? 1 : 0;
  data[registerA] = result;

  return engine.set('data', data);
}

/**
 * Subtract the value of registerB from registerA.
 * @param {Map} engine
 * @param {number} registerA The register that the will hold the result of the
 * operation.
 * @param {number} registerB The register holding the value that registerA will
 * be subtracted from.
 * @return {Map} A new engine.
 */
function subRegisters (engine, registerA, registerB) {
  let data = engine.get('data');
  let result = data[registerA] - data[registerB];
  data[0xF] = result < 0 ? 0 : 1;
  data[registerA] = result;

  return engine.set('data', data);
}

/**
 * Store the result of registerB - registerA into registerA.
 * @param {Map} engine
 * @param {number} registerA The register where result will be stored.
 * @param {number} registerB The register that will be subtracted against
 * registerA.
 * @return {Map} A new engine.
 */
function subnRegisters (engine, registerA, registerB) {
  let data = engine.get('data');
  let result = data[registerB] - data[registerA];
  data[0xF] = result < 0 ? 0 : 1;
  data[registerA] = result;

  return engine.set('data', data);
}

/**
 * Store into registerA the result of registerA OR registerB.
 * @param {Map} engine
 * @param {number} registerA The register where the result will be stored.
 * @param {number} registerB The register that will be ORed with registerA.
 * @return {Map} A new engine.
 */
function or (engine, registerA, registerB) {
  let data = engine.get('data');
  data[registerA] |= data[registerB];

  return engine.set('data', data);
}

/**
 * Store into registerA the result of registerA AND registerB.
 * @param {Map} engine
 * @param {number} registerA The register where the result will be stored.
 * @param {number} registerB The register that will be ANDed with registerA.
 * @return {Map} A new engine.
 */
function and (engine, registerA, registerB) {
  let data = engine.get('data');
  data[registerA] &= data[registerB];

  return engine.set('data', data);
}

/**
 * Store into registerA the result of registerA XOR registerB.
 * @param {Map} engine
 * @param {number} registerA The register where the result will be stored.
 * @param {number} registerB The register that will be XORed with registerA.
 * @return {Map} A new engine.
 */
function xor (engine, registerA, registerB) {
  let data = engine.get('data');
  data[registerA] ^= data[registerB];

  return engine.set('data', data);
}

// Jumps

/**
 * Jump to a memory address.
 * @param {Map} engine
 * @param {number} address The address to which the PC will be set.
 * @return {Map} A new engine.
 */
function jump (engine, address) {
  return engine.set('pc', address - 2);
}

/**
 * Jump to a given address + the value that register 0 holds.
 * @param {Map} engine
 * @param {number} address The address minus register 0 we want to reach.
 * @preturn {Map} A new engine.
 */
function jump0 (engine, address) {
  return engine.set('pc', engine.get('data')[0] + address - 2);
}

/**
 * Store a memory address in register I.
 * @param {Map} engine
 * @param {number} address Memory address to assign to I.
 * @return {Map} A new engine.
 */
function setI (engine, address) {
  return engine.set('I', address);
}

/**
 * Add given register to register I.
 * @param {Map} engine
 * @param {number} register The register that we want add to add to I.
 * @preturn {Map} A new engine.
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
 * Store the values of registers V0 through lastRegister into the memory
 * starting at address stored in register I.
 * @param {Map} engine
 * @param {number} lastRegister The end of the range of dumped registers,
 * inclusive.
 * @return {Map} A new engine.
 */
function dumpRegisters (engine, lastRegister) {
  const data = engine.get('data');
  let memory = engine.get('memory');

  for (let i = 0; i <= lastRegister; i++) {
    memory[engine.get('I') + i] = data[i];
  }

  return engine
    .set('memory', memory)
    .set('I', engine.get('I') + lastRegister + 1);
}

/**
 * Fill register 0 through lastRegister with the values stored in the memory
 * starting at address I.
 * @param {Map} engine
 * @param {number} lastRegister The end of the range of the registers we want
 * to fill, inclusive.
 * @return {Map} A new engine.
 */
function fillRegisters (engine, lastRegister) {
  let data = engine.get('data');
  const memory = engine.get('memory');

  for (let i = 0; i <= lastRegister; i++) {
    data[i] = memory[engine.get('I') + i];
  }

  return engine
    .set('data', data)
    .set('I', engine.get('I') + lastRegister + 1);
}

/**
 * Dump into the memory a BCD representation of the value stored inside a given
 * register, with each decimal digit inside one memory cell.
 * @param {Map} engine
 * @param {number} register The register to dump into the memory as a BCD.
 * @return {Map} A new engine.
 */
function dumpBCD (engine, register) {
  let memory = engine.get('memory');

  engine.get('data')[register]
    .toString()
    .padStart(3, '0')
    .split('')
    .forEach((v, i) => {
      memory[engine.get('I') + i] = parseInt(v);
    });

  return engine.set('memory', memory);
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
    .set('pc', address - 2)
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

/**
 * Halts program execution until a key is pressed and store the pressed key in
 * the given register. It waits for the input by decrementing the PC by 2 when
 * no ky is pressed, making the next cycle read this same instruction again.
 * @param {Map} engine
 * @param {number} register The register where the key code will be stored.
 * @return {Map} A new engine.
 */
function waitKeyPress (engine, register) {
  let data = engine.get('data');
  let pc = engine.get('pc');
  const keypad = engine.get('keypad');
  const keyPressed = keypad.indexOf(true);

  if (keyPressed >= 0) {
    data[register] = keyPressed;
  } else {
    pc -= 2;
  }

  return engine.set('data', data).set('pc', pc);
}

/**
 * Skip next instruction if the key value stored inside the given register
 * corresponds to a key that is currently pressed.
 * @param {Map} engine
 * @param {number} register The register where the key value to match is
 * stored.
 * @return {Map} A new engine.
 */
function skipIfKeyPress (engine, register) {
  const key = engine.get('data')[register];
  const keypad = engine.get('keypad');
  let pc = engine.get('pc');

  if (keypad[key]) {
    pc += 2;
  }

  return engine.set('pc', pc);
}

/**
 * Skip next instruction if the key value stored inside the given register
 * corresponds to a key that is not currently pressed.
 * @param {Map} engine
 * @param {number} register The register where the key value to match is
 * stored.
 * @return {Map} A new engine.
 */
function skipIfNotKeyPress (engine, register) {
  const key = engine.get('data')[register];
  const keypad = engine.get('keypad');
  let pc = engine.get('pc');

  if (!keypad[key]) {
    pc += 2;
  }

  return engine.set('pc', pc);
}

/**
 * Set the timer to the value stored inside the given register.
 * @param {Map} engine
 * @param {number} register The register that holds the value we want to set
 * the timer to.
 * @return {Map} A new engine.
 */
function setTimer (engine, register) {
  return engine.set('timer', engine.get('data')[register]);
}

/**
 * Store the value of the timer in the given register.
 * @param {Map} engine
 * @param {number} register Where timer's value will be stored.
 * @return {Map} A new engine.
 */
function dumpTimer (engine, register) {
  let data = engine.get('data');
  data[register] = engine.get('timer');

  return engine.set('data', data);
}

/**
 * Set the sound register to the value stored inside the given register.
 * @param {Map} engine
 * @param {number} register The register that holds the value we want to set
 * the sound register to.
 * @return {Map} A new engine.
 */
function setSound (engine, register) {
  return engine.set('sound', engine.get('data')[register]);
}

/**
 * Draw a sprite onto the engine's display. The sprite read is stored inside
 * the memory, starting at the value of register I up to the given sprite
 * length (bytes). This sprite is drawn on the display from the X coordinate
 * stored inside registerA and the Y coordinate stored inside registerB.
 * @param {Map} engine
 * @param {number} registerA Where to draw on the X axis.
 * @param {number} registerB Where to draw on the Y axis.
 * @param {number} spriteLength Sprite's length in bytes, each byte being a
 * row that will be drawn.
 * @return {Map} A new engine.
 */
function drawSprite (engine, registerA, registerB, spriteLength) {
  let display = engine.get('display');
  let data = engine.get('data');
  const memory = engine.get('memory');
  const I = engine.get('I');
  const x = data[registerA];
  const y = data[registerB];
  const sprites = Array.from(memory)
    .slice(I, I + spriteLength)
    .map(v => {
      return v
        .toString(2)
        .padStart(8, '0')
        .split('')
        .map(v => v === '1');
    });
  let xored = false;

  sprites.forEach((sprite, j) => {
    sprite.forEach((pixel, i) => {
      const summedX = x + i;
      const summedY = y + j;
      const wrappedX = summedX % 64;
      const wrappedY = summedY % 32;

      xored = pixel && display[wrappedY][wrappedX] === pixel
        ? true
        : xored;

      display[wrappedY][wrappedX] = (display[wrappedY][wrappedX] ^ pixel) === 1;
    });
  });

  data[0xF] = xored ? 1 : 0;

  return engine.set('data', data).set('display', display);
}

/**
 * Set all display's pixels to false (off).
 * @param {Map} engine
 * @return {Map} A new engine.
 */
function clearDisplay (engine) {
  return engine.set('display',
    Array.from({ length: 32 }).map(_ => Array(64).fill(false)));
}

/**
 * Set I register to the memory address of the CHIP-8 built-in font holding the
 * hexadecimal digit stored inside the given register. To cope with every
 * value that register can hand out, its value is moduled by 16.
 * @param {Map} engine
 * @param {number} register The register that contains the hexadecimal digit we
 * want register I to point to.
 * @return {Map} A new engine.
 */
function setIFont (engine, register) {
  return engine.set('I', engine.get('data')[register] % 16 * 5);
}

/**
 * Store in registerA the value of registerB shifted to the right by one bit.
 * Set register F to the least significant bit prior to the shift.
 * @param {Map} engine
 * @param {number} registerA The register where the shifted value will be
 * stored.
 * @param {number} registerB The register holding to the value to shift.
 * @return {Map} A new engine.
 */
function rightShift (engine, registerA, registerB) {
  let data = engine.get('data');
  data[0xF] = data[registerB] & 1;
  data[registerA] = data[registerB] >>> 1;

  return engine.set('data', data);
}

/**
 * Store in registerA the value of registerB shifted to the left by one bit.
 * Set register F to the most significant bit prior to the shift.
 * @param {Map} engine
 * @param {number} registerA The register where the shifted value will be
 * stored.
 * @param {number} registerB The register holding to the value to shift.
 * @return {Map} A new engine.
 */
function leftShift (engine, registerA, registerB) {
  let data = engine.get('data');
  data[0xF] = data[registerB] >>> 7;
  data[registerA] = data[registerB] << 1;

  return engine.set('data', data);
}

const instructions = {
  '0000': idle,
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
Object.values(instructions).forEach(v => { fn[v.name] = v; });

module.exports = {
  instruction: instruction,
  instructions: instructions,
  fn: fn
};
