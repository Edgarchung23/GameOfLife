const unitLength = 10;
const boxColor = 0;
const strokeColor = 0;
let columns; /* To be determined by window width */
// let rows; /* To be determined by window height */
let currentBoard;
let nextBoard;
// let colorPicker;
let slider;
let flag = false;
let ele;

// <--------Setup-------->
function setup() {
  let cellPicker = createDiv("Cell Color"); //cell color
  colorPicker = createColorPicker("#19568c");
  cellPicker.parent("controlBar");
  colorPicker.parent("controlBar");
  colorPicker.style("width", "110px");
  colorPicker.style("height", "25px");

  let boxBgPicker = createDiv("BackGround Color"); //background Color
  colorPickerBoxBg = createColorPicker("100");
  boxBgPicker.parent("controlBar");
  colorPickerBoxBg.parent("controlBar");

  let strokePicker = createDiv("Stroke Color");
  colorPickerStroke = createColorPicker("#ebf4fd");
  strokePicker.parent("controlBar");
  colorPickerStroke.parent("controlBar");

  let DraggedPicker = createDiv("Dragged Color");
  colorPickerDragged = createColorPicker("#ffd966");
  DraggedPicker.parent("controlBar");
  colorPickerDragged.parent("controlBar");

  let sliderControl = createDiv("Speed Control");
  slider = createSlider(1, 200, 20);
  sliderControl.parent("secondControlBar");
  slider.parent("secondControlBar");
  sliderSpan = createSpan;

  // <-------------------->
  /* Set the canvas to be under the element #canvas*/
  createCanvas(windowWidth, windowHeight);
  // const canvas = createCanvas(windowWidth, windowHeight - 100);
  const canvas = createCanvas(800, 500 - 100);
  canvas.parent(document.querySelector("#canvas"));

  /*Calculate the number of columns and rows */
  columns = floor(width / unitLength);
  rows = floor(height / unitLength);

  /*Making both currentBoard and nextBoard 2-dimensional matrix that has (columns * rows) boxes. */
  currentBoard = [];
  nextBoard = [];
  for (let i = 0; i < columns; i++) {
    currentBoard[i] = [];
    nextBoard[i] = [];
  }

  initClear(); // Set the initial values of the currentBoard and nextBoard
}
// <--------Init-------->
function init() {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      currentBoard[i][j] = random() > 0.8 ? 1 : 0;
      nextBoard[i][j] = 0;
    }
  }
}
function initClear() {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      currentBoard[i][j] = 0;
      nextBoard[i][j] = 0;
    }
  }
}

// <--------Draw-------->

function draw() {
  let val = slider.value(); //speed slider
  frameRate(val);
  // <----------------------->
  generate();
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      if (currentBoard[i][j] == 1) {
        if (nextBoard[i][j] == 1) {
          fill(colorPicker.color()); //  // 之前都係1change cell color
        } else {
          fill(colorPickerDragged.color()); // 依家係1 change cell color
        }
      } else {
        fill(colorPickerBoxBg.color()); //change the box background
      }
      stroke(colorPickerStroke.color()); //change the stroke color;
      circle(
        i * unitLength + unitLength / 2,
        j * unitLength + unitLength / 2,
        unitLength
      );
    }
  }
}

// <--------Generate-------->
function generate() {
  //Loop over every single box on the board
  for (let x = 0; x < columns; x++) {
    for (let y = 0; y < rows; y++) {
      // Count all living members in the Moore neighborhood(8 boxes surrounding)
      let neighbors = 0;
      for (let i of [-1, 0, 1]) {
        for (let j of [-1, 0, 1]) {
          if (i == 0 && j == 0) {
            // the cell itself is not its own neighbor
            continue;
          }
          // The modulo operator is crucial for wrapping on the edge
          neighbors +=
            currentBoard[(x + i + columns) % columns][(y + j + rows) % rows];
        }
      }
      // Rules of Life
      if (currentBoard[x][y] == 1 && neighbors < 2) {
        // Die of Loneliness
        nextBoard[x][y] = 0;
      } else if (currentBoard[x][y] == 1 && neighbors > 3) {
        // Die of Overpopulation
        nextBoard[x][y] = 0;
      } else if (currentBoard[x][y] == 0 && neighbors == 3) {
        // New life due to Reproduction
        nextBoard[x][y] = 1;
      } else {
        // Stasis
        nextBoard[x][y] = currentBoard[x][y];
      }
    }
  } // Swap the nextBoard to be the current Board
  [currentBoard, nextBoard] = [nextBoard, currentBoard];
}

// <--------Mouse Dragged------->
function mouseDragged() {
  /**
   * If the mouse coordinate is outside the board
   */
  if (mouseX > unitLength * columns || mouseY > unitLength * rows) {
    return;
  }
  const x = Math.floor(mouseX / unitLength);
  const y = Math.floor(mouseY / unitLength);
  currentBoard[x][y] = 1;

  fill("#000000");
  stroke("#000000");
  circle(
    //change square to circle
    x * unitLength + unitLength / 2,
    y * unitLength + unitLength / 2,
    unitLength
  );

  noLoop();
}

// <--------Mouse Pressed------->
function mousePressed() {
  // noLoop();
  mouseDragged();
}

// <--------Mouse Released------->
function mouseReleased() {
  // noLoop();
}
//<----------Start--------->
document.querySelector(".start").addEventListener("click", function () {
  loop();
  flag = true;
});
//<-----------Stop---------->
document.querySelector(".stop").addEventListener("click", function () {
  noLoop();
  flag = false;
});
//<----------Clear---------->
document.querySelector(".clear").addEventListener("click", function () {
  initClear();
  loop();
});

//<---------Random--------->
document.querySelector(".random").addEventListener("click", function () {
  noLoop();
  init();
  loop();
});
//<---------LoopAgain--------->
function LoopAgain() {
  loop();
}

//-------------------------------
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

document.querySelector(".mp3").addEventListener("click", function () {
  const selectElement = document.querySelector(".mp3");
  const result = document.querySelector(".result");
  ele = createAudio("mp3/Sonic The Hedgehog OST - Green Hill Zone.mp3");
  ele.autoplay(true);
  ele.volume(0.3);
});
