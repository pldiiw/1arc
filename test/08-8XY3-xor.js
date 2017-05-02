let engine = require('../src/engine.js').initialize();
const xor = require('../src/instruction-set.js').xor;

test('reg 4 (231) XOR reg 2 (183) === 80', () => {
  let data = engine.get('data');
  data[4] = 231;
  data[2] = 183;
  const engine_ = xor(engine.set('data', data), 4, 2);

  expect(engine_.get('data')[4]).toBe(80);
});
