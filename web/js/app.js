/*Main js controller for web interface
Handles page initialization and navigation between game screens*/

/* ── Screen routing & lifecycle ────────────────────────────── */
(function () {
  var currentScreen = 'login';
  var destroyers = {};

  window.navigate = function (screenId) {
    // Destroy current game if leaving
    if (destroyers[currentScreen]) {
      destroyers[currentScreen]();
      delete destroyers[currentScreen];
    }

    // Hide all screens
    var screens = document.querySelectorAll('.screen');
    for (var i = 0; i < screens.length; i++) {
      screens[i].classList.remove('active');
    }

    // Show target
    var target = document.getElementById('screen-' + screenId);
    if (target) target.classList.add('active');

    // Update nav
    var navbar = document.getElementById('navbar');
    var backBtn = document.getElementById('back-btn');
    var logoutBtn = document.getElementById('logout-btn');
    var title = document.getElementById('nav-title');

    if (screenId === 'login') {
      navbar.classList.add('hidden');
      GameData.currentUser = null;
    } else {
      navbar.classList.remove('hidden');
      logoutBtn.classList.remove('hidden');

      if (screenId === 'menu') {
        backBtn.classList.add('hidden');
        title.textContent = 'Daily Minigames';
        var greeting = document.getElementById('menu-greeting');
        if (greeting && GameData.currentUser) {
          greeting.textContent = '';
          greeting.appendChild(document.createTextNode('Welcome, '));
          var nameSpan = document.createElement('span');
          nameSpan.className = 'accent-name';
          nameSpan.textContent = GameData.currentUser;
          greeting.appendChild(nameSpan);
        }
      } else {
        backBtn.classList.remove('hidden');
        var titles = {
          connections: 'Connections',
          wordle: 'Wordle',
          sudoku: 'Sudoku',
          memorymatch: 'Memory Match',
          friends: 'Friends',
          scoreboard: 'Scoreboard'
        };
        title.textContent = titles[screenId] || screenId;
      }
    }

    // Init game / login
    if (screenId === 'login') {
      destroyers.login = window.LoginUI.init();
    } else if (screenId === 'connections') {
      destroyers.connections = window.ConnectionsUI.init();
    } else if (screenId === 'wordle') {
      destroyers.wordle = window.WordleUI.init();
    } else if (screenId === 'sudoku') {
      destroyers.sudoku = window.SudokuUI.init();
    } else if (screenId === 'memorymatch') {
      destroyers.memorymatch = window.MemoryMatchUI.init();
    } else if (screenId === 'friends') {
      destroyers.friends = window.FriendsUI.init();
    } else if (screenId === "scoreboard") {
      destroyers.scoreboard = window.ScoreboardUI.init();
    }

    currentScreen = screenId;
  };

  // Hide navbar and init login on initial load
  document.getElementById('navbar').classList.add('hidden');
  destroyers.login = window.LoginUI.init();
})();
