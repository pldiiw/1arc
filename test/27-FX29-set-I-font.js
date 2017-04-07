'use strict';

let engine = require('engine').initialize();
const setIFont = require('instructions').setIFont;

engine.data[9] = 0xE;
engine.data[0xA] = 0x4;

const engine1 = setIFont(engine, 9);
const engine2 = setIFont(engine, 0xA);

console.log(engine1.I);
console.log(engine2.I);
