'use strict';

const engine = require('engine').initialize();
const setRegister = require('instructions').setRegister;

console.log(setRegister(engine, 0xC, 233).data[0xC]);
