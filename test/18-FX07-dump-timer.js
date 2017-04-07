'use strict';

let engine = require('engine').initialize();
const dumpTimer = require('instructions').dumpTimer;

engine.data[2] = 120;
engine.timer = 230;

const engine1 = dumpTimer(engine, 2);

console.log(engine.data[2]);
console.log(engine.timer);
console.log(engine1.data[2]);
console.log(engine1.timer);
