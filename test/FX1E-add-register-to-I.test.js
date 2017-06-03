const engine = require('../src/engine.js').initialize();
const addRegisterToI = require('../src/instruction-set.js').fn.addRegisterToI;

test('add to reg I (4000) reg 0xA (50)', () => {
  let data = engine.get('data');
  data[0xA] = 50;
  const engine_ = addRegisterToI(engine.set('data', data).set('I', 4000), 0xA);

  expect(engine_.get('I')).toBe(4050);
});
