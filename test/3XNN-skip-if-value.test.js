const engine = require('../src/engine.js').initialize();
const skipIfValue = require('../src/instruction-set.js').fn.skipIfValue;

test('skip next instruction because 143 == 143', () => {
  let data = engine.get('data');
  data[7] = 143;
  const engine_ = skipIfValue(engine.set('data', data).set('pc', 200), 7, 143);

  expect(engine_.get('pc')).toBe(202);
});

test('do not skip next instruction because 143 != 32', () => {
  let data = engine.get('data');
  data[7] = 143;
  const engine_ = skipIfValue(engine.set('data', data).set('pc', 200), 7, 32);

  expect(engine_.get('pc')).toBe(200);
});
