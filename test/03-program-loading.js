const engine = require('../src/engine.js').initialize();
const loadProgram = require('../src/engine.js').loadProgram;
const program = '00001111222233334444AAAAFFFF';

test('program loaded from address 0x200', () => {
  expect(loadProgram(engine, program)
    .get('memory')
    .slice(0x200, 0x200 + program.length / 2)
    .map(v => v.toString(16).padStart(2, '0'))
    .join('')).toBe(program);
});
