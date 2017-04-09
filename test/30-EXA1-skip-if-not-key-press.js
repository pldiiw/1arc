'use strict';

let engine = require('engine').initialize();
const skipIfNotKeyPress = require('instructions').skipIfNotKeyPress;

engine.data[8] = 0xF;
engine.data[9] = 4;
engine.pc = 128;
engine.keypad[4] = 1;

const engine1 = skipIfNotKeyPress(engine, 8);
const engine2 = skipIfNotKeyPress(engine1, 9);

console.log(engine.pc);
console.log(engine1.pc);
console.log(engine2.pc);
