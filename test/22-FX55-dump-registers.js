const engine = require('../src/engine.js').initialize();
const dumpRegisters = require('../src/instruction-set.js').dumpRegisters;

test('dump reg 0 through reg 4 to memory', () => {
  let data = engine.get('data');
  data[0] = 54;
  data[1] = 128;
  data[2] = 4;
  data[3] = 230;
  data[4] = 18;
  const engine_ = dumpRegisters(engine.set('data', data).set('I', 10), 4);

  expect(engine_.get('memory')[10]).toBe(54);
  expect(engine_.get('memory')[11]).toBe(128);
  expect(engine_.get('memory')[12]).toBe(4);
  expect(engine_.get('memory')[13]).toBe(230);
  expect(engine_.get('memory')[14]).toBe(18);
  expect(engine_.get('I')).toBe(15);
});
