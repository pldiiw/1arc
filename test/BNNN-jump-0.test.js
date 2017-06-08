let engine = require('../src/engine.js').initialize();
const jump0 = require('../src/instruction-set.js').fn.jump0;

test('jump to address reg 0 (132) + 1840', () => {
  let data = engine.get('data');
  data[0] = 132;
  const engine_ = jump0(engine.set('data', data), 1840);

  expect(engine_.get('pc')).toBe(1970);
});
