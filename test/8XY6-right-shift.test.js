const engine = require('../src/engine.js').initialize();
const rightShift = require('../src/instruction-set.js').fn.rightShift;

test('right shift 200', () => {
  let data = engine.get('data');
  data[8] = 121;
  data[9] = 200;
  const engine_ = rightShift(engine.set('data', data), 8, 9);

  expect(engine_.get('data')[8]).toBe(60);
  expect(engine_.get('data')[9]).toBe(200);
  expect(engine_.get('data')[0xF]).toBe(1);
});

test('always put shifted bit in reg 0xF', () => {
  let data = engine.get('data');
  data[8] = 121;
  data[9] = 200;
  const engine_ = rightShift(rightShift(engine.set('data', data), 8, 9), 8, 9);

  expect(engine_.get('data')[8]).toBe(100);
  expect(engine_.get('data')[9]).toBe(200);
  expect(engine_.get('data')[0xF]).toBe(0);
});
