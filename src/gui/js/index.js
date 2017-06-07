//const engine = require('engine');
//const utility = require('utility');

let engineState = new Map([
  ['data', new Uint8Array(16)],
  ['I', 0],
  ['timer', 0],
  ['sound', 0],
  ['memory', new Uint8Array(4096)],
  ['pc', 0],
  ['pointer', 0],
  ['stack', new Uint16Array(16)],
  ['display', Array(32).fill(Array(64).fill(false))],
  ['keypad', Array(16).fill(false)]
]);

/**
 * Initialize the UI's inputs, button actions, generate the UI components that
 * needs to be and finally update the UI, making it ready to roll.
 */
function UIInit () {
  document.querySelector('#load-engine input').onchange = UILoadEngine;
  document.querySelector('#load-program input').onchange = UILoadProgram;
  document.querySelector('#save-engine input').onclick = UISaveEngine;
  document.querySelector('#pause').onclick = UIPause;
  document.querySelector('#cycle-once input').onchange = UICycleOnce;
  document.querySelector('#cycle-continuously input')
    .onchange = UICycleContinuously;
  document.querySelector('#data-section .base-widget')
    .onclick = UIDataUpdate;
  document.querySelector('#memory-section .base-widget')
    .onclick = UIMemoryUpdate;
  UIGenerate();
  UIUpdate();
  UIEditOnTheFlyEventsGenerate();
}

/**
 * Wrapper function that calls the subroutines to generate the display and the
 * memory UI components.
 */
function UIGenerate () {
  UIDisplayGenerate();
  UIMemoryGenerate();
}

/**
 * Wrapper function that calls the subroutines to update all UI components.
 * (data, display, memory and keypad)
 */
function UIUpdate () {
  UIDataUpdate();
  UIDisplayUpdate();
  UIMemoryUpdate();
  UIKeypadUpdate();
}

/**
 * Should be triggered when clicking on the 'Load engine' button.
 * Retrieve the uploaded file and restore the engine in it.
 */
function UILoadEngine () {
  let file = document.querySelector('#load-engine').files[0];
  let reader = FileReader();
  reader.onload = (event) => {
    const dumpedEngineState = event.target.result;
    engineState = utility.loadEngine(dumpedEngineState);
    UIUpdate();
  };
  reader.readAsText(file);
}

/**
 * Should be triggered when clicking on the 'Load program' button.
 * Retrieve the uploaded program and load it inside the engine.
 */
function UILoadProgram () {
  let file = document.querySelector('#load-engine').files[0];
  let reader = FileReader();
  reader.onload = (event) => {
    const program = utility.removeArtefacts(event.target.result);
    engineState = engine.loadProgram(engineState, program);
    UIUpdate();
  };
  reader.readAsText(file);
}

/**
 * Should be triggered when clicking on the 'Save engine' button.
 * Dump the current state and make the user download it.
 */
function UISaveEngine () {
  const dumpedEngineState = utility.dumpEngine(engineState);
  const engineDataURI =
    'data:text/plain;charset=utf-8,' + encodeURIComponent(dumpedEngineState);
  let download = document.createElement('a');
  download.setAttribute('href', engineDataURI);
  download.setAttribute('download', 'engine_state.chip8.txt');
  download.style.display = 'none';

  document.body.appendChild(download);
  download.click();
  document.body.removeChild(download);
}

/**
 * Should be triggered when clicking on the pause button.
 * Does nothing, idle state for the UI.
 */
function UIPause () {}

/**
 * Utility subroutine to run one engine cycle and update the UI at once.
 */
function UICycle () {
  engineState = engine.cycle(engineState);
  UIUpdate();
}

/**
 * Should be triggered when clicking on the play button.
 * Run one cycle on the current engine state and return to the 'paused' state.
 */
function UICycleOnce () {
  UICycle(engineState);
  document.querySelector('#pause').click();
}

/**
 * Should be triggered when clicking on the fast-forward button.
 * Run cycles on the current engine state at a rate of 60Hz until the
 * fast-button is unchecked.
 */
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

/**
 * Generate the pixels of the display. Being an SVG element, each pixel is a
 * rect.
 */
function UIDisplayGenerate () {
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
      SVGDisplay.appendChild(pixel);
    });
  });
}

/**
 * Update the display UI compenent. It retrieves every pixels and fill it with
 * black if it is set true in the engine, otherwise it is filled with white.
 */
function UIDisplayUpdate () {
  let SVGDisplay = document.querySelector('#display');
  const display = engineState.get('display');

  Array.prototype.forEach.call(SVGDisplay.children, (pixel, i) => {
    pixel.setAttribute('fill',
      display[Math.floor(i / display[0].length)][i % display[0].length]
        ? '#000'
        : '#FFF');
  });
}

/**
 * Wrapper function to update the data registers section and the other
 * registers (pc, I, timer, ...) UI components.
 */
function UIDataUpdate () {
  UIDataRegistersUpdate();
  UIOtherRegistersUpdate();
}

/**
 * Update the data registers' UI section.
 */
function UIDataRegistersUpdate () {
  let UIDataRegisters = document.querySelectorAll(
    '.data-registers-subsection samp');
  const base = parseInt(
    document.querySelector('input[name="base-data"]:checked').value);
  Array.prototype.forEach.call(UIDataRegisters, samp => {
    samp.innerText = engineState.get('data')[parseInt(samp.id, 16)]
      .toString(base);
    if (base === 2) {
      samp.innerText = samp.innerText.padStart(8, '0');
    }
  });
}

/**
 * Update the other registers' UI section.
 */
function UIOtherRegistersUpdate () {
  let UIOtherRegisters = document.querySelectorAll(
    '.other-registers-subsection samp');
  const base = parseInt(
    document.querySelector('input[name="base-data"]:checked').value);
  Array.prototype.forEach.call(UIOtherRegisters, samp => {
    if (/stack-[0-F]/.test(samp.id)) {
      samp.innerText = engineState
        .get('stack')[parseInt(samp.id.split('-')[1], 16)].toString(base);
    } else {
      samp.innerText = engineState.get(samp.id).toString(base);
    }

    if (base === 2) {
      samp.innerText = samp.innerText
        .padStart(/(pc|I|stack)/.test(samp.id) ? 16 : 8, '0');
    }
  });
}

/**
 * Generate all the cells of memory in the dedicated UI section.
 */
function UIMemoryGenerate () {
  let UIMemoryCellSection = document.querySelector('#cells');
  const memory = engineState.get('memory');

  memory.forEach((v, i) => {
    let cell = document.createElement('div');
    let value = document.createElement('samp');
    let cellNumber = document.createElement('samp');

    if (i === engineState.get('pc')) {
      cell.classList.add('highlight');
    } else {
      cell.classList.remove('highlight');
    }

    value.innerText = v;
    cellNumber.innerText = i;

    cell.appendChild(value);
    cell.appendChild(cellNumber);

    UIMemoryCellSection.appendChild(cell);
  });
}

/**
 * Update every UI memory cell with its corresponding memory cell in the engine.
 */
function UIMemoryUpdate () {
  let UIMemoryCells = document.querySelectorAll('#cells div');
  const memory = engineState.get('memory');
  const base = parseInt(document.querySelector('input[name="base-memory"]:checked').value);

  memory.forEach((v, i) => {
    let value = v.toString(base);

    if (base === 2) {
      value = value.padStart(8, '0');
    }

    UIMemoryCells[i].children[0].innerText = value;

    if (i === engineState.get('pc')) {
      UIMemoryCells[i].classList.add('highlight');
    } else {
      UIMemoryCells[i].classList.remove('highlight');
    }
  });
}

/*
 * Update the keypad section
 */
function UIKeypadUpdate () {
  let UIKeypadKeys = document.querySelectorAll('#keypad-section .key');
  const keypad = engineState.get('keypad');

  Array.prototype.forEach.call(UIKeypadKeys, v => {
    const keyIndex = parseInt(v.id.split('-')[1], 16);

    v.querySelector('samp').innerText = keypad[keyIndex] ? 1 : 0;

    if (keypad[keyIndex]) {
      v.classList.add('highlight');
    } else {
      v.classList.remove('highlight');
    }
  });
}

function UIEditOnTheFlyEventsGenerate() {
//display
  Array.prototype.forEach.call(document.querySelectorAll("rect"), function(e, i) {
      e.ondblclick = function() {
        let display = engineState.get('display');
        console.log(i);
        console.log("row" + Math.trunc((i / 64)))
        console.log("col" + Math.trunc(i % 64))
        console.log("val : " + display[(Math.trunc(i / 64))][(Math.trunc(i % 64))])
        //console.log(display);

        display[(Math.trunc(i / 64))][(Math.trunc(i % 64))] = !display[(Math.trunc(i / 64))][(Math.trunc(i % 64))];
        engineState = engineState.set('display', display);
        console.log("/////")
        console.log(display[(Math.trunc((i / 64)))])
        console.log(display[(Math.trunc((i / 64)))][(Math.trunc(i % 64))])
        console.log(display[(Math.trunc((i / 64) + 1))])

        document.querySelectorAll("rect")[i].style.fill="blue"
        UIDisplayUpdate();
      };
    }
  );
//data-registers
  Array.prototype.forEach.call(document.querySelectorAll(".data-registers-subsection ol li samp"), function(e, i) {
      e.ondblclick = function() {
        let data = engineState.get('data');
        data[i] = parseInt(prompt("Enter value"));
        engineState = engineState.set('data', data);
        UIDataUpdate();
      };
    }
  );
//memory
  Array.prototype.forEach.call(document.querySelectorAll("#cells div samp:first-child"), function(e, i) {
      e.ondblclick = function() {
        let memory = engineState.get('memory');
        memory[i] = parseInt(prompt("Enter value"));
        engineState = engineState.set('memory', memory);
        UIMemoryUpdate();
      };
    }
  );
}
