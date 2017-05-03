/**
 * @module engine
 */

const instruction = require('./instruction-set.js').instruction;

/**
 * Generate an empty CHIP-8 engine.
 * @return {Map} Empty engine
 */
function initialize () {

  return new Map([
    ['data', new Uint8Array(16)],
    ['I', 0],
    ['timer', 0],
    ['sound', 0],
    ['memory', new Uint8Array(4096)],
    ['pc', 0],
    ['pointer', 0],
    ['stack', new Uint16Array(16)],
    ['display', Array(32).fill(Array(64).fill(false))],
    ['keypad', Array(16).fill(false)]
  ]);
}

/**
 * Load the built-in CHIP-8 font into memory.
 * @param {Map} engine The engine in which the font should be loaded into.
 * @return {Map} The engine with the font loaded.
 */
function loadFont (engine) {

  const font = Uint8Array.from([
    0xF0, 0x90, 0x90, 0x90, 0xF0, // 0
    0x20, 0x60, 0x20, 0x20, 0x70, // 1
    0xF0, 0x10, 0xF0, 0x80, 0xF0, // 2
    0xF0, 0x10, 0xF0, 0x10, 0xF0, // 3
    0x90, 0x90, 0xF0, 0x10, 0x10, // 4
    0xF0, 0x80, 0xF0, 0x10, 0xF0, // 5
    0xF0, 0x80, 0xF0, 0x90, 0xF0, // 6
    0xF0, 0x10, 0x20, 0x40, 0x40, // 7
    0xF0, 0x90, 0xF0, 0x90, 0xF0, // 8
    0xF0, 0x90, 0xF0, 0x10, 0xF0, // 9
    0xF0, 0x90, 0xF0, 0x90, 0x90, // A
    0xE0, 0x90, 0xE0, 0x90, 0xE0, // B
    0xF0, 0x80, 0x80, 0x80, 0xF0, // C
    0xE0, 0x90, 0x90, 0x90, 0xE0, // D
    0xF0, 0x80, 0xF0, 0x80, 0xF0, // E
    0xF0, 0x80, 0xF0, 0x80, 0x80  // F
  ]);

  return engine.set('memory',
    engine.get('memory').map((v, i) => font[i] ? font[i] : v));
}

/**
 * Load a given CHIP-8 program into the engine's memory.
 * @param {Map} engine The CHIP-8 engine in which we will feed the program
 * into.
 * @param {string} program The CHIP-8 program. It is a bare suite of
 * instructions.
 * @return {Map} The new engine, with program loaded.
 */
function loadProgram (engine, program) {

  const parsedProgram = program.match(/.{1,2}/g).map(v => parseInt(v, 16));

  return engine.set('memory',
    engine.get('memory').map((v, i) => {
      return i >= 512 && i < 512 + parsedProgram.length ? parsedProgram[i] : v;
    }));
}

/**
 * Fill the CHIP-8 engine with the necessary data in order to get it ready to
 * run.
 * @param {Map} engine The CHIP-8 engine from which we set up everything.
 * @param {string} program The program that will be loadid into the engine's
 * memory.
 * @return {Map} The engine ready to cycle.
 */
function prepare (engine, program) {

  return loadProgram(loadFont(engine), program).set('pc', 0x200);
}

/**
 * Run one cycle of CHIP-8 engine.
 * @param {Map} engine The engine from which the cycle will be run against.
 * @return {Map} A new CHIP-8 engine that take into account what happened
 * during the cycle.
 */
function cycle (engine) {

  // Return right away if we already reached the end of the memory.
  if (engine.get('pc') > 0xFFF) { return; }

  const currentPC = engine.get('pc');
  const currentInstruction = engine.get('memory')
    .slice(currentPC, currentPC + 2)
    .reduce((a, v) => a + v.toString(16), '');

  const executedInstructionEngine = instruction(currentInstruction)(engine);

  const currentTimer = executedInstructionEngine.get('timer');
  const DecTimerEngine = executedInstructionEngine.set('timer',
    currentTimer > 0 ? currentTimer - 1 : currentTimer);

  const currentSound = DecTimerEngine.get('sound');
  const DecSoundEngine = DecTimerEngine.set('sound',
    currentSound > 0 ? currentSound - 1 : currentSound);

  const incPCEngine = DecSoundEngine.set('pc', engine.get('pc') + 2);

  return incPCEngine;
}

module.exports = {
  initialize: initialize,
  loadFont: loadFont,
  loadProgram: loadProgram,
  prepare: prepare,
  cycle: cycle
};
