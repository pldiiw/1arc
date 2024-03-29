const engine = require('../src/engine.js').initialize();
const skipIfNotRegister = require('../src/instruction-set.js').fn.skipIfNotRegister;

test('do not skip because reg 7 (143) == reg 0xD (143)', () => {
  let data = engine.get('data');
  data[7] = 143;
  data[0xD] = 143;
  const engine_ = skipIfNotRegister(engine.set('data', data).set('pc', 3049), 7, 0xD);

  expect(engine_.get('pc')).toBe(3049);
});

test('skip because reg 7 (143) != reg 0xE (56)', () => {
  let data = engine.get('data');
  data[7] = 143;
  data[0xE] = 56;
  const engine_ = skipIfNotRegister(engine.set('data', data).set('pc', 3049), 7, 0xE);

  expect(engine_.get('pc')).toBe(3051);
});
