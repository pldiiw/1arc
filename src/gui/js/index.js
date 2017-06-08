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

function UIInit () {
  document.querySelector('#load-engine input').onchange(UILoadEngine);
  document.querySelector('#load-program input').onchange(UILoadProgram);
  document.querySelector('#save-engine input').onclick(UISaveEngine);
  document.querySelector('#pause input').onchange(UIPause);
  document.querySelector('#cycle-once input').onchange(UICycleOnce);
  document.querySelector('#cycle-continuously input').onchange(UICycleContinuously);
  defineInputs();
  UIGenerate();

}


function UIGenerate () {
  UIDisplayGenerate();
  UIMemoryGenerate();
}

function UIUpdate () {
  UIDataUpdate();
  UIDisplayUpdate();
  UIMemoryUpdate();
  UIKeypadUpdate();
}

function UILoadEngine () {
  let file = document.querySelector('#load-engine').files[0];
  let reader = FileReader();
  reader.onload = (event) => {
    const dumpedEngineState = event.target.result;
    engineState = utility.loadEngine(dumpedEngineState);
    UIUpdate();
  }
  reader.readAsText(file);
}

function UILoadProgram () {
  let file = document.querySelector('#load-engine').files[0];
  let reader = FileReader();
  reader.onload = (event) => {
    const program = utility.removeArtefacts(event.target.result);
    engineState = engine.loadProgram(engineState, program);
    UIUpdate();
  }
  reader.readAsText(file);
}

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

function UIPause () {

}

function UICycle () {
  engineState = engine.cycle(engineState);
  UIUpdate();
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

function UIDataUpdate () {
  UIDataRegistersUpdate();
  UIOtherRegistersUpdate();
}

function UIDataRegistersUpdate () {
  let UIDataRegisters = document.querySelectorAll(
    '.data-registers-subsection samp');
  const base = parseInt(document.querySelector('input[name="base-data"]:checked').value);
  Array.prototype.forEach.call(UIDataRegisters, samp => {
    samp.innerText = engineState.get('data')[parseInt(samp.id, 16)].toString(base);
    if (base === 2) {
      samp.innerText = samp.innerText.padStart(8, '0');
    }
  });
}

function UIOtherRegistersUpdate () {
  let UIOtherRegisters = document.querySelectorAll(
    '.other-registers-subsection samp');
  const base = parseInt(document.querySelector('input[name="base-data"]:checked').value);
  Array.prototype.forEach.call(UIOtherRegisters, samp => {
    if (/stack-[0-F]/.test(samp.id)) {
      samp.innerText =
        engineState.get('stack')[parseInt(samp.id.split('-')[1], 16)].toString(base);
    } else {
      samp.innerText = engineState.get(samp.id).toString(base);
    }

    if (base === 2) {
      samp.innerText = samp.innerText.padStart(/(pc|I|stack)/.test(samp.id) ? 16 : 8, '0');
    }
  });
}

function UIMemoryGenerate () {
  let UIMemoryCellSection = document.querySelector('#cells');
  const memory = engineState.get('memory');

  memory.forEach((v, i) => {
    let cell = document.createElement('div');
    let value = document.createElement('samp');
    let cellNumber = document.createElement('samp');

    value.innerText = v;
    cellNumber.innerText = i;

    cell.appendChild(value);
    cell.appendChild(cellNumber);

    UIMemoryCellSection.appendChild(cell);
  });
}

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
  });
}

function UIKeypadUpdate () {
  let UIKeypadKeys = document.querySelectorAll('#keypad-section .key')
  const keypad = engineState.get('keypad');

  Array.prototype.forEach.call(UIKeypadKeys, v => {
    v.querySelector('samp').innerText =
      keypad[parseInt(v.id.slice(-1), 16)] ? 1 : 0;
  });

}

function defineInputs () {
  let down = false;
  keyPress = []
  engineKeypad = Array(16).fill(false);
  document.addEventListener('keydown', event => {
    if(event.keyCode == 32 || event.keyCode == 16 || event.keyCode == 9){
      event.preventDefault();
    }
    if(keyPress.indexOf(event.keyCode) == -1){
      keyPress.push(event.keyCode);
      doInputsSwitch(event, 'keydown');
    } 
  });


  document.addEventListener('keyup', event =>{
    if(keyPress.indexOf(event.keyCode)!=-1){
      doInputsSwitch(event, 'keyup');
      keyPress.splice(keyPress.indexOf(event.keyCode),1);
    }
  });
  defineMouseInputs();
}

function doInputsSwitch(event, state) {
  var button = "";

    switch (event.keyCode) {
      case 32:
      case 16:
        if(event.target == document.body && state == 'keydown') {
          if(keyPress.indexOf(16)!=-1 && keyPress.indexOf(32)!=-1){
            document.querySelector("#cycle-continuously input").checked = true;
          } else if (event.keyCode == 32){
            document.querySelector("#cycle-once input").checked = true;
          }
        }
        if(state == 'keyup'){
          if(keyPress.indexOf(16)!=-1 && keyPress.indexOf(32)!=-1){
            document.querySelector("#cycle-continuously input").checked = false;
          } else if(event.keyCode == 32){
            document.querySelector("#cycle-once input").checked = false;
          }
        }
        break;
      
      case 49: //&
        button = "key-1";
        break;

      case 50: //é
        button = "key-2";
        break;

      case 51: //"
        button = "key-3";
        break;

      case 52: //'
        button = "key-C";
        break;

      case 65: //a
        button = "key-4";
        break;

      case 90: //z
        button = "key-5";
        break;

      case 69: //e
        button = "key-6";
        break;

      case 82: //r
        button = "key-D";
        break;

      case 81: //q
        button = "key-7";
        break;

      case 83: //s
        button = "key-8";
        break;

      case 68: //d
        button = "key-9";
        break;

      case 70: //f
        button = "key-E";
        break;

      case 87: //w
        button = "key-A";
        break;

      case 88: //x
        button = "key-0";
        break;

      case 67: //c
        button = "key-B";
        break;

      case 86: //v
        button = "key-F";
        break;

      case 9: //tab
        if(event.target == document.body&& state == 'keydown') {
          nextWidgetSelection();
        }
        break;
      case 17:
        if(state == 'keydown'){
          showHelp();
        } else if (state == 'keyup') {
          hideHelp();
        }
        break;
        
      default:
        break;
    }
    if(button!=""){
      engineKeypad[parseInt(button.slice(-1),16)] = state=='keydown';
      engineState = engineState.set("keypad", engineKeypad);
      UIKeypadUpdate ()
    }
}

function nextWidgetSelection(){
  let widgets = document.getElementsByClassName("base-widget");
  for(let i=0;i<Object.keys(widgets).length;i++) {
    let child = widgets[i].childNodes;

    for(let j=1; j<((Object.keys(child).length)-1);j = j+4) {
      
      if(child[j].checked == true){
          child[j].checked = false;
          if(Object.keys(child).length-1-j>4){
            child[j+4].checked = true;
          } else {
            child[1].checked = true;
          }
          j = Object.keys(child).length;
      }
    }
  }
}

function defineMouseInputs(){
  let UIKeypadKeys = document.querySelectorAll('#keypad-section .key')
  for(let i=0;i<Object.keys(UIKeypadKeys).length;i++){
    UIKeypadKeys[i].setAttribute("onmousedown","mousePress(\""+String(UIKeypadKeys[i].id)+"\", true)");
    UIKeypadKeys[i].setAttribute("onmouseup","mousePress(\""+String(UIKeypadKeys[i].id)+"\", false)");
  }
}

function mousePress(id,state){
  engineKeypad[parseInt(id.slice(-1),16)] = state;
  engineState = engineState.set("keypad", engineKeypad);
  UIKeypadUpdate ()
}

function showHelp(){
  const mainComponent = document.getElementsByClassName('main-component');
  let elm;
  for(let i=0;i<5;i++){
    elm=document.createElement('p');
    elm.className='help'
    elm.textContent=mainComponent[i].id;
    mainComponent[i].appendChild(elm)
    console.log(mainComponent[i]);
  }
}

function hideHelp(){

}

defineInputs();