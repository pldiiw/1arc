const engine = require('../src/engine.js').initialize();
const prepare = require('../src/engine.js').prepare;
const program = '11112222';

test('program counter set to 0x200', () => {
  expect(prepare(engine, program).get('pc')).toBe(0x200);
});
