'use strict';

const engine = require('engine').initialize();
const loadProgram = require('engine').loadProgram;
const program = '00001111222233334444AAAAFFFF';

const loadedProgram =
  loadProgram(engine, program).memory
    .slice(0, 7 * 2 * 8);

[...Array(7)].keys()
  .map(v => loadedProgram.slice(v, v + 16))
  .map(v => parseInt(v, 2).toString(16))
  .forEach(v => console.log(v));

