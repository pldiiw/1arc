'use strict';

let engine = require('engine').initialize();
const setSound = require('instructions').setSound;

engine.data[5] = 42;
engine.data[6] = 12;

const engine1 = setSound(engine, 5);
const engine2 = setSound(engine1, 6);

console.log(engine.sound);
console.log(engine1.sound);
console.log(engine2.sound);
