const engine = require('../src/engine.js').initialize();
const call = require('../src/instruction-set.js').fn.call;

test('call subroutine located at address 500', () => {
  const engine_ = call(engine.set('pointer', 4).set('pc', 100), 500);

  expect(engine_.get('pointer')).toBe(5);
  expect(engine_.get('stack')[4]).toBe(100);
  expect(engine_.get('pc')).toBe(500);
});
