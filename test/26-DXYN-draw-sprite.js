'use strict';

let engine = require('engine').initialize();
const drawSprite = require('instructions').drawSprite;

engine.data[1] = 10;
engine.data[0xA] = 4;
engine.memory[500] = 0x04;
engine.memory[501] = 0x0E;
engine.memory[502] = 0xF4;
engine.I = 500;

const engine1 = drawSprite(engine, 1, 0xA, 3);

console.log(engine1.display[4].slice(10, 19).join(''));
console.log(engine1.display[5].slice(10, 19).join(''));
console.log(engine1.display[6].slice(10, 19).join(''));
