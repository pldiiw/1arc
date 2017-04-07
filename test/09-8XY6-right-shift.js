'use strict';

let engine = require('engine').initialize();
const rightShift = require('instructions').rightShift;

engine.data[8] = 121;
engine.data[9] = 200;

const engine1 = rightShift(engine, 8, 8);
const engine2 = rightShift(engine1, 8, 9);

console.log(engine.data[8]);
console.log(engine.data[9]);
console.log(engine.data[0xF]);

console.log(engine1.data[8]);
console.log(engine1.data[9]);
console.log(engine1.data[0xF]);

console.log(engine2.data[8]);
console.log(engine2.data[9]);
console.log(engine2.data[0xF]);
