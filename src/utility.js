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
