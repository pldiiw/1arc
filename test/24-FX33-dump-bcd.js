const engine = require('../src/engine.js').initialize();
const dumpBCD = require('../src/instruction-set.js').dumpBCD;

test('dump BCD of reg 0xB (14) to memory', () => {
  let data = engine.get('data');
  data[0xE] = 14;
  const engine_ = dumpBCD(engine.set('data', data).set('I', 100), 0xE);

  expect(engine_.get('memory')[100]).toBe(0);
  expect(engine_.get('memory')[101]).toBe(1);
  expect(engine_.get('memory')[102]).toBe(4);
  expect(engine_.get('I')).toBe(100);
});
