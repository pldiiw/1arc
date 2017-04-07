'use strict';

let engine = require('engine').initialize();
const and = require('instrutions').and;

engine.data[0xB] = 55;
engine.data[0xE] = 120;

const engine1 = and(engine, 0xB, 0xE);

console.log(engine1.data[0xB]);
