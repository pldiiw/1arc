'use strict';

let engine = {
  display: Array(32).fill([]).map(v => new Uint8Array(64).fill(1))
};
const clearDisplay = require('instructions').clearDisplay;

const engine1 = clearDisplay(engine);

console.log(engine1.display.reduce((a, v) => {
  const sum = v.reduce((a, v) => a + v, 0);
  return a + sum;
}, 0));
