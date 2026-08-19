/* ── Wordle engine (port of Wordle.cpp) ───────────────────── */

function validateGuess(word, guess) {
  if (guess.length !== 5) return 'ERROR';
  var result = ['X', 'X', 'X', 'X', 'X'];
  var counts = {};
  for (var i = 0; i < word.length; i++) {
    counts[word[i]] = (counts[word[i]] || 0) + 1;
  }
  // Pass 1: greens
  for (var i = 0; i < 5; i++) {
    if (guess[i] < 'a' || guess[i] > 'z') return 'ERROR';
    if (guess[i] === word[i]) {
      result[i] = 'G';
      counts[guess[i]]--;
    }
  }
  // Pass 2: yellows
  for (var i = 0; i < 5; i++) {
    if (result[i] !== 'G' && (counts[guess[i]] || 0) > 0) {
      result[i] = 'Y';
      counts[guess[i]]--;
    }
  }
  return result.join('');
}

function WordleGame(wordList) {
  this.wordList = wordList;
  this.target = wordList[Math.floor(Math.random() * wordList.length)];
  this.maxGuesses = 6;
  this.guesses = [];      // [{word: 'apple', result: 'GGYXX'}, ...]
  this.currentInput = '';
  this.letterStates = {}; // {a: 'correct', b: 'present', c: 'absent'}
  this.gameOver = false;
  this.won = false;
}

WordleGame.prototype.addLetter = function (ch) {
  if (this.gameOver) return;
  if (this.currentInput.length < 5) {
    this.currentInput += ch.toLowerCase();
  }
};

WordleGame.prototype.removeLetter = function () {
  if (this.gameOver) return;
  this.currentInput = this.currentInput.slice(0, -1);
};

WordleGame.prototype.submitGuess = function () {
  if (this.gameOver) return { valid: false, message: 'Game is over.' };
  if (this.currentInput.length !== 5) return { valid: false, message: 'Not enough letters.' };

  var guess = this.currentInput;
  var result = validateGuess(this.target, guess);

  if (result === 'ERROR') return { valid: false, message: 'Invalid word.' };

  this.guesses.push({ word: guess, result: result });

  // Update letter states (green > yellow > gray)
  for (var i = 0; i < 5; i++) {
    var letter = guess[i];
    var state = result[i] === 'G' ? 'correct' : result[i] === 'Y' ? 'present' : 'absent';
    var current = this.letterStates[letter];
    if (state === 'correct' || !current) {
      this.letterStates[letter] = state;
    } else if (state === 'present' && current !== 'correct') {
      this.letterStates[letter] = state;
    }
  }

  this.currentInput = '';

  if (result === 'GGGGG') {
    this.gameOver = true;
    this.won = true;
    return { valid: true, message: 'You got it!' };
  }

  if (this.guesses.length >= this.maxGuesses) {
    this.gameOver = true;
    return { valid: true, message: 'The word was: ' + this.target };
  }

  return { valid: true, message: '' };
};


/* ── WordleUI ─────────────────────────────────────────────── */

window.WordleUI = {
  init: function () {
    var root = document.getElementById('wordle-root');
    var game = new WordleGame(window.GameData.wordList);
    var message = '';
    var scoreSubmitted = false;

    // Scoreboard tracking
    var recorded = false;
    if (window.ScoreboardAPI) {
      window.ScoreboardAPI.startSession("Wordle");
    }

    function render() {
      var html = '';

      // If game ended, record it once
      if (!recorded && window.ScoreboardAPI && game.gameOver) {
        recorded = true;
        if (game.won) {
          window.ScoreboardAPI.endSession("Completed", "Tries: " + game.guesses.length);
        } else {
          window.ScoreboardAPI.endSession("Attempted", "Tries: " + game.guesses.length);
        }
      }

      // Board
      html += '<div class="wordle-board">';
      for (var row = 0; row < game.maxGuesses; row++) {
        html += '<div class="wordle-row">';
        for (var col = 0; col < 5; col++) {
          var letter = '';
          var cls = 'wordle-cell';

          if (row < game.guesses.length) {
            // Submitted row
            letter = game.guesses[row].word[col];
            var r = game.guesses[row].result[col];
            if (r === 'G') cls += ' correct';
            else if (r === 'Y') cls += ' present';
            else cls += ' absent';
          } else if (row === game.guesses.length && !game.gameOver) {
            // Current input row
            if (col < game.currentInput.length) {
              letter = game.currentInput[col];
              cls += ' filled';
            }
            if (col === game.currentInput.length) {
              cls += ' active';
            }
          }

          html += '<div class="' + cls + '">' + esc(letter) + '</div>';
        }
        html += '</div>';
      }
      html += '</div>';

      // Message
      html += '<div class="wordle-message">' + esc(message) + '</div>';

      // Keyboard (only if game not over)
      if (!game.gameOver) {
        var rows = [
          ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
          ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
          ['enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'back']
        ];

        html += '<div class="wordle-keyboard">';
        for (var r = 0; r < rows.length; r++) {
          html += '<div class="wordle-key-row">';
          for (var k = 0; k < rows[r].length; k++) {
            var key = rows[r][k];
            var keyCls = 'wordle-key';
            if (key === 'enter' || key === 'back') keyCls += ' wide';
            if (game.letterStates[key]) keyCls += ' ' + game.letterStates[key];
            var label = key === 'back' ? '&#9003;' : esc(key);
            html += '<button class="' + keyCls + '" data-key="' + key + '">' + label + '</button>';
          }
          html += '</div>';
        }
        html += '</div>';
      } else {
        // Game over overlay
        html += '<div class="wordle-overlay">';
        html += '<h2>' + (game.won ? 'Nice!' : 'Better luck next time') + '</h2>';
        html += '<p>' + (game.won ? 'You guessed it in ' + game.guesses.length + ' tries.' : 'The word was: ' + game.target) + '</p>';
        html += '<button onclick="navigate(\'menu\')">Back to Menu</button>';
        html += '</div>';
      }

      root.innerHTML = html;

      // Bind keyboard button clicks
      var keys = root.querySelectorAll('.wordle-key');
      for (var i = 0; i < keys.length; i++) {
        keys[i].addEventListener('click', onKeyClick);
      }
    }

    function onKeyClick(e) {
      var key = e.currentTarget.getAttribute('data-key');
      handleKey(key);
    }

    function handleKey(key) {
      if (game.gameOver) return;

      if (key === 'enter') {
        var result = game.submitGuess();
        message = result.message;
      } else if (key === 'back' || key === 'backspace') {
        game.removeLetter();
        message = '';
      } else if (key.length === 1 && key >= 'a' && key <= 'z') {
        game.addLetter(key);
        message = '';
      }
      render();

      if (game.gameOver && !scoreSubmitted) {
        scoreSubmitted = true;
        fetch('/api/scores', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: GameData.currentUser,
            game: 'wordle',
            score: game.won ? game.guesses.length : 0
          })
        });
      }
    }

    function onKeyDown(e) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      var key = e.key.toLowerCase();
      if (key === 'enter') {
        e.preventDefault();
        handleKey('enter');
      } else if (key === 'backspace') {
        e.preventDefault();
        handleKey('back');
      } else if (key.length === 1 && key >= 'a' && key <= 'z') {
        e.preventDefault();
        handleKey(key);
      }
    }

    function esc(s) {
      var d = document.createElement('div');
      d.textContent = s;
      return d.innerHTML;
    }

    document.addEventListener('keydown', onKeyDown);
    render();

    // Return destroy function
    return function () {
      // If user leaves before game over, record attempt once
      if (!recorded && window.ScoreboardAPI) {
        recorded = true;
        window.ScoreboardAPI.endSession("Attempted", "Tries: " + game.guesses.length);
      }

      document.removeEventListener('keydown', onKeyDown);
      root.innerHTML = '';
    };
  }
};
