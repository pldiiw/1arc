'use strict';

let engine = require('engine').initialize();
const leftShift = require('instructions').leftShift;

engine.data[1] = 121;
engine.data[0xA] = 200;

const engine1 = leftShift(engine, 1, 1);
const engine2 = leftShift(engine1, 1, 0xA);

console.log(engine.data[1]);
console.log(engine.data[0xA]);
console.log(engine.data[0xF]);

console.log(engine1.data[1]);
console.log(engine1.data[0xA]);
console.log(engine1.data[0xF]);

console.log(engine2.data[1]);
console.log(engine2.data[0xA]);
console.log(engine2.data[0xF]);

