function egcd(a, b) {
  if (a < 0) a = -a;
  if (b < 0) b = -b;
  if (a == 0)
    return b;

  while (b != 0) {
    if (a > b)
      a = a - b;
    else
      b = b - a;
  }

  return a;
}

function normalize(frac) {
  if (frac[1] < 0) {
    frac[0] = -frac[0];
    frac[1] = -frac[1];
  }
  var div = egcd(frac[0], frac[1]);
  if (div > 1) {
    frac[0] = frac[0] / div;
    frac[1] = frac[1] / div;
  }
}

function add(frac1, frac2) {
  var numerator = frac1[0] * frac2[1] + frac2[0] * frac1[1];
  var denominator = frac1[1] * frac2[1];
  var frac = [numerator, denominator];
  normalize(frac);
  return frac;
}

// frac2 can be a number
function mul(frac1, frac2) {
  var frac = [frac1[0], frac1[1]];
  if (frac2.length === undefined) {
    frac[0] = frac[0] * frac2;
  } else {
    frac[0] = frac[0] * frac2[0];
    frac[1] = frac[1] * frac2[1];
  }
  normalize(frac);
  return frac;
}

function inv(frac) {
  if (frac[0] == 0) {
    throw 'Division by zero';
  }
  var frac = [frac[1], frac[0]];
  normalize(frac);
  return frac;
}

function toFrac(a) {
  if (typeof(a) === 'string') {
    if (a.length == 0) {
      return [0, 1];
    }
    var wrk = a.split('/');
    if (wrk.length == 1) {
      wrk = [wrk, '1'];
    }
    var numerator = (wrk[0].length > 0) ? parseInt(wrk[0]) : 1;
    if (isNaN(numerator)) {
      numerator = 0;
    }
    if (wrk[1].length == 0) {
      wrk[1] = '1';
    }
    var denominator = parseInt(wrk[1]);
    if (isNaN(denominator)) {
      denominator = 1;
    }
    var frac = [numerator, denominator];
    normalize(frac);
    return frac;
  } else if (typeof(a) == 'number') {
    return [a, 1];
  } else if (a instanceof Array) {
    if (a.length != 2) {
      throw 'Wrong dimension';
    }
    return [a[0], a[1]];
  } else {
    throw 'Unknown type of argument';
  }
}

function frac2str(frac) {
  if (frac[1] == 1) {
    return frac[0].toString();
  } else {
    return frac[0] + '/' + frac[1];
  }
}

function Matrix() {
  var A = [
    []
  ];

  this.loadArray = function(B) {
    var m = B.length;
    var n = B[0].length;
    A = [];
    for (var i = 1; i <= m; i++) {
      var row = [];
      for (var j = 1; j <= n; j++) {
        row.push(toFrac(B[i - 1][j - 1]));
      }
      A.push(row);
    }
  };
  this.loadString = function(string) {
    // TODO: validate string
    var re1 = new RegExp("([+-]*\\d+)\\s*\\/\\s*([+-]*\\d+)", "g");
    var str1 = string.replace(re1, '"$1/$2"');
    var B = JSON.parse(str1);
    this.loadArray(B);
  };
  this.addRow = function(from, to, alpha) {
    for (var k = 1; k <= this.cols(); k++) {
      // A[to - 1][k - 1] = A[to - 1][k - 1] + alpha * A[from - 1][k - 1]
      A[to - 1][k - 1] = add(A[to - 1][k - 1], mul(A[from - 1][k - 1], alpha));
    }
  };
  this.mulRow = function(i, alpha) {
    for (var k = 1; k <= this.cols(); k++) {
      A[i - 1][k - 1] = mul(A[i - 1][k - 1], alpha);
    }
  };
  this.moveRow = function(from, to) {
    if (from == to) {
      return;
    }
    var tmp = A[from - 1];
    A.splice(from - 1, 1);
    A.splice(to - 1, 0, tmp);
  };
  this.addColumn = function(from, to, alpha) {
    for (var k = 1; k <= this.rows(); k++) {
      // A[k - 1][to - 1] = A[k - 1][to - 1] + alpha * A[k - 1][from - 1]
      A[k - 1][to - 1] = add(A[k - 1][to - 1], mul(A[k - 1][from - 1], alpha));
    }
  };
  this.mulCol = function(j, alpha) {
    for (var k = 1; k <= this.rows(); k++) {
      A[k - 1][j - 1] = mul(A[k - 1][j - 1], alpha);
    }
  };
  this.moveCol = function(from, to) {
    if (from == to) {
      return;
    }
    for (var k = 1; k <= this.rows(); k++) {
      var tmp = A[k - 1][from - 1];
      A[k - 1].splice(from - 1, 1);
      A[k - 1].splice(to - 1, 0, tmp);
    }
  };
  this.transpose = function() {
    var B = A;
    var m = this.rows();
    var n = this.cols();
    A = [];
    for (var j = 1; j <= n; j++) {
      var row = [];
      for (var i = 1; i <= m; i++) {
        row.push(B[i - 1][j - 1]);
      }
      A.push(row);
    }
  }
  this.cols = function() {
    return A[0].length;
  };
  this.rows = function() {
    return A.length;
  };
  this.array = function() {
    return A;
  };
  this.getElement = function(i, j) {
    return A[i - 1][j - 1];
  };
  this.setElement = function(i, j, val) {
    A[i - 1][j - 1] = val;
  };
  this.toString = function() {
    var B = [];
    for (var i = 1; i <= this.rows(); i++) {
      var row = [];
      for (var j = 1; j <= this.cols(); j++) {
        row.push(frac2str(A[i - 1][j - 1]));
      }
      B.push(row);
    }
    return JSON.stringify(B).replace(/\"/g, '');
  };
  this.copy = function(B) {
    this.loadArray(B.array());
  };
  this.appendRow = function() {
    var n = this.cols();
    var row = [];
    for (var j = 1; j <= n; j++) {
      row.push(toFrac(0));
    }
    A.push(row);
  };
  this.deleteRow = function() {
    var m = this.rows();
    if (m == 1) return;
    A.splice(m - 1, 1);
  };
  this.appendCol = function() {
    var n = this.cols();
    var m = this.rows();
    for (var i = 1; i <= m; i++) {
      A[i - 1].push(toFrac(0));
    }
  };
  this.deleteCol = function() {
    var m = this.rows();
    var n = this.cols();
    if (n == 1) return;
    for (var i = 1; i <= m; i++) {
      A[i - 1].splice(n - 1, 1);
    }
  };
  this.appendIdentityRight = function() {
    var m = this.rows();
    var n = this.cols();
    for (var i = 1; i <= m; i++) {
      var row = [];
      for (var j = 1; j <= m; j++) {
        A[i - 1].push(toFrac((i == j) ? 1 : 0));
      }
    }
  };
  this.appendIdentityBottom = function() {
    var m = this.rows();
    var n = this.cols();
    for (var i = 1; i <= n; i++) {
      var row = [];
      for (var j = 1; j <= n; j++) {
        row.push(toFrac((i == j) ? 1 : 0));
      }
      A.push(row);
    }
  };
  this.appendIdentityBoth = function() {
    var m = this.rows();
    var n = this.cols();
    for (var i = 1; i <= m; i++) {
      var row = [];
      for (var j = 1; j <= m; j++) {
        A[i - 1].push(toFrac((i == j) ? 1 : 0));
      }
    }
    for (var i = 1; i <= n; i++) {
      var row = [];
      for (var j = 1; j <= n + m; j++) {
        row.push(toFrac((i == j) ? 1 : 0));
      }
      A.push(row);
    }
  };
  this.multiplyRight = function(src, x) {
    for (var i = 1; i <= this.rows(); i++) {
      var tmp = toFrac(0);
      for (var j = 1; j <= this.cols(); j++) {
        var wrk = mul(A[i - 1][j - 1], x[j - 1]);
        tmp = add(tmp, wrk);
      }
      A[i - 1][src - 1] = tmp;
    }
  };
  this.multiplyLeft = function(src, x) {
    var row = [];
    for (var j = 1; j <= this.cols(); j++) {
      var tmp = toFrac(0);
      for (var i = 1; i <= this.rows(); i++) {
        var wrk = mul(A[i - 1][j - 1], x[i - 1]);
        tmp = add(tmp, wrk);
      }
      row.push(tmp)
    }
    A[src - 1] = row;
  };
}