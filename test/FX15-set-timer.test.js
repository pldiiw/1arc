const engine = require('../src/engine.js').initialize();
const setTimer = require('../src/instruction-set.js').setTimer;

test('set timer to reg 0xB (147)', () => {
  let data = engine.get('data');
  data[0xB] = 147;
  const engine_ = setTimer(engine.set('data', data), 0xB);

  expect(engine_.get('timer')).toBe(147);
});
