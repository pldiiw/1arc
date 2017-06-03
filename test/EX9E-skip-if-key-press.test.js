const engine = require('../src/engine.js').initialize();
const skipIfKeyPress = require('../src/instruction-set.js').fn.skipIfKeyPress;

test('do not skip because \'4\' key is not pressed', () => {
  let data = engine.get('data');
  data[8] = 0xF;
  let keypad = engine.get('keypad');
  keypad[4] = 1;
  const engine_ = skipIfKeyPress(engine.set('data', data).set('keypad', keypad)
    .set('pc', 128), 8);

  expect(engine_.get('pc')).toBe(128);
});

test('skip because \'4\' key is pressed', () => {
  let data = engine.get('data');
  data[9] = 4;
  let keypad = engine.get('keypad');
  keypad[4] = 1;
  const engine_ = skipIfKeyPress(engine.set('data', data).set('keypad', keypad)
    .set('pc', 128), 9);

  expect(engine_.get('pc')).toBe(130);
});
