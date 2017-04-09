'use strict';

// Note: It can happen that the second test may fail. JavaScript not
// provididing the possibility to seed its RNG, these tests are quite barbaric.

const engine = require('engine').initialize();
const storeRandom = require('instructions').storeRandom;

const engine1 = storeRandom(engine, 0xB, 0x00);
const engine2 = storeRandom(engine, 4, 0xFF);
const engine3 = storeRandom(engine, 5, 0xFF);

console.log(engine1.data[0xB]);
console.log(engine2.data[4] != engine3.data[5]);
