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
let cp1 = 3;
let cp = 2;

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
  colorPickerStroke = createColorPicker("#e3e3e3");
  strokePicker.parent("controlBar");
  colorPickerStroke.parent("controlBar");

  let DraggedPicker = createDiv("Dragged Color");
  colorPickerDragged = createColorPicker("#ffd966");
  DraggedPicker.parent("controlBar");
  colorPickerDragged.parent("controlBar");

  let sliderControl = createDiv("Speed Control");
  slider = createSlider(1, 50, 10);
  sliderControl.parent("secondControlBar");
  slider.parent("secondControlBar");
  sliderControl.style("margin-top: 6px;");

  // <-------------------->
  /* Set the canvas to be under the element #canvas*/
  // const canvas = createCanvas(windowWidth, windowHeight);
  const canvas = createCanvas(1200, 740 - 200);
  canvas.parent("#canvas");
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

//<---------Rules---------->

const selectElement = document
  .querySelector("#cp")
  .addEventListener("change", (e) => {
    cp = e.target.value;
  });

// document.addEventListener("DOMContentLoaded", () => {
//   const cellDead = document.querySelector("#changeNeighbor");
//   cellDead.addEventListener("change", (event) => {
//     cp1 = event.target.value;
//   });
// });

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
  noLoop();
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
        // lifeCount = lifeCount + 1;
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
      // document.querySelector("#life-Count").innerHTML = lifeCount;
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
      if (currentBoard[x][y] == 1 && neighbors < cp) {
        // Die of Loneliness
        nextBoard[x][y] = 0;
      } else if (currentBoard[x][y] == 1 && neighbors > cp1) {
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
    continue;
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
  stroke("255");
  circle(
    //change square to circle
    x * unitLength + unitLength / 2,
    y * unitLength + unitLength / 2,
    unitLength
  );
}
// <--------Mouse Pressed------->
function mousePressed() {
  // mouseDragged();
}
// <--------Mouse Released------->
function mouseReleased() {
  // noLoop();
}
//<----------Start--------->
document.querySelector(".start").addEventListener("click", function () {
  loop();
});
//<-----------Stop---------->
document.querySelector(".stop").addEventListener("click", function () {
  noLoop();
});
//<----------Clear---------->
document.querySelector(".clear").addEventListener("click", function () {
  initClear();
  loop();
});

//<---------Create--------->
document.querySelector(".random").addEventListener("click", function () {
  init();
  loop();
});
//<---------Refresh---------->`
document.querySelector(".Refresh").addEventListener("click", function () {
  location.reload();
});
//<------------Audio---------->
document.querySelector(".mp3").addEventListener("click", function () {
  ele = createAudio(
    "mp3/Rick Astley - Never Gonna Give You Up (Official Music Video).mp3"
  );
  ele.autoplay(true);
  ele.volume(0.3);
}); //audio
//<----------------------------->
