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
let cell = 3;
let cell2 = 2;
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

  let cellValue = createDiv("");
  cellValue.parent("changeSurvival_");
  changeSurvival_ = createSelect();
  changeSurvival_.parent("changeSurvival_");
  changeSurvival_.option("Default");
  changeSurvival_.option("1");
  changeSurvival_.option("2");
  changeSurvival_.option("3");
  changeSurvival_.option("4");
  changeSurvival_.selected("Default");
  changeSurvival_.changed(changeSurvival);
  // <-------------------->
  /* Set the canvas to be under the element #canvas*/
  // const canvas = createCanvas(windowWidth, windowHeight);
  const canvas = createCanvas(900, 1000 - 200);
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
// <--------Init-------->
// function mouseClicked() {
//   //here we test if the mouse is over the
//   //canvas element when it's clicked
//   if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
//     background(200);

//     if (sampleIsPlaying) {
//       //Calling pause() on our
//       //p5.MediaElement will stop it
//       //playing, but when we call the
//       //loop() or play() functions
//       //the sample will start from
//       //where we paused it.
//       ele.pause();

//       sampleIsPlaying = false;
//       text("Click to resume!", width / 2, height / 2);
//     } else {
//       //loop our sound element until we
//       //call ele.pause() on it.
//       ele.loop();

//       sampleIsPlaying = true;
//       text("Click to pause!", width / 2, height / 2);
//     }
//   }
// }

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
      } else if (currentBoard[x][y] == 1 && neighbors > 2) {
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

//-------------------------------
document.querySelector(".mp3").addEventListener("click", function () {
  ele = createAudio("mp3/Sonic The Hedgehog OST - Green Hill Zone.mp3");
  ele.autoplay(true);
  ele.volume(0.3);
}); //audio
//<----------------------------->
function changeSurvival() {
  let value = changeSurvival_.value();
  if (value == "1") {
    cell = 1;
  } else if (value == "2") {
    cell = 2;
  } else if (value == "3") {
    cell = 3;
  } else if (value == "4") {
    cell = 4;
  }
}

const selectElement = document.querySelector("#cellNum");
console.log("selectElement");
selectElement.addEventListener("change", (e) => {
  cell2 = e.target.value;
  console.log("222");
});

// document.querySelector("#changeSurvival.button").addEventListener("change", e =>){}
// let textField = document.querySelector("#textField").value;
