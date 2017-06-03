const engine = require('../src/engine.js').initialize();
const addToRegister = require('../src/instruction-set.js').fn.addToRegister;

test('add 20 to register 1', () => {
  const engine_ = addToRegister(engine, 1, 20);

  expect(engine_.get('data')[1]).toBe(20);
  expect(engine_.get('data')[0xF]).toBe(0);
});

test('add huge value to already huge register 3', () => {
  const engine_ = addToRegister(addToRegister(engine, 3, 80), 3, 300);

  expect(engine_.get('data')[3]).toBe(124);
  expect(engine_.get('data')[0xF]).toBe(1);
});

test('register 0xF always set flag', () => {
  const engine_ = addToRegister(addToRegister(engine, 0xA, 300), 0xA, 1);

  expect(engine_.get('data')[0xF]).toBe(0);
});
