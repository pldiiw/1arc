let engine = require('engine').initialize();
const and = require('instrutions').and;

test('reg 0xB (55) AND reg 0xE (120) === 48', () => {
  let data = engine.get('data');
  data[0xB] = 55;
  data[0xE] = 120;
  const engine_ = and(engine.set('data', data), 0xB, 0xE);

  expect(engine_.get('data')[0xB]).toBe(48);
});
