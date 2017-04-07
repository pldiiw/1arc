'use strict';

let engine = require('engine').initialize();
const skipIfNotRegister = require('instructions').skipIfNotRegister;

engine.data[7] = 143;
engine.data[0xD] = 143;
engine.data[0xE] = 56;
engine.pc = 3049;

const engine1 = skipIfNotRegister(engine, 7, 0xD);
const engine2 = skipIfNotRegister(engine1, 7, 0xE);

console.log(engine.pc);
console.log(engine1.pc);
console.log(engine2.pc);
