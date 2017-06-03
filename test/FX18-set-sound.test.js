const engine = require('../src/engine.js').initialize();
const setSound = require('../src/instruction-set.js').fn.setSound;

test('set sound to reg 5 (42)', () => {
  let data = engine.get('data');
  data[5] = 42;
  const engine_ = setSound(engine.set('data', data), 5);

  expect(engine_.get('sound')).toBe(42);
});
