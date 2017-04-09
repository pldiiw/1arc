'use strict';

// This test will need to be reviewed.

let engine = require('engine').initialize();
const waitKeyPress = require('instructions').waitKeyPress;

engine.keypad[7] = 1;

const engine1 = waitKeyPress(engine, 0xB);

console.log(engine1.data[0xB]);
