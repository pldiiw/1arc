'use strict';

let engine = require('engine').initialize();
const call = require('instruction').call;

engine.pointer = 4;
engine.pc = 100;

const engine1 = call(engine, 500);

console.log(engine1.pointer);
console.log(engine1.stack[4]);
console.log(engine1.pc);
