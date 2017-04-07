'use strict';

let engine = require('engine').initialize();
const skipIfNotValue = require('instructions').skipIfNotValue;

engine.data[7] = 143;
engine.pc = 200;

const engine1 = skipIfNotValue(engine, 7, 143);
const engine2 = skipIfNotValue(engine1, 7, 32);

console.log(engine.pc)
console.log(engine1.pc)
console.log(engine2.pc)
