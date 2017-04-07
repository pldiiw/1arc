'use strict';

let engine = require('engine').initialize();
const setTimer = require('instructions').setTimer;

engine.data[0xB] = 147;
engine.data[0xC] = 32;

const engine1 = setTimer(engine, 0xB);
const engine2 = setTimer(engine1, 0xC);

console.log(engine.timer);
console.log(engine1.timer);
console.log(engine2.timer);
