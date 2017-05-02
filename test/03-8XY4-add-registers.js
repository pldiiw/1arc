let engine = require('../src/engine.js').initialize();
const addRegisters = require('../src/instruction-set.js').addRegisters;


test('add reg 1 (240) to reg 0 (20)', () => {
  let data = engine.get('data');
  data[0] = 20;
  data[1] = 240;
  const engine_ = addRegisters(engine.set('data', data), 0, 1);

  expect(engine_.get('data')[0]).toBe(4);
  expect(engine_.get('data')[1]).toBe(240);
  expect(engine_.get('data')[0xF]).toBe(1);
});

test('always set carry flag', () => {
  let data = engine.get('data');
  data[0] = 20;
  data[2] = 30;
  data[0xF] = 1;
  const engine_ = addRegisters(engine.set('data', data), 0, 2);

  expect(engine_.get('data')[0xF]).toBe(0);
});
