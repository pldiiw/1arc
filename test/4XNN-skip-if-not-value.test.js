const engine = require('../src/engine.js').initialize();
const skipIfNotValue = require('../src/instruction-set.js').fn.skipIfNotValue;

test('do not skip because reg 7 (143) == 143', () => {
  let data = engine.get('data');
  data[7] = 143;
  const engine_ = skipIfNotValue(engine.set('data', data).set('pc', 200),
    7, 143);

  expect(engine_.get('pc')).toBe(200);
});

test('skip because reg 7 (143) != 32', () => {
  let data = engine.get('data');
  data[7] = 143;
  const engine_ = skipIfNotValue(engine.set('data', data).set('pc', 200),
    7, 32);

  expect(engine_.get('pc')).toBe(202);
});
