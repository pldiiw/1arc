// Note: It can happen that the second test may fail. JavaScript not
// provididing the possibility to seed its RNG, these tests are quite barbaric.

const engine = require('../src/engine.js').initialize();
const storeRandom = require('../src/instruction-set.js').storeRandom;

test('random number with mask 0 is 0', () => {
  const engine_ = storeRandom(engine, 0xB, 0x00);

  expect(engine_.get('data')[0xB]).toBe(0);
});

test('two calls produce different numbers (may fail, see comment)', () => {
  const engine_ = storeRandom(storeRandom(engine, 4, 0xFF), 5, 0xFF);

  expect(engine_.get('data')[4]).not.toBe(engine_.get('data')[5]);
});
