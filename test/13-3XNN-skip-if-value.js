'use strict';

let engine = require('engine').initialize();
const skipIfValue = require('instructions').skipIfValue;

engine.data[7] = 143;
engine.pc = 200;

const engine1 = skipIfValue(engine, 7, 143);
const engine2 = skipIfValue(engine1, 7, 32);

console.log(engine.pc)
console.log(engine1.pc)
console.log(engine2.pc)
