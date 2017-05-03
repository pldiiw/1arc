const engine = new Map([['I', 0]]);
const setI = require('../src/instruction-set.js').setI;

test('set reg I to 3020', () => {
  expect(setI(engine, 3020).get('I')).toBe(3020);
});
