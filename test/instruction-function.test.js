const instruction = require('../src/instruction-set.js').fn.instruction;
const instructions = require('../src/instruction-set.js').fn.instructions;
const engine = require('../src/engine.js').initialize();

test('determining instruction B5FE (BNNN)', () => {
  const instructionToDetermine = 'BNNN';
  const instructionToDetermineFn = instructions[instructionToDetermine];
  const engineA = instructionToDetermineFn(engine, 0x5FE);
  const engineB = instruction(0xB5FE)(engine);

  expect(engineA.get('pc')).toBe(engineB.get('pc'));
});

test('determining instruction 734A (7XNN)', () => {
  const instructionToDetermine = '7XNN';
  const instructionToDetermineFn = instructions[instructionToDetermine];
  const engineA = instructionToDetermineFn(engine, 0x3, 0x4A);
  const engineB = instruction(0x734A)(engine);

  expect(engineA.get('data')[3]).toBe(engineB.get('data')[3]);
});

test('determining instruction F929 (FX29)', () => {
  const instructionToDetermine = 'FX29';
  const instructionToDetermineFn = instructions[instructionToDetermine];
  const engineA = instructionToDetermineFn(engine, 0x9);
  const engineB = instruction(0xF929)(engine);

  expect(engineA.get('I')).toBe(engineB.get('I'));
});
