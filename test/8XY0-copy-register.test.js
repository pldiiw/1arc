const engine = require('../src/engine.js').initialize();
const copyRegister = require('../src/instruction-set.js').copyRegister;

test('copy register 0xD to reg 0x5', () => {
  let data = engine.get('data');
  data[5] = 230;
  data[0xD] = 129;

  expect(copyRegister(engine.set('data', data), 5, 0xD).get('data')[5])
    .toBe(129);
});
