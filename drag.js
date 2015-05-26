function dragStart(ev) {
  var from = ev.target.getAttribute('id');
  var ij = from.split('-');
  from_i = parseInt(ij[0]);
  from_j = parseInt(ij[1]);
  if (ev.shiftKey) {
    sigma = -1;
  } else {
    sigma = 1;
  }
  ev.originalEvent.dataTransfer.setData('text/plain', ''); // FF ignores DragStart events that don't do this
  return true;
}

function dragEnter(ev) {
  var from = ev.target.nodeName === 'DIV' ? ev.target.getAttribute('id') : ev.target.parentNode.getAttribute('id');
  var ij = from.split('-');
  to_i = parseInt(ij[0]);
  to_j = parseInt(ij[1]);
  mode = getMode(ev);
  if (from_j == to_j && from_i == to_i) {
    // Do nothing
  } else if (from_j == to_j) {
    // Hilight rows
    $('.col-' + from_j).removeClass('from red green blue orange');
    $('.col-' + to_j).removeClass('to red green blue orange');
    $('.row-' + from_i).addClass('from');
    $('.row-' + to_i).addClass('to');
  } else if (from_i == to_i) {
    // Hilight columns
    $('.row-' + from_i).removeClass('from red green blue orange');
    $('.col-' + to_i).removeClass('from red green blue orange');
    $('.col-' + from_j).addClass('from');
    $('.col-' + to_j).addClass('to');
  } else {
    $('.col-' + from_j).removeClass('from red green blue orange');
    $('.row-' + from_i).removeClass('from red green blue orange');
    $('.row-' + to_i).removeClass('to red green blue orange');
    $('.row-' + to_j).removeClass('to red green blue orange');
  }
  refreshColors();
  return false;
}

function dragOver(ev) {
  var newMode = getMode(ev);
  if (newMode != mode) {
    mode = newMode;
    refreshColors();
  }
  return false;
}

function dragLeave(ev) {
  if(ev.target.nodeName === '#text') {
    return; // Prevent FF from firing this event when leaving text nodes inside divs
  }
  if(ev.relatedTarget && ev.relatedTarget.nodeName === '#text' && ev.relatedTarget.parentNode === ev.target) {
    return; // Prevent FF from firing this event when 'leaving' a div for the text node inside it
  }
  var from = ev.target.getAttribute('id');
  var ij = from.split('-');
  to_i = parseInt(ij[0]);
  to_j = parseInt(ij[1]);
  if (from_j == to_j && from_i == to_i) {
    // Do nothing
  } else if (from_j == to_j) {
    // Hilight rows
    $('.row-' + to_i).removeClass('to red green blue orange');
    // $('.row-' + to_i).removeClass('to red green blue orange');
  } else if (from_i == to_i) {
    // Hilight columns
    $('.col-' + to_j).removeClass('to red green blue orange');
  }
  return false;
}

function dragDrop(ev) {
  var from = ev.originalEvent.dataTransfer.getData('from');
  var to = ev.target.getAttribute('id');
  var i1j1 = to.split('-');
  var to_i = parseInt(i1j1[0]);
  var to_j = parseInt(i1j1[1]);

  var row = true;
  var alpha = 1;
  // var sign = (ev.shiftKey) ? -1 : 1;
  if (from_j == to_j && from_i == to_i) {
    // Do nothing
  } else {
    theMatrixPrev.copy(theMatrix);
    var row = (from_j == to_j);
    var col = (from_i == to_i);
    if (mode == DragMode.subtract) {
      alpha = -1;
    } else if (mode == DragMode.annihilate) {
      // Fit alpha to make target element zero
      var f = theMatrix.getElement(from_i, from_j);
      var t = theMatrix.getElement(to_i, to_j);
      if (f[0] == 0) {
        alert('Cannot divide by zero!');
        return false;
      } else {
        alpha = mul(mul(t, inv(f)), -1);
      }
    }
    if (mode == DragMode.move) {
      // Move row or column
      if (row) {
        theMatrix.moveRow(from_i, to_i);
      } else if (col) {
        theMatrix.moveCol(from_j, to_j);
      } else {
        alert('Drag to an element of the same row or column.')
      }
    } else {
      if (row) {
        theMatrix.addRow(from_i, to_i, alpha);
      } else if (col) {
        theMatrix.addColumn(from_j, to_j, alpha);
      } else {
        alert('Drag to an element of the same row or column.')
      }
    }
    refreshUI();
  }
  return false;
}

function dragEnd(ev) {
  $('.element').removeClass('from to red green blue orange');
  sigma = 1;
  mode = DragMode.add;
  return true;
}