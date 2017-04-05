'use strict';

const log = console.log;
const hex = n => n.toString(16).toUpperCase();
const binToDec = s => parseInt(s, 2);

const engine = require('engine').initialize();
const fontLoadedEngine = require('engine').loadFont(engine);

const memory = fontLoadedEngine.memory;
const loadedSpriteSet = memory.slice(0, 79 * 8 + 1);

[...Array(16).keys()]
  .map(v => hex(v))
  .map(v => {
    log(`${v}: ${loadedSpriteSet.slice(v * 5, (v + 1) * 5).join(' ')}`);
  });

