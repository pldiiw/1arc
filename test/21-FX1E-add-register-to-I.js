'use strict';

let engine = require('engine').initialize();
const addRegisterToI = require('instructions').addRegisterToI;

engine.data[0xA] = 50;
engine.I = 4000;

const engine1 = addRegisterToI(engine, 0xA);
const engine2 = addRegisterToI(engine1, 0xA);

console.log(engine.I);
console.log(engine1.I);
console.log(engine2.I);
