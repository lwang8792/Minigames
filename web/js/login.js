/* ── LoginUI ─────────────────────────────────── */

window.LoginUI = {
  init: function () {
    var form = document.getElementById('login-form');
    var errorEl = document.getElementById('login-error');
    var registerBtn = document.getElementById('register-btn');

    function doAuth(endpoint, username, password) {
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username, password: password })
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data.ok) {
            errorEl.textContent = '';
            GameData.currentUser = username;
            navigate('menu');
          } else {
            errorEl.textContent = data.error || 'Something went wrong.';
          }
        })
        .catch(function () {
          errorEl.textContent = 'Could not connect to server.';
        });
    }

    function onSubmit(e) {
      e.preventDefault();
      var username = document.getElementById('login-username').value.trim();
      var password = document.getElementById('login-password').value;

      if (!username || !password) {
        errorEl.textContent = 'Username and password required.';
        return;
      }

      doAuth('/api/login', username, password);
    }

    function onRegister() {
      var username = document.getElementById('login-username').value.trim();
      var password = document.getElementById('login-password').value;

      if (!username || !password) {
        errorEl.textContent = 'Username and password required.';
        return;
      }

      doAuth('/api/register', username, password);
    }

    form.addEventListener('submit', onSubmit);
    registerBtn.addEventListener('click', onRegister);

    return function () {
      form.removeEventListener('submit', onSubmit);
      registerBtn.removeEventListener('click', onRegister);
    };
  }
};
