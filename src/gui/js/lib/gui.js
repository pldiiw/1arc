/** @global */
let engineState;

define(['engine', 'utility'], (engine, utility) => {
  engineState = engine.initialize();

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
    defineInputs();
    UIEditOnTheFlyEventsGenerate();
    UIUpdate();
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
  function UILoadEngine (event) {
    let file = event.target.files[0];
    let reader = new FileReader();
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
  function UILoadProgram (event) {
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.onload = (event) => {
      const program = utility.removeArtefacts(event.target.result);
      engineState = engine.prepare(engine.initialize(), program);
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
    UICycle();
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
      now = window.performance.now();
      const elapsed = now - then;

      if (elapsed > FRAME_TIME) {
        then = now - elapsed % FRAME_TIME;
        UICycle();
      }

      if (document.querySelector('#cycle-continuously input').checked) {
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
        let pixel = document.createElementNS('http://www.w3.org/2000/svg',
        'rect');
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

      // Put sound in gyrophare mode if it should emit sound.
        if (samp.id === 'sound' && engineState.get('sound') > 2) {
          samp.parentElement.classList.add('gyrophare');
        } else if (samp.id === 'sound' && engineState.get('sound') <= 2) {
          samp.parentElement.classList.remove('gyrophare');
        }
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
 * Update every UI memory cell with its corresponding memory cell in the
 * engine.
 */
  function UIMemoryUpdate () {
    let UIMemoryCells = document.querySelectorAll('#cells div samp:first-child');
    const memory = engineState.get('memory');
    const base = parseInt(
    document.querySelector('input[name="base-memory"]:checked').value);

    const UIMemoryValues = Array.prototype.reduce.call(UIMemoryCells,
      (a, cell) => a.concat(cell.innerText), []);

    memory.forEach((v, i) => {
      let value = v.toString(base);

      if (base === 2) {
        value = value.padStart(8, '0');
      }

      if (UIMemoryValues[i] !== value) {
        UIMemoryCells[i].innerText = value;
      }

      if (i === engineState.get('pc')) {
        UIMemoryCells[i].parentElement.classList.add('highlight');
      } else {
        UIMemoryCells[i].parentElement.classList.remove('highlight');
      }
    });
  }

/**
 * Update the keypad section
 */
  function UIKeypadUpdate () {
    let UIKeypadKeys = document.querySelectorAll('#keypad-section .key');
    const keypad = engineState.get('keypad');

    Array.prototype.forEach.call(UIKeypadKeys, v => {
      const keyIndex = parseInt(v.id.slice(-1), 16);

      v.querySelector('samp').innerText = keypad[keyIndex] ? 1 : 0;

      if (keypad[keyIndex]) {
        v.classList.add('highlight');
      } else {
        v.classList.remove('highlight');
      }
    });
  }

  function UIEditOnTheFlyEventsGenerate () {
    let ask = () => {
      return parseInt(prompt('Enter new value (prefix 0x for hex):'));
    };

    Array.prototype.forEach.call(
      document.querySelectorAll('#display rect'),
      (pixel, i) => {
        pixel.onclick = () => {
          let display = engineState.get('display');
          const x = Math.trunc(i % 64);
          const y = Math.trunc(i / 64);
          display[y][x] = !display[y][x];
          engineState = engineState.set('display', display);
          UIDisplayUpdate();
        };
      });

    Array.prototype.forEach.call(
      document.querySelectorAll('.data-registers-subsection samp'),
      (v, i) => {
        v.ondblclick = () => {
          let data = engineState.get('data');
          data[i] = ask();
          engineState = engineState.set('data', data);
          UIDataRegistersUpdate();
        };
      });

    Array.prototype.forEach.call(
      document.querySelectorAll(".other-registers-subsection samp"),
      (v, i) => {
        const componentName = /stack-/.test(v.id) ? 'stack' : v.id;
        v.ondblclick = function() {
          let component = engineState.get(componentName);
          if (componentName === 'stack') {
            component[parseInt(v.id.slice(-1), 16)] = ask();
          } else {
            component = ask();
          }
          engineState = engineState.set(componentName, component);
          UIOtherRegistersUpdate();
        };
      });

    Array.prototype.forEach.call(
      document.querySelectorAll('#cells div samp:first-child'),
      (v, i) => {
        v.ondblclick = function () {
          let memory = engineState.get('memory');
          memory[i] = ask();
          engineState = engineState.set('memory', memory);
          UIMemoryUpdate();
        };
      });
  }

  function defineInputs () {
    let processInput = event => {
      if (event.keyCode === 32 || event.keyCode === 16 || event.keyCode === 9) {
        event.preventDefault();
      }
      doInputsSwitch(event);
    };

    document.body.onkeydown = processInput;
    document.body.onkeyup = processInput;

    defineMouseInputs();
  }

  function doInputsSwitch (event) {
    let button = '';

    switch (event.keyCode) {
      case 32:
        if (event.type === 'keydown' && event.shiftKey) {
            document.querySelector('#cycle-continuously input').click();
        } else if (event.type === 'keydown') {
            document.querySelector('#cycle-once input').click();
        } else if (event.type === 'keyup' && !event.shiftKey) {
          document.querySelector('#pause input').click();
        }
        break;

      case 49: // &
        button = 'key-1';
        break;

      case 50: // é
        button = 'key-2';
        break;

      case 51: // "
        button = 'key-3';
        break;

      case 52: // '
        button = 'key-C';
        break;

      case 65: // a
        button = 'key-4';
        break;

      case 90: // z
        button = 'key-5';
        break;

      case 69: // e
        button = 'key-6';
        break;

      case 82: // r
        button = 'key-D';
        break;

      case 81: // q
        button = 'key-7';
        break;

      case 83: // s
        button = 'key-8';
        break;

      case 68: // d
        button = 'key-9';
        break;

      case 70: // f
        button = 'key-E';
        break;

      case 87: // w
        button = 'key-A';
        break;

      case 88: // x
        button = 'key-0';
        break;

      case 67: // c
        button = 'key-B';
        break;

      case 86: // v
        button = 'key-F';
        break;

      case 9: // tab
        if (event.type === 'keydown') {
          nextWidgetSelection();
        }
        break;
      default:
        break;
    }
    if (button !== '') {
      let keypad = engineState.get('keypad');
      const key = parseInt(button.slice(-1), 16);
      keypad[key] = !keypad[key];
      engineState = engineState.set('keypad', keypad);
      UIKeypadUpdate();
    }
  }

  function nextWidgetSelection () {
    Array.prototype.forEach.call(
      document.querySelectorAll('.base-widget'),
      (widget) => {
        const nextBase = Array.prototype.reduce.call(
          widget.querySelectorAll('input'),
          (a, base, i, bases) => {
            if (base.checked) {
              return bases[(i + 1) % 3];
            } else {
              console.log(i);
              return a;
            }
          }, { checked: false });

        nextBase.click();
      });
  }

  function defineMouseInputs () {
    Array.prototype.forEach.call(
      document.querySelectorAll('#keypad-section .key'),
      (UIKey) => {
        UIKey.onmousedown = mousePress;
      });
  }

  function mousePress (event) {
    let keypad = engineState.get('keypad');
    const key = parseInt(event.target.id.slice(-1), 16);
    keypad[key] = !keypad[key];
    engineState = engineState.set('keypad', keypad);
    UIKeypadUpdate();
  }

  return {
    engineState: engineState,
    UIInit: UIInit,
    UIGenerate: UIGenerate,
    UIUpdate: UIUpdate,
    UILoadEngine: UILoadEngine,
    UILoadProgram: UILoadProgram,
    UISaveEngine: UISaveEngine,
    UIPause: UIPause,
    UICycle: UICycle,
    UICycleOnce: UICycleOnce,
    UICycleContinuously: UICycleContinuously,
    UIDisplayGenerate: UIDisplayGenerate,
    UIDisplayUpdate: UIDisplayUpdate,
    UIDataUpdate: UIDataUpdate,
    UIDataRegistersUpdate: UIDataRegistersUpdate,
    UIOtherRegistersUpdate: UIOtherRegistersUpdate,
    UIMemoryGenerate: UIMemoryGenerate,
    UIMemoryUpdate: UIMemoryUpdate,
    UIKeypadUpdate: UIKeypadUpdate,
    UIEditOnTheFlyEventsGenerate: UIEditOnTheFlyEventsGenerate
  };
});
