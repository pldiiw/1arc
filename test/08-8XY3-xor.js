'use strict';

let engine = require('engine').initialize();
const xor = require('instrutions').xor;

engine.data[4] = 231;
engine.data[2] = 183;

const engine1 = xor(engine, 4, 2);

console.log(engine1.data[4]);
