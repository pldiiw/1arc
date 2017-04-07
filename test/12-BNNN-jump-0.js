'use strict';

let engine = require('engine').initialize();
const jump0 = require('instructions').jump0;

engine.data[0] = 132;
const engine1 = jump0(engine, 1840);

console.log(engine.pc);
console.log(engine1.pc);
