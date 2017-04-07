'use strict';

let engine = require('engine').initialize();
const or = require('instrutions').or;

engine.data[2] = 128;
engine.data[8] = 54;

const engine1 = or(engine, 2, 8);

console.log(engine1.data[2]);
