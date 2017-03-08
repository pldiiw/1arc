'use strict';

const engine = require('interpreter').initialize_engine();
const log = console.log;
const hex = n => n.toString(16);
const binToDec = s => parseInt(s, 2);

// Data registers
const data = engine.data;
log(`Number of data registers: ${data.length}`);
data.forEach((reg, i) => {
  log(`${hex(i)} register bit size: ${reg.length}`);
});
log(`Data registers values sum: ${data.reduce((a, reg) => a + binToDec(reg), 0)}`);

// I register
const I = engine.I;
log(`I register bit size: ${I.length}`);
log(`I register value: ${binToDec(I)}`);

// Timer register
const timer = engine.timer;
log(`Timer register bit size: ${timer.length}`);
log(`Timer register value: ${binToDec(timer)}`);

// Sound register
const sound = engine.sound;
log(`Sound register bit size: ${sound.length}`);
log(`Sound register value: ${binToDec(sound)}`);

// Memory
const mem = engine.memory;
log(`Memory bit size: ${mem.length}`);
log(`Memory empty: ${binToDec(mem) === 0}`);

// Program counter
const pc = engine.pc;
log(`Program counter bit size: ${pc.length}`);
log(`Program counter value: ${binToDec(pc)}`);

// Stack pointer
const p = engine.pointer;
log(`Stack pointer bit size: ${p.length}`);
log(`Stack pointer value: ${binToDec(p)}`);

// Stack
const stack = engine.stack;
log(`Stack size: ${stack.length}`);
stack.forEach((v, i) => {
  log(`Stack value ${hex(i)}: ${binToDec(v)}`);
});

// Display
const disp = engine.display;
log(`Display bit height: ${disp.length}`);
log('Number of 64-pixel long display rows: ' +
  disp.reduce((a, v) => a + (v.length === 64 ? 1 : 0), 0));

// Keypad
const kp = engine.keypad;
log(`Keypad bit size: ${kp.length}`);
log(`Keypad values sum: ${kp.reduce((a, v) => a + v, 0)}`);
