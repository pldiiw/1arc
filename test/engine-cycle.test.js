let engine = require('../src/engine.js').initialize();
const prepare = require('../src/engine.js').prepare;
const cycle = require('../src/engine.js').cycle;
const program = '6014710AF1157203F218';

describe('engine set up', () => {
  test('program counter is set to 0x200', () => {
    engine = prepare(engine, program);

    expect(engine.get('pc')).toBe(0x200);
  });
});

describe('cycle 1', () => {
  test('program counter is set to 0x202', () => {
    engine = cycle(engine);

    expect(engine.get('pc')).toBe(0x202);
  });

  test('register 0 is set to 20', () => {
    expect(engine.get('data')[0]).toBe(20);
  });
});

describe('cycle 2', () => {
  test('program counter is set to 0x204', () => {
    engine = cycle(engine);

    expect(engine.get('pc')).toBe(0x204);
  });

  test('register 0 is set to 20', () => {
    expect(engine.get('data')[0]).toBe(20);
  });

  test('register 1 is set to 10', () => {
    expect(engine.get('data')[1]).toBe(10);
  });
});

describe('cycle 3', () => {
  test('program counter is set to 0x206', () => {
    engine = cycle(engine);

    expect(engine.get('pc')).toBe(0x206);
  });

  test('timer is set to 10', () => {
    expect(engine.get('timer')).toBe(10);
  });
});

describe('cycle 4', () => {
  test('program counter is set to 0x208', () => {
    engine = cycle(engine);

    expect(engine.get('pc')).toBe(0x208);
  });

  test('register 0 is set to 20', () => {
    expect(engine.get('data')[0]).toBe(20);
  });

  test('register 1 is set to 10', () => {
    expect(engine.get('data')[1]).toBe(10);
  });

  test('register 2 is set to 3', () => {
    expect(engine.get('data')[2]).toBe(3);
  });

  test('timer is set to 9', () => {
    expect(engine.get('timer')).toBe(9);
  });
});

describe('cycle 5', () => {
  test('program counter is set to 0x20A', () => {
    engine = cycle(engine);

    expect(engine.get('pc')).toBe(0x20A);
  });

  test('timer is set to 8', () => {
    expect(engine.get('timer')).toBe(8);
  });

  test('sound is set to 3', () => {
    expect(engine.get('sound')).toBe(3);
  });
});

describe('cycle 6', () => {
  test('program counter is set to 0x20C', () => {
    engine = cycle(engine);

    expect(engine.get('pc')).toBe(0x20C);
  });

  test('timer is set to 7', () => {
    expect(engine.get('timer')).toBe(7);
  });

  test('sound is set to 2', () => {
    expect(engine.get('sound')).toBe(2);
  });
});

describe('cycle 7', () => {

  test('program counter is set to 0x20E', () => {
    engine = cycle(engine);

    expect(engine.get('pc')).toBe(0x20E);
  });

  test('timer is set to 6', () => {
    expect(engine.get('timer')).toBe(6);
  });

  test('sound is set to 1', () => {
    expect(engine.get('sound')).toBe(1);
  });
});

describe('cycle 8', () => {
  test('program counter is set to 0x210', () => {
    engine = cycle(engine);

    expect(engine.get('pc')).toBe(0x210);
  });

  test('timer is set to 5', () => {
    expect(engine.get('timer')).toBe(5);
  });

  test('sound is set to 0', () => {
    expect(engine.get('sound')).toBe(0);
  });
});

describe('cycle 9', () => {
  test('program counter is set to 0x212', () => {
    engine = cycle(engine);

    expect(engine.get('pc')).toBe(0x212);
  });

  test('register 0 is set to 20', () => {
    expect(engine.get('data')[0]).toBe(20);
  });

  test('register 1 is set to 10', () => {
    expect(engine.get('data')[1]).toBe(10);
  });

  test('register 2 is set to 3', () => {
    expect(engine.get('data')[2]).toBe(3);
  });

  test('timer is set to 4', () => {
    expect(engine.get('timer')).toBe(4);
  });

  test('sound is set to 0', () => {
    expect(engine.get('sound')).toBe(0);
  });
});
