'use strict';

const engine = require('engine').initialize();
const addToRegister = require('instructions').addToRegister;

const engine1 = addToRegister(engine, 1, 20);
const engine2 = addToRegister(engine1, 1, 80);

const engine3 = addToRegister(engine, 3, 300);
const engine4 = addToRegister(engine3, 3, 260);
const engine5 = addToRegister(engine3, 3, 10);


console.log(engine1.data[1]);
console.log(engine2.data[1]);
console.log(engine2.data[0xF]);

console.log(engine3.data[3]);
console.log(engine3.data[0xF]);
console.log(engine4.data[3]);
console.log(engine4.data[0xF]);
console.log(engine5.data[3]);
console.log(engine5.data[0xF]);
