'use strict';

let engine = require('engine').initialize();
const fillRegisters = require('instructions').fillRegisters;

engine.memory[32] = 43;
engine.memory[33] = 255;
engine.memory[34] = 6;
engine.I = 32;

const engine1 = fillRegisters(engine, 2);

console.log(engine1.data[0]);
console.log(engine1.data[1]);
console.log(engine1.data[2]);
console.log(engine1.I);
