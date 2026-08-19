/* Manages scoreboard displayed on website */

(function () {
  var GAME_INFO = {
    connections: { icon: '\u{1F517}', label: 'Connections' },
    wordle:      { icon: '\u{1F520}', label: 'Wordle' },
    sudoku:      { icon: '\u{1F522}', label: 'Sudoku' },
    memorymatch: { icon: '\u{1F0CF}', label: 'Memory Match' }
  };

  function gameIcon(name) {
    var info = GAME_INFO[name] || {};
    return info.icon || '\u{1F3AE}';
  }

  function gameLabel(name) {
    var info = GAME_INFO[name] || {};
    return info.label || name;
  }

  function scoreLabel(game, score) {
    var n = Number(score);
    if (game === 'connections') {
      return n + '/4 groups';
    } else if (game === 'wordle') {
      if (n <= 0) return 'Not solved';
      return 'Solved in ' + n + '/6';
    } else if (game === 'sudoku') {
      return n === 1 ? 'Completed' : 'Attempted';
    } else if (game === 'memorymatch') {
      return 'Won in ' + n + ' moves';
    }
    return String(score);
  }

  function timeAgo(dateStr) {
    try {
      var then = new Date(dateStr + 'Z'); // server stores UTC without Z
      var now = new Date();
      var diff = Math.floor((now - then) / 1000);
      if (diff < 0) diff = 0;
      if (diff < 60) return 'just now';
      if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
      if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
      if (diff < 604800) return Math.floor(diff / 86400) + 'd ago';
      return then.toLocaleDateString();
    } catch (e) {
      return dateStr;
    }
  }

  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  // Public API — keep for game session tracking
  var activeSession = null;

  window.ScoreboardAPI = {
    startSession: function (gameName) {
      if (activeSession && !activeSession.ended) {
        window.ScoreboardAPI.endSession();
      }
      activeSession = {
        game: gameName,
        startedAt: Date.now(),
        ended: false
      };
    },

    endSession: function () {
      if (!activeSession || activeSession.ended) return;
      activeSession.ended = true;
    }
  };

  // UI
  async function render(root) {
    var currentUser = window.GameData.currentUser;
    var activeTab = root._sbTab || 'mine';

    var html = '';

    // Tabs
    html += '<div class="friends-tabs">';
    html += '<button class="friends-tab' + (activeTab === 'mine' ? ' active' : '') + '" data-tab="mine">My Scores</button>';
    html += '<button class="friends-tab' + (activeTab === 'friends' ? ' active' : '') + '" data-tab="friends">Friends</button>';
    html += '</div>';

    if (activeTab === 'mine') {
      try {
        var res = await fetch('/api/scores/user/' + encodeURIComponent(currentUser));
        var scores = await res.json();
        if (scores.length === 0) {
          html += '<div class="sb-empty-state">No scores yet. Play a game and your results will show up here!</div>';
        } else {
          html += '<div class="sb-cards">';
          for (var i = 0; i < scores.length; i++) {
            var s = scores[i];
            html += '<div class="sb-card">';
            html += '<div class="sb-card-left">';
            html += '<span class="sb-card-icon">' + gameIcon(s.game) + '</span>';
            html += '<div class="sb-card-info">';
            html += '<span class="sb-card-game">' + esc(gameLabel(s.game)) + '</span>';
            html += '<span class="sb-card-score">' + esc(scoreLabel(s.game, s.score)) + '</span>';
            html += '</div>';
            html += '</div>';
            html += '<span class="sb-card-time">' + esc(timeAgo(s.played_at)) + '</span>';
            html += '</div>';
          }
          html += '</div>';
        }
      } catch (e) {
        html += '<div class="sb-empty-state">Could not load scores.</div>';
      }
    } else if (activeTab === 'friends') {
      try {
        var res = await fetch('/api/scores/friends/' + encodeURIComponent(currentUser));
        var scores = await res.json();
        if (scores.length === 0) {
          html += '<div class="sb-empty-state">No friend activity yet. Add friends and play some games!</div>';
        } else {
          html += '<div class="sb-cards">';
          for (var i = 0; i < scores.length; i++) {
            var s = scores[i];
            html += '<div class="sb-card">';
            html += '<div class="sb-card-left">';
            html += '<span class="sb-card-icon">' + gameIcon(s.game) + '</span>';
            html += '<div class="sb-card-info">';
            html += '<span class="sb-card-game">' + esc(gameLabel(s.game)) + '</span>';
            html += '<span class="sb-card-score">';
            html += '<span class="sb-card-user">' + esc(s.username) + '</span> — ';
            html += esc(scoreLabel(s.game, s.score));
            html += '</span>';
            html += '</div>';
            html += '</div>';
            html += '<span class="sb-card-time">' + esc(timeAgo(s.played_at)) + '</span>';
            html += '</div>';
          }
          html += '</div>';
        }
      } catch (e) {
        html += '<div class="sb-empty-state">Could not load friend scores.</div>';
      }
    }

    root.innerHTML = html;

    // Bind tabs
    var tabs = root.querySelectorAll('.friends-tab');
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].addEventListener('click', function (e) {
        root._sbTab = e.currentTarget.getAttribute('data-tab');
        render(root);
      });
    }
  }

  window.ScoreboardUI = {
    init: function () {
      var root = document.getElementById('scoreboard-root');
      root._sbTab = 'mine';
      render(root);
      return function () { root.innerHTML = ''; };
    }
  };
})();
