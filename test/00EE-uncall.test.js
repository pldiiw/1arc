const engine = require('../src/engine.js').initialize();
const uncall = require('../src/instruction-set.js').uncall;

test('return from subroutine', () => {
  let stack = engine.get('stack');
  stack[9] = 300;
  const engine_ = uncall(engine.set('pointer', 0xA).set('stack', stack));

  expect(engine_.get('pointer')).toBe(9);
  expect(engine_.get('pc')).toBe(300);
});
