/*
 * No key pressed? Decrement program counter in order to re-read the
 * waitKeyPress instruction.
 * Key pressed? Apply normal behaviour: save key value into register.
 */

const engine = require('../src/engine.js').initialize();
const waitKeyPress = require('../src/instruction-set.js').waitKeyPress;

test('try when no key is pressed', () => {
  const engine_ = waitKeyPress(engine.set('pc', 4000), 0xB);

  expect(engine_.get('pc')).toBe(3098);
});

test('try when key is pressed', () => {
  let keypad = engine.get('keypad');
  keypad[7] = true;
  const engine_ = waitKeyPress(engine.set('keypad', keypad).set('pc', 4000), 0xB);

  expect(engine_.get('data')[0xB]).toBe(7);
  expect(engine_.get('pc')).toBe(4000);
});
