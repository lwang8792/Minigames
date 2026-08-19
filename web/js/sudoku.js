/* ── SudokuBoard engine (port of SudokuBoard.cpp) ─────────── */

function SudokuBoard(puzzleStr) {
  if (puzzleStr.length !== 81) throw new Error('Puzzle must be exactly 81 characters.');

  this.N = 9;
  this.cells = [];
  this.fixed = [];

  for (var r = 0; r < this.N; r++) {
    this.cells[r] = [];
    this.fixed[r] = [];
    for (var c = 0; c < this.N; c++) {
      var ch = puzzleStr[r * this.N + c];
      if (ch === '.' || ch === '0') {
        this.cells[r][c] = 0;
        this.fixed[r][c] = false;
      } else if (ch >= '1' && ch <= '9') {
        this.cells[r][c] = parseInt(ch);
        this.fixed[r][c] = true;
      } else {
        throw new Error('Puzzle contains invalid characters.');
      }
    }
  }
}

SudokuBoard.prototype.get = function (r, c) {
  return this.cells[r][c];
};

SudokuBoard.prototype.isFixed = function (r, c) {
  return this.fixed[r][c];
};

SudokuBoard.prototype.inRange = function (r, c) {
  return r >= 0 && r < this.N && c >= 0 && c < this.N;
};

SudokuBoard.prototype.validValue = function (v) {
  return v >= 0 && v <= 9;
};

SudokuBoard.prototype.rowOk = function (r, v, skipC) {
  for (var c = 0; c < this.N; c++) {
    if (c === skipC) continue;
    if (this.cells[r][c] === v) return false;
  }
  return true;
};

SudokuBoard.prototype.colOk = function (c, v, skipR) {
  for (var r = 0; r < this.N; r++) {
    if (r === skipR) continue;
    if (this.cells[r][c] === v) return false;
  }
  return true;
};

SudokuBoard.prototype.boxOk = function (r, c, v, skipR, skipC) {
  var br = Math.floor(r / 3) * 3;
  var bc = Math.floor(c / 3) * 3;
  for (var rr = br; rr < br + 3; rr++) {
    for (var cc = bc; cc < bc + 3; cc++) {
      if (rr === skipR && cc === skipC) continue;
      if (this.cells[rr][cc] === v) return false;
    }
  }
  return true;
};

SudokuBoard.prototype.isValidMove = function (r, c, v) {
  if (!this.inRange(r, c)) return false;
  if (!this.validValue(v)) return false;
  if (v === 0) return true;
  return this.rowOk(r, v, c) && this.colOk(c, v, r) && this.boxOk(r, c, v, r, c);
};

SudokuBoard.prototype.set = function (r, c, v) {
  if (!this.inRange(r, c)) return false;
  if (!this.validValue(v)) return false;
  if (this.fixed[r][c]) return false;
  // Allow placement regardless of validity (UI shows errors visually)
  this.cells[r][c] = v;
  return true;
};

SudokuBoard.prototype.isSolved = function () {
  for (var r = 0; r < this.N; r++) {
    for (var c = 0; c < this.N; c++) {
      var v = this.cells[r][c];
      if (v === 0) return false;
      if (!this.isValidMove(r, c, v)) return false;
    }
  }
  return true;
};


/* ── SudokuUI ─────────────────────────────────────────────── */

window.SudokuUI = {
  init: function () {
    var root = document.getElementById('sudoku-root');
    var board = new SudokuBoard(window.GameData.sudokuPuzzle);
    var selectedR = -1, selectedC = -1;
    var message = '';
    var solved = false;
    var moves = 0;

    // Scoreboard tracking
    var recorded = false;
    if (window.ScoreboardAPI) {
      window.ScoreboardAPI.startSession("Sudoku");
    }

    function render() {
      if (solved) {
        var html = '<div class="sudoku-board">';
        html += renderGrid();
        html += '</div>';
        html += '<div class="sudoku-overlay"><h2>Solved!</h2>';
        html += '<button onclick="navigate(\'menu\')">Back to Menu</button></div>';
        root.innerHTML = html;
        return;
      }

      var html = '<div class="sudoku-board">';
      html += renderGrid();
      html += '</div>';

      // Message
      html += '<div class="sudoku-message">' + esc(message) + '</div>';

      // Numpad
      html += '<div class="sudoku-numpad">';
      for (var n = 1; n <= 9; n++) {
        html += '<button data-num="' + n + '">' + n + '</button>';
      }
      html += '<button class="clear-btn" data-num="0">Clear</button>';
      html += '</div>';

      root.innerHTML = html;

      // Bind cell clicks
      var cells = root.querySelectorAll('.sudoku-cell');
      for (var i = 0; i < cells.length; i++) {
        cells[i].addEventListener('click', onCellClick);
      }

      // Bind numpad
      var nums = root.querySelectorAll('.sudoku-numpad button');
      for (var i = 0; i < nums.length; i++) {
        nums[i].addEventListener('click', onNumClick);
      }
    }

    function renderGrid() {
      var html = '<div class="sudoku-grid">';
      for (var r = 0; r < 9; r++) {
        for (var c = 0; c < 9; c++) {
          var v = board.get(r, c);
          var cls = 'sudoku-cell';
          var isFixed = board.isFixed(r, c);

          if (isFixed) cls += ' fixed';

          // Selected
          if (r === selectedR && c === selectedC) {
            cls += ' selected';
          } else if (selectedR >= 0 && (r === selectedR || c === selectedC ||
            (Math.floor(r / 3) === Math.floor(selectedR / 3) &&
             Math.floor(c / 3) === Math.floor(selectedC / 3)))) {
            cls += ' highlighted';
          }

          // User value
          if (!isFixed && v !== 0) {
            cls += ' user-value';
            // Check for conflict
            if (!board.isValidMove(r, c, v)) {
              cls += ' error';
            }
          }

          // Box borders
          if (c === 2 || c === 5) cls += ' border-right';
          if (r === 2 || r === 5) cls += ' border-bottom';

          var display = v === 0 ? '' : v;
          html += '<div class="' + cls + '" data-r="' + r + '" data-c="' + c + '">' + display + '</div>';
        }
      }
      html += '</div>';
      return html;
    }

    function onCellClick(e) {
      var r = parseInt(e.currentTarget.getAttribute('data-r'));
      var c = parseInt(e.currentTarget.getAttribute('data-c'));
      if (selectedR === r && selectedC === c) {
        selectedR = -1;
        selectedC = -1;
      } else {
        selectedR = r;
        selectedC = c;
      }
      message = '';
      render();
    }

    function onNumClick(e) {
      var num = parseInt(e.currentTarget.getAttribute('data-num'));
      placeNumber(num);
    }

    function placeNumber(num) {
      if (selectedR < 0 || selectedC < 0) {
        message = 'Select a cell first.';
        render();
        return;
      }
      if (board.isFixed(selectedR, selectedC)) {
        message = 'Cannot modify a fixed cell.';
        render();
        return;
      }

      // Count a move only if the cell value actually changes
      var before = board.get(selectedR, selectedC);
      var changed = board.set(selectedR, selectedC, num);

      if (changed) {
        var after = board.get(selectedR, selectedC);
        if (after !== before) {
          moves++;
        }
      }

      if (num !== 0 && !board.isValidMove(selectedR, selectedC, num)) {
        message = 'Conflict detected.';
      } else {
        message = '';
      }

      if (board.isSolved()) {
        solved = true;
        fetch('/api/scores', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: GameData.currentUser,
            game: 'sudoku',
            score: 1
          })
        });

        if (!recorded && window.ScoreboardAPI) {
          recorded = true;
          window.ScoreboardAPI.endSession("Completed", "Moves: " + moves);
        }
      }
      render();
    }

    function onKeyDown(e) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      var key = e.key;

      if (key >= '1' && key <= '9') {
        e.preventDefault();
        placeNumber(parseInt(key));
      } else if (key === 'Backspace' || key === 'Delete' || key === '0') {
        e.preventDefault();
        placeNumber(0);
      } else if (key === 'ArrowUp' && selectedR > 0) {
        e.preventDefault();
        selectedR--;
        render();
      } else if (key === 'ArrowDown' && selectedR < 8) {
        e.preventDefault();
        selectedR++;
        render();
      } else if (key === 'ArrowLeft' && selectedC > 0) {
        e.preventDefault();
        selectedC--;
        render();
      } else if (key === 'ArrowRight' && selectedC < 8) {
        e.preventDefault();
        selectedC++;
        render();
      } else if (key === 'Escape') {
        selectedR = -1;
        selectedC = -1;
        render();
      }
    }

    function esc(s) {
      var d = document.createElement('div');
      d.textContent = s;
      return d.innerHTML;
    }

    document.addEventListener('keydown', onKeyDown);
    render();

    return function () {
      // If user leaves before solving, mark attempted once
      if (!recorded && window.ScoreboardAPI) {
        recorded = true;
        window.ScoreboardAPI.endSession("Attempted", "Moves: " + moves);
      }
      
      document.removeEventListener('keydown', onKeyDown);
      root.innerHTML = '';
    };
  }
};
