const lint = require('../src/utility.js').lint;
const goodProgram = '611181107111C1111111A111F11ED111';
const secondGoodProgram = '811EB111211100EE00E0F129';
const badProgram = goodProgram + 'F132';
const secondBadProgram = secondGoodProgram + 'FG55';

test.skip('let good program pass', () => {
  expect(lint(goodProgram)).toBe(goodProgram);
});

test.skip('let second good program pass', () => {
  expect(lint(secondGoodProgram)).toBe(secondGoodProgram);
});

test.skip('do not let bad program pass', () => {
  expect(lint(badProgram)).toBe(null);
});

test.skip('do not let second bad program pass', () => {
  expect(lint(secondBadProgram)).toBe(null);
});
