const engine = require('../src/engine.js').initialize();

test('has all components', () => {
  const expected = [
    'data', 'I', 'timer', 'sound', 'memory',
    'pc', 'pointer', 'stack', 'display', 'keypad'
  ];

  for (const key of engine.keys()) {
    expect(expected.includes(key)).toBe(true);
  }
});

describe('data registers', () => {
  const data = engine.get('data');

  test('is Uint8Array', () => {
    expect(data.BYTES_PER_ELEMENT).toBe(1);
    expect(data.map(v => 257)[0]).toBe(1);
  });

  test('has 16 data registers', () => {
    expect(data.length).toBe(16);
  });

  test('all 0', () => {
    data.forEach(v => expect(v).toBe(0));
  });
});

describe('I register', () => {
  const I = engine.get('I');

  test('is 0', () => {
    expect(I).toBe(0);
  });
});

describe('timer', () => {
  const timer = engine.get('timer');

  test('is 0', () => {
    expect(timer).toBe(0);
  });
});

describe('sound', () => {
  const sound = engine.get('sound');

  test('is 0', () => {
    expect(sound).toBe(0);
  });
});

describe('memory', () => {
  const memory = engine.get('memory');

  test('is Uint8Array', () => {
    expect(memory.BYTES_PER_ELEMENT).toBe(1);
    expect(memory.map(v => 257)[0]).toBe(1);
  });

  test('has 4096 cells', () => {
    expect(memory.length).toBe(4096);
  });

  test('all 0', () => {
    memory.forEach(v => expect(v).toBe(0));
  });
});

describe('pc', () => {
  const pc = engine.get('pc');

  test('is 0', () => {
    expect(pc).toBe(0);
  });
});

describe('pointer', () => {
  const pointer = engine.get('pointer');

  test('is 0', () => {
    expect(pointer).toBe(0);
  });
});

describe('stack', () => {
  const stack = engine.get('stack');

  test('is Uint16Array', () => {
    expect(stack.BYTES_PER_ELEMENT).toBe(2);
    expect(stack.map(v => 65537)[0]).toBe(1);
  });

  test('has 16 elements', () => {
    expect(stack.length).toBe(16);
  });

  test('all 0', () => {
    stack.forEach(v => expect(v).toBe(0));
  });
});

describe('display', () => {
  const display = engine.get('display');

  test('is 64*32 array', () => {
    expect(display.length).toBe(32);
    expect(display.every(v => v.length === 64)).toBe(true);
  });

  test('all false', () => {
    const flattened = display.reduce((a, v) => a.concat(v), []);
    expect(flattened.every(v => v === false)).toBe(true);
  });
});

describe('keypad', () => {
  const keypad = engine.get('keypad');

  test('has 16 elements', () => {
    expect(keypad.length).toBe(16);
  });

  test('all false', () => {
    expect(keypad.every(v => v === false)).toBe(true);
  });
});
