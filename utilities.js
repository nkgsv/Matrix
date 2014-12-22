// refresh the UI
function refreshUI() {
  var A = theMatrix.array();
  for (var i = 1; i <= theMatrix.rows(); i++) {
    for (var j = 1; j <= theMatrix.cols(); j++) {
      var element = theMatrix.getElement(i, j);
      var str = (element[1] == 1) ? element[0] : element[0] + '/' + element[1];
      $('#' + i + '-' + j).text(str);
    }
  }
}

// update matrix elements from UI
function updateMatrixFromDivs() {
  var A = theMatrix.array();
  for (var i = 1; i <= theMatrix.rows(); i++) {
    for (var j = 1; j <= theMatrix.cols(); j++) {
      var val = $('#' + i + '-' + j).text();
      val = toFrac(val);
      theMatrix.setElement(i, j, val);
    }
  }
}

function updateMatrixFromTextarea() {
  var string = $('#matrix-string').val();
  theMatrix.loadString(string);
  console.log("Matrix reloaded from textarea.");
}

function reload() {
  updateMatrixFromTextarea();
  renderUI();
}

function save() {
  $('#matrix-string').val(theMatrix.toString());
}

function edit() {
  $('.element').attr('contenteditable', true);
  $('#edit').toggle();
  $('.edit-buttons').toggle();
  $('#lock').toggle();
}

function lock() {
  $('.element').attr('contenteditable', false);
  $('#edit').toggle();
  $('.edit-buttons').toggle();
  $('#lock').toggle();
  updateMatrixFromDivs();
}

function transpose() {
  theMatrixPrev.copy(theMatrix);
  theMatrix.transpose();
  renderUI();
  refreshUI();
}

function refreshColors() {
  $('.from').removeClass('red green blue orange');
  $('.to').removeClass('red green blue orange');
  $('.from').addClass(FromStyle[mode]);
  $('.to').addClass(ToStyle[mode]);
}

function getMode(ev) {
  if (ev.metaKey || ev.ctrlKey) {
    return DragMode.move;
  } else if (ev.altKey) {
    return DragMode.subtract;
  } else if (ev.shiftKey) {
    return DragMode.annihilate;
  }
  return DragMode.add;
}

function changeRowAlpha(ev) {
  var div = $(ev.currentTarget);
  var i = parseInt(div.data('i'));
  var btn = $('.mult-row').filter(function() {
    return $(this).data('i') == i;
  });
  var alphaStr = div.text();
  if (alphaStr.length == 0) {
    btn.hide();
  } else {
    btn.show();
  }
}

function keyPress(e) {
  var evtobj = window.event ? event : e;
  var cmd = evtobj.metaKey || evtobj.ctrlKey;
  if (e.keyCode == 13) {
    e.preventDefault();
    // Only Enter was pressed
    var alphaDiv = $(document.activeElement);
    if (alphaDiv.hasClass('row-alpha')) {
      // Multiply row
      var i = parseInt(alphaDiv.data('i'));
      var alpha = alphaDiv.text();
      if (alpha.length > 0) {
        alphaDiv.text('');
        theMatrixPrev.copy(theMatrix);
        theMatrix.mulRow(i, toFrac(alpha));
        alphaDiv.blur();
        refreshUI();
      }
    } else if (alphaDiv.hasClass('col-alpha')) {
      // Multiply column
      var j = parseInt(alphaDiv.data('j'));
      var alpha = alphaDiv.text();
      if (alpha.length > 0) {
        alphaDiv.text('');
        theMatrixPrev.copy(theMatrix);
        theMatrix.mulCol(j, toFrac(alpha));
        alphaDiv.blur();
        refreshUI();
      }
    }
  } else if (evtobj.keyCode == 90 && cmd) {
    var tmp = theMatrix;
    theMatrix = theMatrixPrev;
    theMatrixPrev = tmp;
    renderUI();
  }
}

function keyUp(e) {
  var srcJ = 0;
  var srcI = 0;
  var x = [];
  $('.col-alpha').each(function(index) {
    var alphaDiv = $(this);
    if (alphaDiv.text() == '=') {
      srcJ = parseInt(alphaDiv.data('j'));
    }
  });
  $('.row-alpha').each(function(index) {
    var alphaDiv = $(this);
    if (alphaDiv.text() == '=') {
      srcI = parseInt(alphaDiv.data('i'));
    }
  });
  if (srcJ > 0) {
    // Linear combination of columns
    for (var j = 1; j <= theMatrix.cols(); j++) {
      x.push([0, 0]);
    }
    $('.col-alpha').each(function(index) {
      var alphaDiv = $(this);
      var j = parseInt(alphaDiv.data('j'));
      x[j - 1] = (x[j - 1][0] == 0) ? toFrac(alphaDiv.text()) : x[j - 1];
    });
    theMatrixPrev.copy(theMatrix);
    theMatrix.multiplyRight(srcJ, x);
    refreshUI();
  } else if (srcI > 0) {
    // Linear combination of rows
    for (var i = 1; i <= theMatrix.rows(); i++) {
      x.push([0, 0]);
    }
    $('.row-alpha').each(function(index) {
      var alphaDiv = $(this);
      var i = parseInt(alphaDiv.data('i'));
      x[i - 1] = (x[i - 1][0] == 0) ? toFrac(alphaDiv.text()) : x[i - 1];
    });
    theMatrixPrev.copy(theMatrix);
    theMatrix.multiplyLeft(srcI, x);
    refreshUI();
  }
}

function appendRow() {
  theMatrixPrev.copy(theMatrix);
  theMatrix.appendRow();
  renderUI();
}

function deleteRow() {
  theMatrixPrev.copy(theMatrix);
  theMatrix.deleteRow();
  renderUI();
}

function appendCol() {
  theMatrixPrev.copy(theMatrix);
  theMatrix.appendCol();
  renderUI();
}

function deleteCol() {
  theMatrixPrev.copy(theMatrix);
  theMatrix.deleteCol();
  renderUI();
}

function appendIdentityRight() {
  theMatrixPrev.copy(theMatrix);
  theMatrix.appendIdentityRight();
  renderUI();
}

function appendIdentityBottom() {
  theMatrixPrev.copy(theMatrix);
  theMatrix.appendIdentityBottom();
  renderUI();
}

function appendIdentityBoth() {
  theMatrixPrev.copy(theMatrix);
  theMatrix.appendIdentityBoth();
  renderUI();
}