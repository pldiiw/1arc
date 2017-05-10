const engine = require('engine');
const utility = require('utility');

let engineState = engine.initialize();

function UILoadEngine (files) {
  const dumpedEngineState = ''; // TODO
  engineState = utility.loadEngine(dumpedEngineState);
  UIUpdate(engineState);
}

function UILoadProgram (files) {
  const program = ''; // TODO
  engineState = engine.loadProgram(engineState, program);
  UIUpdate(engineState);
}

function UISaveEngine () {
  const dumpedEngineState = utility.dumpEngine(engineState);
  // TODO: save it to file
}

function UIPause () {

}

function UICycle (engineState) {
  engineState = engine.cycle(engineState);
  UIUpdate(engineState);
}

function UICycleOnce () {
  UICycle(engineState);
  document.querySelector('#pause').click();
}

function UICycleContinuously () {
  const FRAME_TIME = 1000 / 60;
  let now = 0;
  let then = 0;

  const tick = () => {
    now = window.perfomance.now();
    const elapsed = now - then;

    if (elapsed > FRAME_TIME) {
      then = now - elapsed % FRAME_TIME;
      UICycle(engineState);
    }

    if (document.querySelector('#cycle-continuously').checked) {
      window.requestAnimationFrame(tick);
    }
  };

  tick();
}

function UIUpdate () {
  UIDataUpdate();
  UIDisplayUpdate();
  UIMemoryUpdate();
  UIKeypadUpdate();
}

function generateDisplay () {
  let SVGDisplay = document.querySelector('#display');
  const SVGDisplayWidth = SVGDisplay.width.baseVal.value;
  const SVGDisplayHeight = SVGDisplay.height.baseVal.value;

  const display = engineState.get('display');

  const pixelWidth = SVGDisplayWidth / display[0].length;
  const pixelHeight = SVGDisplayHeight / display.length;

  display.forEach((row, rowIndex) => {
    row.forEach((col, colIndex) => {
      let pixel = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      pixel.setAttribute('x', pixelWidth * colIndex);
      pixel.setAttribute('y', pixelHeight * rowIndex);
      pixel.setAttribute('width', pixelWidth);
      pixel.setAttribute('height', pixelHeight);
      pixel.setAttribute('fill', display[rowIndex][colIndex] ? '#000' : '#FFF');
      SVGDisplay.appendChild(pixel);
    });
  });
}

function UIDisplayUpdate () {
  let SVGDisplay = document.querySelector('#display');
  const display = engineState.get('display');

  Array.prototype.forEach.call(SVGDisplay, (pixel, i) => {
    pixel.setAttribute('fill',
      display[Math.floor(i / display.length)][i % display[0].length]
        ? '#000'
        : '#FFF');
  });
}

function UIDataUpdate () {
  UIDataRegistersUpdate();
  UIOtherRegistersUpdate();
}

function UIDataRegistersUpdate () {
  let UIDataRegisters = document.querySelectorAll(
    '.data-registers-subsection samp');
  Array.prototype.forEach.call(UIDataRegisters, samp => {
    samp.innerText = engineState.get('data')[parseInt(samp.id, 16)];
  });
}

function UIOtherRegistersUpdate () {
  let UIOtherRegisters = document.querySelectorAll(
    '.other-registers-subsection samp');
  Array.prototype.forEach.call(UIOtherRegisters, samp => {
    if (/stack-[0-F]/.test(samp.id)) {
      samp.innerText =
        engineState.get('stack')[parseInt(samp.id.split('-')[1], 16)];
    } else {
      samp.innerText = engineState.get(samp.id);
    }
  });
}

generateDisplay();
