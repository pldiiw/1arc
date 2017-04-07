'use strict';

const engine = { I: 0 };
const setI = require('instructions').setI;

const engine1 = setI(engine, 3020);
const engine2 = setI(engine1, 20);

console.log(engine.I);
console.log(engine1.I);
console.log(engine2.I);
