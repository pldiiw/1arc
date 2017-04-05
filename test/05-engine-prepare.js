'use strict';

binToDec = s => parseInt(s, 2);
hex = n => n.toString(16);

const program = '11112222';
const preparedEngine = require('engine').prepare(
  require('engine').initialize(), program);

const loadedProgram = hex(binToDec(
  preparedEngine.memory.slice(512 * 8, 516 * 8 + 1)));
const fontLoaded = hex(binToDec(
  preparedEngine.memory.slice(0, 5 * 8 + 1))) === "F0909090F0";

console.log(`Font loaded: seems to be ${fontLoaded}`);
console.log(`Loaded program: ${loadedProgram}`);
console.log(`Program counter: ${binToDec(preparedEngine.pc)}`);
