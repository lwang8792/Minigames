/* ── MemoryMatch engine (port of MemoryMatch.cpp) ───────────── */
(function () {
  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    return arr;
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  window.MemoryMatchUI = {
    init: function () {
      var root = document.getElementById('memorymatch-root');
      root.innerHTML = "";

      // Start scoreboard tracking
      if (window.ScoreboardAPI) {
        window.ScoreboardAPI.startSession("Memory Match");
        }

      var symbols = (window.GameData && window.GameData.memoryMatchSymbols)
        ? window.GameData.memoryMatchSymbols.slice()
        : ["A","B","C","D","E","F","G","H"];

      // Build deck: two of each symbol
      var deck = [];
      for (var i = 0; i < symbols.length; i++) {
        deck.push(symbols[i]);
        deck.push(symbols[i]);
      }
      shuffle(deck);

      var firstIndex = -1;
      var secondIndex = -1;
      var lock = false;
      var moves = 0;
      var matchedCount = 0;

      var header = el("div", "mm-header");
      var stats = el("div", "mm-stats");
      var movesEl = el("span", "mm-stat", "Moves: 0");
      var statusEl = el("span", "mm-status", "");
      stats.appendChild(movesEl);
      stats.appendChild(statusEl);

      var restartBtn = el("button", "mm-restart", "Restart");
      header.appendChild(stats);
      header.appendChild(restartBtn);

      var grid = el("div", "mm-grid");

      // Create card buttons
      var cardButtons = [];
      for (var c = 0; c < deck.length; c++) {
        (function (idx) {
          var btn = el("button", "mm-card");
          btn.setAttribute("type", "button");
          btn.setAttribute("aria-label", "Card");
          btn.textContent = "❓"; // hidden face
          grid.appendChild(btn);
          cardButtons.push(btn);

          btn.addEventListener("click", function () {
            if (lock) return;
            if (btn.classList.contains("matched")) return;
            if (idx === firstIndex) return;

            // reveal
            btn.classList.add("flipped");
            btn.textContent = deck[idx];

            if (firstIndex === -1) {
              firstIndex = idx;
              statusEl.textContent = "";
              return;
            }

            // second pick
            secondIndex = idx;
            moves++;
            movesEl.textContent = "Moves: " + moves;

            var firstBtn = cardButtons[firstIndex];
            var secondBtn = cardButtons[secondIndex];

            if (deck[firstIndex] === deck[secondIndex]) {
              // matched
              firstBtn.classList.add("matched");
              secondBtn.classList.add("matched");
              matchedCount += 2;

              firstIndex = -1;
              secondIndex = -1;

              if (matchedCount === deck.length) {
                statusEl.textContent = "You won! 🎉";

                if (window.ScoreboardAPI) {
                    window.ScoreboardAPI.endSession("Completed", "Moves: " + moves);
                }

                fetch('/api/scores', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    username: GameData.currentUser,
                    game: 'memorymatch',
                    score: moves
                  })
                });
              }
              return;
            }

            // flip back after short delay
            lock = true;
            statusEl.textContent = "Not a match";
            setTimeout(function () {
              firstBtn.classList.remove("flipped");
              secondBtn.classList.remove("flipped");
              firstBtn.textContent = "❓";
              secondBtn.textContent = "❓";

              firstIndex = -1;
              secondIndex = -1;
              lock = false;
              statusEl.textContent = "";
            }, 700);
          });
        })(c);
      }

      function restart() {
        window.MemoryMatchUI.init();
      }

      restartBtn.addEventListener("click", restart);

      root.appendChild(header);
      root.appendChild(grid);

      return function () {
        if (window.ScoreboardAPI) {
            window.ScoreboardAPI.endSession("Attempted", "Moves: " + moves);
        }

        root.innerHTML = "";
      };
    }
  };
})();