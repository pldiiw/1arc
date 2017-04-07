'use strict';

let engine = require('engine').initialize();
const dumpBCD = require('instructions').dumpBCD;

engine.data[0xB] = 237;
engine.data[0xE] = 14;
engine.I = 100;

const engine1 = dumpBCD(engine, 0xB);
const engine2 = dumpBCD(engine1, 0xE);

console.log(engine1.memory[100]);
console.log(engine1.memory[101]);
console.log(engine1.memory[102]);
console.log(engine1.I);

console.log(engine2.memory[100]);
console.log(engine2.memory[101]);
console.log(engine2.memory[102]);
console.log(engine2.I);
