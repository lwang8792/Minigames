/* ── ConnectionsGame engine (port of ConnectionsGame.cpp) ──── */

function ConnectionsGame(puzzle, mistakesLimit) {
  this.puzzle = puzzle;
  this.mistakesLimit = mistakesLimit;
  this.mistakesUsed = 0;

  this.groupSolved = [];
  for (var i = 0; i < puzzle.groups.length; i++) {
    this.groupSolved.push(false);
  }

  // Display order: array of tile IDs
  this.displayOrder = [];
  for (var i = 0; i < puzzle.tiles.length; i++) {
    this.displayOrder.push(puzzle.tiles[i].id);
  }

  this.selectedTileIds = {};  // set as object {id: true}

  this.shuffleDisplayOrder();
}

ConnectionsGame.prototype.tileById = function (id) {
  for (var i = 0; i < this.puzzle.tiles.length; i++) {
    if (this.puzzle.tiles[i].id === id) return this.puzzle.tiles[i];
  }
  return null;
};

ConnectionsGame.prototype.toggleSelect = function (displayIndex) {
  if (displayIndex < 1 || displayIndex > this.displayOrder.length) return;
  var tileId = this.displayOrder[displayIndex - 1];

  if (this.selectedTileIds[tileId]) {
    delete this.selectedTileIds[tileId];
  } else {
    if (this.selectionCount() < 4) {
      this.selectedTileIds[tileId] = true;
    }
  }
};

ConnectionsGame.prototype.clearSelection = function () {
  this.selectedTileIds = {};
};

ConnectionsGame.prototype.selectionCount = function () {
  return Object.keys(this.selectedTileIds).length;
};

ConnectionsGame.prototype.submitGuess = function () {
  if (this.selectionCount() !== 4) {
    return { outcome: 'invalid', message: 'You must select exactly 4 tiles.', solvedGroupName: null };
  }

  var selectedSet = this.selectedTileIds;

  // Check exact group match
  for (var i = 0; i < this.puzzle.groups.length; i++) {
    if (this.groupSolved[i]) continue;

    var group = this.puzzle.groups[i];
    var groupSet = {};
    for (var j = 0; j < group.tileIds.length; j++) {
      groupSet[group.tileIds[j]] = true;
    }

    if (this._setsEqual(selectedSet, groupSet)) {
      this.groupSolved[i] = true;
      for (var j = 0; j < group.tileIds.length; j++) {
        this.tileById(group.tileIds[j]).state = 'solved';
      }
      // Remove solved tiles from display order
      var newOrder = [];
      for (var k = 0; k < this.displayOrder.length; k++) {
        if (!groupSet[this.displayOrder[k]]) {
          newOrder.push(this.displayOrder[k]);
        }
      }
      this.displayOrder = newOrder;
      this.selectedTileIds = {};
      return { outcome: 'correct', message: 'Correct! Solved: ' + group.name, solvedGroupName: group.name };
    }
  }

  // Check one-away
  for (var i = 0; i < this.puzzle.groups.length; i++) {
    if (this.groupSolved[i]) continue;

    var group = this.puzzle.groups[i];
    var overlap = 0;
    for (var j = 0; j < group.tileIds.length; j++) {
      if (selectedSet[group.tileIds[j]]) overlap++;
    }
    if (overlap === 3) {
      this.mistakesUsed++;
      this.selectedTileIds = {};
      return { outcome: 'oneaway', message: 'One away!', solvedGroupName: null };
    }
  }

  // Fully incorrect
  this.mistakesUsed++;
  this.selectedTileIds = {};
  return { outcome: 'incorrect', message: 'Incorrect.', solvedGroupName: null };
};

ConnectionsGame.prototype.shuffleDisplayOrder = function () {
  // Fisher-Yates shuffle
  var arr = this.displayOrder;
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
};

ConnectionsGame.prototype.isWon = function () {
  for (var i = 0; i < this.groupSolved.length; i++) {
    if (!this.groupSolved[i]) return false;
  }
  return true;
};

ConnectionsGame.prototype.isLost = function () {
  return this.mistakesUsed >= this.mistakesLimit;
};

ConnectionsGame.prototype.view = function () {
  var vm = {
    solvedGroups: [],
    tiles: [],
    mistakesUsed: this.mistakesUsed,
    mistakesLimit: this.mistakesLimit,
    groupsSolved: 0,
    selectionCount: this.selectionCount()
  };

  // Solved groups (in original order)
  for (var i = 0; i < this.puzzle.groups.length; i++) {
    if (this.groupSolved[i]) {
      var g = this.puzzle.groups[i];
      var texts = [];
      for (var j = 0; j < g.tileIds.length; j++) {
        texts.push(this.tileById(g.tileIds[j]).text);
      }
      vm.solvedGroups.push({ name: g.name, tileTexts: texts, colorIndex: i });
      vm.groupsSolved++;
    }
  }

  // Unsolved tiles
  for (var i = 0; i < this.displayOrder.length; i++) {
    var tileId = this.displayOrder[i];
    var tile = this.tileById(tileId);
    vm.tiles.push({
      displayIndex: i + 1,
      text: tile.text,
      selected: !!this.selectedTileIds[tileId],
      solved: false
    });
  }

  return vm;
};

ConnectionsGame.prototype._setsEqual = function (a, b) {
  var keysA = Object.keys(a);
  var keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (var i = 0; i < keysA.length; i++) {
    if (!b[keysA[i]]) return false;
  }
  return true;
};


/* ── ConnectionsUI ────────────────────────────────────────── */

window.ConnectionsUI = {
  init: function () {
    var root = document.getElementById('connections-root');
    var puzzle = window.GameData.makeConnectionsPuzzle();
    var game = new ConnectionsGame(puzzle, 4);
    var message = '';

    // Start scoreboard tracking
      var recorded = false;
      if (window.ScoreboardAPI) {
        window.ScoreboardAPI.startSession("Connections");
      }

    function render() {
      var vm = game.view();
      var html = '<div class="conn-board">';

      // If game ended, record it once
      if (!recorded && window.ScoreboardAPI) {
        if (game.isWon()) {
          recorded = true;
          window.ScoreboardAPI.endSession("Completed", "Mistakes used: " + game.mistakesUsed);
        } else if (game.isLost()) {
          recorded = true;
          window.ScoreboardAPI.endSession("Attempted", "Mistakes used: " + game.mistakesUsed);
        }
      }

      // Solved groups
      for (var i = 0; i < vm.solvedGroups.length; i++) {
        var sg = vm.solvedGroups[i];
        html += '<div class="conn-solved-group color-' + sg.colorIndex + '">';
        html += '<div class="group-name">' + esc(sg.name) + '</div>';
        html += '<div class="group-tiles">' + sg.tileTexts.map(esc).join(', ') + '</div>';
        html += '</div>';
      }

      // Tile grid (only if game not over)
      if (!game.isWon() && !game.isLost()) {
        html += '<div class="conn-tile-grid">';
        for (var i = 0; i < vm.tiles.length; i++) {
          var t = vm.tiles[i];
          html += '<button class="conn-tile' + (t.selected ? ' selected' : '') + '" data-idx="' + t.displayIndex + '">';
          html += esc(t.text);
          html += '</button>';
        }
        html += '</div>';

        // Message
        html += '<div class="conn-message">' + esc(message) + '</div>';

        // Mistakes
        html += '<div class="conn-mistakes"><span>Mistakes remaining: </span>';
        for (var i = 0; i < vm.mistakesLimit; i++) {
          html += '<span class="dot' + (i < vm.mistakesUsed ? ' used' : '') + '"></span>';
        }
        html += '</div>';

        // Controls
        html += '<div class="conn-controls">';
        html += '<button class="shuffle-btn">Shuffle</button>';
        html += '<button class="deselect-btn"' + (vm.selectionCount === 0 ? ' disabled' : '') + '>Deselect All</button>';
        html += '<button class="submit-btn"' + (vm.selectionCount !== 4 ? ' disabled' : '') + '>Submit</button>';
        html += '</div>';
      }

      html += '</div>';

      // Win/loss overlay
      if (game.isWon()) {
        html += '<div class="conn-overlay"><h2>You got it!</h2>';
        html += '<p>You solved all 4 groups.</p>';
        html += '<button onclick="navigate(\'menu\')">Back to Menu</button></div>';
      } else if (game.isLost()) {
        html += '<div class="conn-overlay"><h2>Game Over</h2>';
        html += '<p>You ran out of guesses.</p>';
        html += '<button onclick="navigate(\'menu\')">Back to Menu</button></div>';
      }

      root.innerHTML = html;

      // Bind events
      var tiles = root.querySelectorAll('.conn-tile');
      for (var i = 0; i < tiles.length; i++) {
        tiles[i].addEventListener('click', onTileClick);
      }
      var shuffleBtn = root.querySelector('.shuffle-btn');
      if (shuffleBtn) shuffleBtn.addEventListener('click', onShuffle);
      var deselectBtn = root.querySelector('.deselect-btn');
      if (deselectBtn) deselectBtn.addEventListener('click', onDeselect);
      var submitBtn = root.querySelector('.submit-btn');
      if (submitBtn) submitBtn.addEventListener('click', onSubmit);
    }

    function onTileClick(e) {
      var idx = parseInt(e.currentTarget.getAttribute('data-idx'));
      game.toggleSelect(idx);
      message = '';
      render();
    }

    function onShuffle() {
      game.shuffleDisplayOrder();
      message = '';
      render();
    }

    function onDeselect() {
      game.clearSelection();
      message = '';
      render();
    }

    function onSubmit() {
      var result = game.submitGuess();
      message = result.message;
      render();

      if (game.isWon() || game.isLost()) {
        fetch('/api/scores', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: GameData.currentUser,
            game: 'connections',
            score: game.view().groupsSolved
          })
        });
      }
    }

    function esc(s) {
      var d = document.createElement('div');
      d.textContent = s;
      return d.innerHTML;
    }

    render();

    // Return destroy function
    return function () {
      // If user leave before win, record as attempted once
      if (!recorded && window.ScoreboardAPI) {
        recorded = true;
        window.ScoreboardAPI.endSession("Attempted", "Mistakes used: " + game.mistakesUsed);
      }

      root.innerHTML = '';
    };
  }
};
