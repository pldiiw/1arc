'use strict';

let engine = require('engine').initialize();
const uncall = require('instructions').uncall;

engine.pointer = 0xA;
engine.stack[9] = 300;
engine.pc = 1000;

const engine1 = uncall(engine);

console.log(engine1.pointer);
console.log(engine1.pc);
