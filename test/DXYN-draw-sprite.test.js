const initialize = require('../src/engine.js').initialize;
const drawSprite = require('../src/instruction-set.js').fn.drawSprite;

test('draw nice underscore-cross sprite', () => {
  const engine = initialize();
  let data = engine.get('data');
  data[1] = 10;
  data[0xA] = 4;
  let memory = engine.get('memory');
  memory[500] = 0x04;
  memory[501] = 0x0E;
  memory[502] = 0xF4;
  const engine_ = drawSprite(engine.set('data', data).set('memory', memory)
    .set('I', 500), 1, 0xA, 3);

  expect(engine_.get('display')[4].slice(10, 18).join(' '))
    .toBe('false false false false false true false false');
  expect(engine_.get('display')[5].slice(10, 18).join(' '))
    .toBe('false false false false true true true false');
  expect(engine_.get('display')[6].slice(10, 18).join(' '))
    .toBe('true true true true false true false false');
  expect(engine_.get('data')[0xF]).toBe(0);

});

test('pixels are XORed when overwritten', () => {
  const engine = initialize();
  let memory = engine.get('memory');
  memory[3000] = 0x5A;
  let display = engine.get('display');
  display[0] = Array(8).fill(true).concat(display[0].slice(9));
  const engine_ = drawSprite(engine.set('memory', memory)
    .set('display', display).set('I', 3000), 0, 0, 1);

  expect(engine_.get('display')[0].slice(0, 8).join(' '))
    .toBe('true false true false false true false true');
  expect(engine_.get('data')[0xF]).toBe(1);
});

test('wrap to the opposite side of the screen when outside', () => {
  const engine = initialize();
  let data = engine.get('data');
  data[0xE] = 61;
  data[0xD] = 20;
  let memory = engine.get('memory');
  memory[0] = 0xFF;
  const engine_ = drawSprite(engine.set('data', data).set('memory', memory),
    0xE, 0xD, 1);

  expect(engine_.get('display')[20].slice(0, 5).every(v => v === true))
    .toBe(true);
  expect(engine_.get('display')[20].slice(61).every(v => v === true))
    .toBe(true);
  expect(engine_.get('data')[0xF]).toBe(0);
});
