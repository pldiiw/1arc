'use strict';

// The heavy use of const is intended, for testing the purity of each cycle.

const log = console.log;
const binToDec = s => parseInt(s, 2);

const sumRegisters = engine => {
  return engine.data.reduce((a, v) => a + binToDec(v), 0);
};
const logPc = engine => {
  log(`Program counter decimal value: ${binToDec(engine.pc)}`);
};
const logRegSum = engine => {
  log(`Registers decimal sum value: ${sumRegisters(engine)}`);
};
const logTimer = engine => {
  log(`Timer decimal value: ${binToDec(engine.timer)}`);
};
const logSound = engine => {
  log(`Sound timer decimal value: ${binToDec(engine.sound)}`);
};

const engine = require('engine');

const program = '6014710AF1157203F218';

log('Init');
const engineState = engine.prepare(engine.initialize(), program);
logPc(engineState);
logRegSum(engineState);

log(`\nCycle 1`);
const engineState1 = engine.cycle(engineState);
logPc(engineState1);
logRegSum(engineState1);
log(`0 register decimal value: ${binToDec(engineState1.data[0])}`);

log(`\nCycle 2`);
const engineState2 = engine.cycle(engineState1);
logPc(engineState2);
logRegSum(engineState2);
log(`1 register decimal value: ${binToDec(engineState2.data[1])}`);

log(`\nCycle 3`);
const engineState3 = engine.cycle(engineState2);
logPc(engineState3);
logTimer(engineState3);

log(`\nCycle 4`);
const engineState4 = engine.cycle(engineState3);
logPc(engineState4);
logRegSum(engineState4);
log(`2 register decimal value: ${binToDec(engineState2.data[2])}`);
logTimer(engineState4);

log(`\nCycle 5`);
const engineState5 = engine.cycle(engineState4);
logPc(engineState5);
logTimer(engineState5);
logSound(engineState5);

log(`\nCycle 6`);
const engineState6 = engine.cycle(engineState5);
logPc(engineState6);
logTimer(engineState6);
logSound(engineState6);

log(`\nCycle 7`);
const engineState7 = engine.cycle(engineState6);
logPc(engineState7);
logTimer(engineState7);
logSound(engineState7);

log(`\nCycle 8`);
const engineState8 = engine.cycle(engineState7);
logPc(engineState8);
logTimer(engineState8);
logSound(engineState8);

log(`\nCycle 9`);
const engineState9 = engine.cycle(engineState8);
logPc(engineState9);
logRegSum(engineState9);
log(`0 register decimal value: ${binToDec(engineState1.data[0])}`);
log(`1 register decimal value: ${binToDec(engineState2.data[1])}`);
log(`2 register decimal value: ${binToDec(engineState2.data[2])}`);
logTimer(engineState9);
logSound(engineState9);
