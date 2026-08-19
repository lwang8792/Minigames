/* ── FriendsUI (API-backed) ─────────────────────────────────── */

window.FriendsUI = {
  init: function () {
    var root = document.getElementById('friends-root');
    var currentUser = window.GameData.currentUser;
    var activeTab = 'friends';
    var statusMsg = '';

    async function render() {
      var html = '';

      // Tabs
      html += '<div class="friends-tabs">';
      html += '<button class="friends-tab' + (activeTab === 'friends' ? ' active' : '') + '" data-tab="friends">Friends</button>';
      html += '<button class="friends-tab' + (activeTab === 'incoming' ? ' active' : '') + '" data-tab="incoming">Incoming</button>';
      html += '<button class="friends-tab' + (activeTab === 'add' ? ' active' : '') + '" data-tab="add">Add Friend</button>';
      html += '</div>';

      if (activeTab === 'friends') {
        try {
          var res = await fetch('/api/friends/' + encodeURIComponent(currentUser));
          var friends = await res.json();
          if (friends.length === 0) {
            html += '<div class="friends-empty">No friends yet. Send a request to add friends!</div>';
          } else {
            html += '<ul class="friends-list">';
            for (var i = 0; i < friends.length; i++) {
              html += '<li>';
              html += '<div><span class="friend-name">' + esc(friends[i].friend) + '</span></div>';
              html += '</li>';
            }
            html += '</ul>';
          }
        } catch (e) {
          html += '<div class="friends-empty">Could not load friends.</div>';
        }
      } else if (activeTab === 'incoming') {
        try {
          var res = await fetch('/api/friends/requests/incoming/' + encodeURIComponent(currentUser));
          var requests = await res.json();
          if (requests.length === 0) {
            html += '<div class="friends-empty">No incoming requests.</div>';
          } else {
            html += '<ul class="friends-list">';
            for (var i = 0; i < requests.length; i++) {
              var sender = requests[i].sender_username;
              html += '<li>';
              html += '<div><span class="friend-name">' + esc(sender) + '</span></div>';
              html += '<button class="accept-btn" data-name="' + esc(sender) + '">Accept</button>';
              html += '</li>';
            }
            html += '</ul>';
          }
        } catch (e) {
          html += '<div class="friends-empty">Could not load requests.</div>';
        }
      } else if (activeTab === 'add') {
        html += '<div class="friends-send-form">';
        html += '<input type="text" id="send-request-input" placeholder="Enter username...">';
        html += '<button id="send-request-btn">Send Request</button>';
        html += '</div>';
        if (statusMsg) {
          html += '<div class="friends-status">' + esc(statusMsg) + '</div>';
        }
      }

      root.innerHTML = html;

      // Bind tabs
      var tabs = root.querySelectorAll('.friends-tab');
      for (var i = 0; i < tabs.length; i++) {
        tabs[i].addEventListener('click', onTabClick);
      }

      // Bind accept buttons
      var acceptBtns = root.querySelectorAll('.accept-btn');
      for (var i = 0; i < acceptBtns.length; i++) {
        acceptBtns[i].addEventListener('click', onAccept);
      }

      // Bind send request
      var sendBtn = document.getElementById('send-request-btn');
      if (sendBtn) sendBtn.addEventListener('click', onSendRequest);

      var sendInput = document.getElementById('send-request-input');
      if (sendInput) {
        sendInput.addEventListener('keydown', function (e) {
          if (e.key === 'Enter') onSendRequest();
        });
        sendInput.focus();
      }
    }

    function onTabClick(e) {
      activeTab = e.currentTarget.getAttribute('data-tab');
      statusMsg = '';
      render();
    }

    async function onAccept(e) {
      var name = e.currentTarget.getAttribute('data-name');
      try {
        var res = await fetch('/api/friends/accept', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: currentUser, friendName: name })
        });
        var result = await res.json();
        if (!result.ok) {
          alert(result.error || 'Could not accept request.');
        }
      } catch (e) {
        alert('Network error.');
      }
      render();
    }

    async function onSendRequest() {
      var input = document.getElementById('send-request-input');
      if (!input || !input.value.trim()) return;

      var target = input.value.trim();
      if (target === currentUser) {
        statusMsg = "You can't add yourself!";
        render();
        return;
      }

      try {
        var res = await fetch('/api/friends/request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sender: currentUser, receiver: target })
        });
        var result = await res.json();
        if (result.ok) {
          statusMsg = 'Request sent to ' + target + '!';
        } else {
          statusMsg = result.error || 'Could not send request.';
        }
      } catch (e) {
        statusMsg = 'Network error.';
      }
      render();
    }

    function esc(s) {
      var d = document.createElement('div');
      d.textContent = s;
      return d.innerHTML;
    }

    render();

    return function () {
      root.innerHTML = '';
    };
  }
};
