let engine = require('engine').initialize();
const or = require('instrutions').or;

test('reg 2 (128) OR reg 8 (54) === 182', () => {
  let data = engine.get('data');
  data[2] = 128;
  data[8] = 54;
  const engine_ = or(engine.set('data', data), 2, 8);

  expect(engine_.get('data')[2]).toBe(182);
});
