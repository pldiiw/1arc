'use strict';

// No key pressed? Decrement program counter in order to re-read the
// waitKeyPress instruction.
// Key pressed? Apply normal behaviour: save key value into register.

let engine = require('engine').initialize();
const waitKeyPress = require('instructions').waitKeyPress;

engine.data[0xB] = 230;

engine.pc = 4000;
const engine1 = waitKeyPress(engine, 0xB);

engine.keypad[7] = 1;
const engine2 = waitKeyPress(engine, 0xB);

console.log(engine1.data[0xB]);
console.log(engine1.pc);
console.log(engine2.data[0xB]);
console.log(engine2.pc);
