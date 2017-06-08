const engine = require('../src/engine.js').initialize();
const setIFont = require('../src/instruction-set.js').fn.setIFont;

test('set reg I to the address of character \'E\'', () => {
  let data = engine.get('data');
  data[9] = 0xE;
  const engine_ = setIFont(engine.set('data', data), 9);

  expect(engine_.get('I')).toBe(70);
});

test('set reg I to the address of character \'4\'', () => {
  let data = engine.get('data');
  data[0xA] = 0x4;
  const engine_ = setIFont(engine.set('data', data), 0xA);

  expect(engine_.get('I')).toBe(20);
});
