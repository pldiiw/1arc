const engine = require('../src/engine.js').initialize();
const jump = require('../src/instruction-set.js').fn.jump;

test('jump to address 3659', () => {
  const engine_ = jump(engine, 3659);

  expect(engine_.get('pc')).toBe(3659);
});
