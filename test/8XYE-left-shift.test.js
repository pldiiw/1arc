const engine = require('../src/engine.js').initialize();
const leftShift = require('../src/instruction-set.js').leftShift;

test('left shift a reg on itself (left shift 121)', () => {
  let data = engine.get('data');
  data[1] = 121;
  const engine_ = leftShift(engine.set('data', data), 1, 1);

  expect(engine_.get('data')[1]).toBe(242);
  expect(engine_.get('data')[0xF]).toBe(0);
});

test('always put shifted bit in reg 0xF', () => {
  let data = engine.get('data');
  data[1] = 121;
  data[0xA] = 200;
  const engine_ = leftShift(leftShift(engine.set('data', data), 1, 1), 1, 0xA);

  expect(engine_.get('data')[1]).toBe(144);
  expect(engine_.get('data')[0xA]).toBe(200);
  expect(engine_.get('data')[0xF]).toBe(1);
});
