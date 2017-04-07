'use strict';

let engine = require('engine').initialize();
const addRegisters = require('instructions').addRegisters;

engine.data[0] = 20;
engine.data[1] = 240;
engine.data[2] = 30;

const engine1 = addRegisters(engine, 0, 1);
const engine2 = addRegisters(engine1, 0, 2);

console.log(engine.data[0]);
console.log(engine.data[1]);
console.log(engine.data[2]);
console.log(engine.data[0xF]);

console.log(engine1.data[0]);
console.log(engine1.data[1]);
console.log(engine1.data[2]);
console.log(engine1data[0xF]);

console.log(engine2.data[0]);
console.log(engine2.data[1]);
console.log(engine2.data[2]);
console.log(engine2.data[0xF]);
