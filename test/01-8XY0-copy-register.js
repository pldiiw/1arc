'use strict';

let engine = require('engine').initialize();
const copyRegister = require('instructions').copyRegister;

engine.data[5] = 230;
engine.data[0xD] = 129;

const engine1 = copyRegister(engine, 5, 0xD);

console.log(engine.data[5]);
console.log(engine.data[0xD]);
console.log(engine1.data[5]);
console.log(engine1.data[0xD]);
