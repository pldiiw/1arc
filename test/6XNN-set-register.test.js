const engine = require('../src/engine.js').initialize();
const setRegister = require('../src/instruction-set.js').setRegister;

test('set register 0xC to 233', () => {
  expect(setRegister(engine, 0xC, 233).get('data')[0xC]).toBe(233);
});
