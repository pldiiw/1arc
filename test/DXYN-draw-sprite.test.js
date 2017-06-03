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
  expect(engine_.get('data')[0xF]).toBe(0);
});

test('pixels are XORed when overwritten', () => {
  let memory = engine.get('memory');
  memory[3000] = 0x5A;
  let display = engine.get('display');
  display[0] = Array(8).fill(true).concat(display[0].slice(9));
  const engine_ = drawSprite(engine.set('memory', memory)
    .set('display', display).set('I', 3000), 0, 0, 1);

  expect(engine_.get('display')[0].slice(0, 9).join(' '))
    .toBe('true false true false false true false true');
  expect(engine_.get('data')[0xF]).toBe(1);
});

test('wrap to the opposite side of the screen when outside', () => {
  let data = engine.get('data');
  data[0xD] = 20;
  data[0xE] = 61;
  let memory = engine.get('memory');
  memory[0] = 0xFF;
  const engine_ = drawSprite(engine.set('data', data).set('memory', memory),
    0xD, 0xE, 1);

  expect(engine_.get('display')[20].slice(0, 5).every(v => v === true))
    .toBe(true);
  expect(engine_.get('display')[20].slice(61).every(v => v === true))
    .toBe(true);
  expect(engine_.get('data')[0xF]).toBe(0);
});
