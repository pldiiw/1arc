const clearDisplay = require('../src/instruction-set.js').clearDisplay;

test('clear some messed up display', () => {
  const engine = new Map([
    ['display', Array(32).fill(Array(64).fill(true))]
  ]);
  const engine_ = clearDisplay(engine);

  expect(engine_.get('display').every(v => v.every(vv => !vv))).toBe(true);
});
