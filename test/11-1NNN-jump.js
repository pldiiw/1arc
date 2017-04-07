'use strict';

const engine = require('engine').initialize();
const jump = require('instructions').jump;

const engine1 = jump(engine, 3659);

console.log(engine.pc);
console.log(engine1.pc);
