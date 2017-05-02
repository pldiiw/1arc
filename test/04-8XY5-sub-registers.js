let engine = require('engine').initialize();
const subRegisters = require('instructions').subRegisters;

test('sub reg 0xA (30) from reg 9 (40)', () => {
  let data = engine.get('data');
  data[9] = 40;
  data[0xA] = 30;
  const engine_ = subRegisters(engine.set('data', data), 9, 0xA);

  expect(engine_.get('data')[9]).toBe(10);
  expect(engine_.get('data')[0xA]).toBe(30);
  expect(engine_.get('data')[0xF]).toBe(1);
});

test('always set carry flag', () => {
  let data = engine.get('data');
  data[9] = 10;
  data[0xB] = 200;
  const engine_ = subRegisters(engine.set('data', data), 9, 0xB);

  expect(engine_.get('data')[9]).toBe(66);
  expect(engine_.get('data')[0xB]).toBe(200);
  expect(engine_.get('data')[0xF]).toBe(0);
});
