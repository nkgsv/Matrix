// Globals
var theMatrix = new Matrix();
var theMatrixPrev = new Matrix();
var from_i = 0;
var from_j = 0;
var sigma = 1;

var DragMode = {
  add: 0,
  subtract: 1,
  move: 2,
  annihilate: 3
}

var FromStyle = ['green', 'red', 'orange', 'blue'];
var ToStyle = ['green', 'green', 'green', 'red'];
var mode = DragMode.add; // 'add', 'subtract', 'move', 'annihilate'