'use strict';

let engine = require('engine').initialize();
const dumpRegisters = require('instructions').dumpRegisters;

engine.data[0] = 54;
engine.data[1] = 128;
engine.data[2] = 4;
engine.data[3] = 230;
engine.data[4] = 18;
engine.I = 10;

const engine1 = dumpRegisters(engine, 4);

console.log(engine1.memory[10]);
console.log(engine1.memory[11]);
console.log(engine1.memory[12]);
console.log(engine1.memory[13]);
console.log(engine1.memory[14]);
console.log(engine1.I);
