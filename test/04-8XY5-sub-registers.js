'use strict';

let engine = require('engine').initialize();
const subRegisters = require('instructions').subRegisters;

engine.data[9] = 40;
engine.data[0xA] = 30;
engine.data[0xB] = 200;

const engine1 = subRegisters(engine, 9, 0xA);
const engine2 = subRegisters(engine1, 9, 0xB);
const engine3 = subRegisters(engine, 9, 0xB);

console.log(engine.data[9]);
console.log(engine.data[0xA]);
console.log(engine.data[0xB]);
console.log(engine.data[0xF]);

console.log(engine1.data[9]);
console.log(engine1.data[0xA]);
console.log(engine1.data[0xB]);
console.log(engine1.data[0xF]);

console.log(engine2.data[9]);
console.log(engine2.data[0xA]);
console.log(engine2.data[0xB]);
console.log(engine2.data[0xF]);

console.log(engine3.data[9]);
console.log(engine3.data[0xA]);
console.log(engine3.data[0xB]);
console.log(engine3.data[0xF]);
