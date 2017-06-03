const engine = require('../src/engine.js').initialize();
const skipIfNotKeyPress = require('../src/instruction-set.js').fn.skipIfNotKeyPress;

test('skip because \'E\' key is not pressed', () => {
  let data = engine.get('data');
  data[8] = 0xE;
  let keypad = engine.get('keypad');
  keypad[3] = 1;
  const engine_ = skipIfNotKeyPress(engine.set('data', data)
    .set('keypad', keypad).set('pc', 128), 8);

  expect(engine_.get('pc')).toBe(130);
});

test('do not skip because \'E\' key is pressed', () => {
  let data = engine.get('data');
  data[9] = 0xE;
  let keypad = engine.get('keypad');
  keypad[0xE] = 1;
  const engine_ = skipIfNotKeyPress(engine.set('data', data)
    .set('keypad', keypad).set('pc', 128), 9);

  expect(engine_.get('pc')).toBe(128);
});
