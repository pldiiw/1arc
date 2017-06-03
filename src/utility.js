function removeArtefacts (program) {
  return program
    .replace(/#\|(.|\n)*?\|#/g, '')
    .replace(/\|#/g, '')
    .replace(/;.*/g, '')
    .replace(/(\t| |\n)/g, '')
    .toUpperCase();
}

function dumpEngine (engine) {
  let dump = {};
  const keys = Array.from(engine.keys());
  keys.forEach(k => dump[k] = engine.get(k));
  return JSON.stringify(dump, true, 2);
}

function loadEngine (dumpedEngine) {
  const dump = JSON.parse(dumpedEngine);
  const keys = Object.keys(dump);
  const engine = new Map(keys.map(k => {
    let value;
    if (k == 'data' || k == 'memory') {
      value = Uint8Array.from(dump[k]);
    } else if (k == 'stack') {
      value = Uint16Array.from(dump[k]);
    } else {
      value = dump[k];
    }

    return [k, value];
  }));

  return engine;
}

function compareEngines (engineA, engineB) {
  const comparators = {
    'data': (engineA, engineB) => {
      const dataA = engineA.get('data');
      const dataB = engineB.get('data');

      return dataA.map((a, i) => {
        const b = dataB[i];
        return a !== b ? `data[0x${i.toString(16)}]: ${a} -> ${b}\n` : '';
      }).join('');
    },
    'I': (engineA, engineB) => {
      const IA = engineA.get('I');
      const IB = engineB.get('I');

      return IA !== IB ? `I: ${IA} -> ${IB}\n` : '';
    },
    'timer': (engineA, engineB) => {
      const timerA = engineA.get('timer');
      const timerB = engineB.get('timer');

      return timerA !== timerB ? `timer: ${timerA} -> ${timerB}\n` : '';
    },
    'sound': (engineA, engineB) => {
      const soundA = engineA.get('sound');
      const soundB = engineB.get('sound');

      return soundA !== soundB ? `sound: ${soundA} -> ${soundB}\n` : '';
    },
    'memory': (engineA, engineB) => {
      const memoryA = engineA.get('memory');
      const memoryB = engineB.get('memory');

      return memoryA.map((a, i) => {
        const b = memoryB[i];
        return a !== b ? `memory[0x${i.toString(16)}]: ${a} -> ${b}\n` : '';
      }).join('');
    },
    'pc': (engineA, engineB) => {
      const pcA = engineA.get('pc');
      const pcB = engineB.get('pc');

      return pcA !== pcB ? `pc: ${pcA} -> ${pcB}\n` : '';
    },
    'pointer': (engineA, engineB) => {
      const pointerA = engineA.get('pointer');
      const pointerB = engineB.get('pointer');

      return pointerA !== pointerB ? `pointer: ${pointerA} -> ${pointerB}\n`
    },
    'stack': (engineA, engineB) => {
      const stackA = engineA.get('stack');
      const stackB = engineB.get('stack');

      return stackA.map((a, i) => {
        const b = stackB[i];
        return a !== b ? `stack[0x${i.toString(16)}]: ${a} -> ${b}\n` : '';
      }).join('');
    },
    'display': (engineA, engineB) => {
      const displayA = engineA.get('display');
      const displayB = engineB.get('display');

      return displayA.map((a, i) => {
        const b = displayB[i];
        return a.reduce((acc, v, i) => acc && v === b[i])
          ? `display[${i}]: ${a.map(v => 0 + v)}\n`
            + `           ${i.toString().length}-> ${b.map(v => 0 + v)}\n`
          : '';
      }).join('');
    },
    'keypad': (engineA, engineB) => {
      const keypadA = engineA.get('keypad');
      const keypadB = engineB.get('keypad');

      return keypadA.map((a, i) => {
        const b = keypadB[i];
        return a !== b ? `keypad[0x${i.toString(16)}]: ${a} -> ${b}\n` : '';
      }).join('');
    }
  }

  return Object.keys(comparators)
    .reduce((a, k) => a + comparators[k](engineA, engineB), '');
}
