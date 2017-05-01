/**
 * @module engine
 */

/**
 * Generate an empty CHIP-8 engine.
 * @return {Object} Empty engine
 */
function initialize() {
  return {
    data: new Uint8Array(16),
    I: 0,
    timer: 0,
    sound: 0,
    memory: new Uint8Array(4096),
    pc: 0,
    pointer: 0,
    stack: new Uint16Array(16),
    display: Array(32).fill(Array(64).fill(false)),
    keypad: Array(16).fill(false)
  };
}

module.exports = {
  initialize: initialize
};
