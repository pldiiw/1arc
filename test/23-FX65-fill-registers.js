const engine = require('../src/engine.js').initialize();
const fillRegisters = require('../src/instruction-set.js').fillRegisters;

test('fill reg 0 through 2 from memory', () => {
  let memory = engine.get('memory');
  memory[32] = 43;
  memory[33] = 255;
  memory[34] = 6;
  const engine_ = fillRegisters(engine.set('memory', memory).set('I', 32), 2);

  expect(engine_.get('data')[0]).toBe(43);
  expect(engine_.get('data')[1]).toBe(255);
  expect(engine_.get('data')[2]).toBe(6);
  expect(engine_.get('I')).toBe(35);
});
