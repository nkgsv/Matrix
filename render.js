// recreate all the divs for the matrix
function renderUI() {
  var A = theMatrix.array();
  root = $('#matrix-root');
  root.empty();

  // Add alphas above
  var row = $('<tr></tr>');
  root.append(row);
  var div = $('<td><div class="cell"></div></td>');
  row.append(div);
  for (var j = 1; j <= theMatrix.cols(); j++) {
    div = $('<div data-j="' + j + '" class="col-alpha cell"></div>');
    row.append($('<td></td>').append(div));
  }
  div = $('<td><div class="cell"></div></td>');
  row.append(div);

  // Create matrix and alphas inside
  for (var i = 1; i <= theMatrix.rows(); i++) {
    row = $('<tr></tr>')
    root.append(row);
    div = $('<div data-i="' + i + '"class="row-alpha cell"></div>');
    row.append($('<td></td>').append(div));
    for (var j = 1; j <= theMatrix.cols(); j++) {
      var element = $('<div id="' + i + '-' + j + '" class="cell element"></div>')
      element.addClass("row-" + i);
      element.addClass("col-" + j);
      // var element = A[i - 1][j - 1];
      // var str = (element[1] == 1) ? element[0] : element[0] + '/' + element[1];
      // element.text(str);
      row.append($('<td></td>').append(element));
    }
    div = $('<div data-i="' + i + '" class="row-alpha cell"></div>');
    row.append($('<td></td>').append(div));
  }

  // Add alphas below
  row = $('<tr></tr>');
  root.append(row);
  div = $('<td><div class="cell"></div></td>');
  row.append(div);
  for (var j = 1; j <= theMatrix.cols(); j++) {
    div = $('<div data-j="' + j + '" class="col-alpha cell"></div>');
    row.append($('<td></td>').append(div));
  }
  div = $('<td><div class="cell"></div></td>');
  row.append(div);

  refreshUI();
  $(".element").attr('draggable', true);
  var elements = document.querySelectorAll('.element');
  [].forEach.call(elements, function(element) {
    element.addEventListener('dragenter', dragEnter, false)
    element.addEventListener('dragleave', dragLeave, false);
  });
  $(".element").on('dragstart', dragStart);
  $(".element").on('dragend', dragEnd);
  // $(".element").on('ondragenter', dragEnter, false);
  // $(".element").on('ondragleave', dragLeave, false);
  $(".element").on('dragover', dragOver);
  $(".element").on('drop', dragDrop);

  $('.row-alpha').attr('contenteditable', true);
  $('.col-alpha').attr('contenteditable', true);
  $(".row-alpha").on('input', changeRowAlpha);
  // $(".mult-row").click(multiplyRow);
};