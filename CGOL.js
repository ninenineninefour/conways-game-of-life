"use strict";
var matrix = [[]];
var newMatrix = [[]];
var rows = 32;
var columns = 32;
var cycle;
var gameRunning = false;

var matrixAreaSize = 320;
var cellWidth;
var cellHeight;

function randomizeMatrix() {
  matrix = [[]];
  for(var i = 0;i < rows;i++) {
    matrix[i] = [];
    for(var j = 0;j < columns;j++) {
      matrix[i][j] = Math.floor(Math.random()*2);
    }
  }
  updateMatrixArea();
}

function logMatrix() {
  for(var i = 0;i < rows;i++) {
    var line = ""
    for(var j = 0;j < columns;j++) {
      if(matrix[i][j] == 1) {
        line += "[]";
      } else {
        line += "  ";
      }
    }
    console.log(line);
  }
}

function updateMatrix() {
  newMatrix = [[]];
  for(var i = 0;i < rows;i++) {
    newMatrix[i] = [];
    for(var j = 0;j < columns;j++) {
      updateCell(i,j);
    }
  }
  for(i = 0;i < rows;i++) {
    matrix[i] = newMatrix[i].slice();
  }
}

function countNeighbors(r,c) {
  var neighbors = 0;
  for(var h = r - 1;h <= r + 1;h++) {
    for(var k = c - 1;k <= c + 1;k++) {
      if(0 <= h && h < rows && 0 <= k && k < columns && !(h == r && k == c)) {
        neighbors += matrix[h][k];
      }
    }
  }
  return neighbors;
}

function updateCell(r,c) {
  var neighbors = countNeighbors(r,c);
  if(neighbors < 2 || 3 < neighbors) {
    newMatrix[r][c] = 0;
  } else if (neighbors == 3) {
    newMatrix[r][c] = 1;
  } else {
    newMatrix[r][c] = matrix[r][c];
  }
  updateCellArea(r,c);
}

function test() {
  randomizeMatrix();
  logMatrix();
  for(cycles = 0;cycles < 256;cycles++) {
    console.log("----------------------------------------------------------------");
    updateMatrix();
    logMatrix();
  }
}

// page scripts

var matrixCellList = [];

function setupMatrixArea() {
  cellWidth = matrixAreaSize/columns;
  cellHeight = matrixAreaSize/rows;
  var matrixHTML = "";
  for(var i = 0;i < rows;i++) {
    matrixHTML += "<div class=\"matrix-row\" style=\"height:" + cellHeight + "px;\">";
    for(var j = 0;j < columns;j++) {
      matrixHTML += "<div class=\"matrix-cell dead\" id=\"cell\" style=\"width:" + cellWidth + "px;height:" + cellHeight + "px;\"></div>";
    }
    matrixHTML += "</div>";
  }
  //console.log(matrixHTML);
  document.getElementById("matrix-area").innerHTML = matrixHTML;
  matrixCellList = document.getElementsByClassName("matrix-cell");
  //console.log(matrixCellList);
}

function updateMatrixArea() {
  for(var r = 0;r < rows;r++) {
    for(var c = 0;c < columns;c++) {
      updateCellArea(r,c);
    }
  }
}

function updateCellArea(r,c) {
  //console.log(r*columns + c);
  //console.log(matrixCellList[r*columns + c]);
  if(matrix[r][c] == 1) {
    matrixCellList[r*columns + c].classList.remove("dead");
    matrixCellList[r*columns + c].classList.add("alive");
  } else {
    matrixCellList[r*columns + c].classList.remove("alive");
    matrixCellList[r*columns + c].classList.add("dead");
  }
}

function startGame() {
  cycle = setInterval(function() {updateMatrix();},100);
  gameRunning = true;
}

function stopGame() {
  clearInterval(cycle);
  gameRunning = false;
}
function startOrStopGame() {
  if(gameRunning) {
    stopGame();
    document.getElementById("pausePlayButton").innerHTML = "Play";
  } else {
    startGame();
    document.getElementById("pausePlayButton").innerHTML = "Pause";
  }
}

function setSize() {
  if(gameRunning) {stopGame();gameRunning = true;};
  rows = document.getElementById("cellCount").value;
  if(rows > 64) {
    window.alert("Selected size too large, setting size to 64x64");
    rows = 64;
    document.getElementById("cellCount").value = rows;
  }
  columns = rows;
  console.log(rows);
  setupMatrixArea();
  randomizeMatrix();
  if(gameRunning) {startGame();};
}


setupMatrixArea();
randomizeMatrix();
startGame();
