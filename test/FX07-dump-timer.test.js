const engine = require('../src/engine.js').initialize();
const dumpTimer = require('../src/instruction-set.js').fn.dumpTimer;

test('dump timer to reg 2', () => {
  const engine_ = dumpTimer(engine.set('timer', 230), 2);

  expect(engine_.get('data')[2]).toBe(230);
  expect(engine_.get('timer')).toBe(230);
});
