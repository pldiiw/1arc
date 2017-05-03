const engine = require('../src/engine.js').initialize();
const drawSprite = require('../src/instruction-set.js').drawSprite;

test('draw nice underscore-cross sprite', () => {
  let data = engine.get('data');
  data[1] = 10;
  data[0xA] = 4;
  let memory = engine.get('memory');
  memory[500] = 0x04;
  memory[501] = 0x0E;
  memory[502] = 0xF4;
  const engine_ = drawSprite(engine.set('data', data).set('memory', memory)
    .set('I', 500), 1, 0xA, 3);

  expect(engine_.get('display')[4].slice(10, 19).join(' '))
    .toBe('false false false false false true false false');
  expect(engine_.get('display')[5].slice(10, 19).join(' '))
    .toBe('false false false false true true true false');
  expect(engine_.get('display')[6].slice(10, 19).join(' '))
    .toBe('true true true true false true false false');
});
