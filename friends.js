/* FriendList engine */

function FriendList(currentUser) {
  this.currentUser = currentUser; 
}

// Fetches accepted friends 
FriendList.prototype.getFriends = async function () {
  const res = await fetch(`/api/friends/${this.currentUser}`);
  return await res.json();
};

// Fetches pending requests sent to this user
FriendList.prototype.getIncomingRequests = async function () {
  const res = await fetch(`/api/friends/requests/incoming/${this.currentUser}`);
  return await res.json();
};

// Sends a request to another user 
FriendList.prototype.sendRequest = async function (targetName) {
  if (!targetName.trim()) return { ok: false, error: 'Name required' };
  const res = await fetch('/api/friends/request', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sender: this.currentUser, receiver: targetName.trim() })
  });
  return await res.json();
};

// Updates a pending request to 'accepted'
FriendList.prototype.acceptFriend = async function (friendName) {
  const res = await fetch('/api/friends/accept', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: this.currentUser, friendName: friendName })
  });
  return await res.json();
};

/* UI */

window.FriendsUI = {
  init: function (username) {
    var root = document.getElementById('friends-root');
    var fl = new FriendList(username);
    var activeTab = 'friends'; 

    async function render() {
      let listData = [];
      if (activeTab === 'friends') {
        listData = await fl.getFriends();
      } else if (activeTab === 'incoming') {
        listData = await fl.getIncomingRequests();
      }

      var html = '';

      html += '<div class="friends-tabs">';
      html += '<button class="friends-tab' + (activeTab === 'friends' ? ' active' : '') + '" data-tab="friends">Friends</button>';
      html += '<button class="friends-tab' + (activeTab === 'incoming' ? ' active' : '') + '" data-tab="incoming">Incoming</button>';
      html += '<button class="friends-tab' + (activeTab === 'outgoing' ? ' active' : '') + '" data-tab="outgoing">Send Request</button>';
      html += '</div>';

      // Friends List Tab
      if (activeTab === 'friends') {
        if (listData.length === 0) {
          html += '<div class="friends-empty">No friends yet.</div>';
        } else {
          html += '<ul class="friends-list">';
          for (var i = 0; i < listData.length; i++) {
            html += '<li>';
            html += '<div><span class="friend-name">' + esc(listData[i].friend) + '</span></div>';
            html += '</li>';
          }
          html += '</ul>';
        }
      } 
      // Incoming Requests Tab
      else if (activeTab === 'incoming') {
        if (listData.length === 0) {
          html += '<div class="friends-empty">No incoming requests.</div>';
        } else {
          html += '<ul class="friends-list">';
          for (var i = 0; i < listData.length; i++) {
            var requester = listData[i].sender_username;
            html += '<li>';
            html += '<div><span class="friend-name">' + esc(requester) + '</span></div>';
            html += '<button class="accept-btn" data-name="' + esc(requester) + '">Accept</button>';
            html += '</li>';
          }
          html += '</ul>';
        }
      } 
      // Send Request Tab
      else if (activeTab === 'outgoing') {
        html += '<div class="friends-send-form">';
        html += '<input type="text" id="send-request-input" placeholder="Enter username...">';
        html += '<button id="send-request-btn">Send Request</button>';
        html += '</div>';
      }

      root.innerHTML = html;

      root.querySelectorAll('.friends-tab').forEach(btn => btn.onclick = onTabClick);
      root.querySelectorAll('.accept-btn').forEach(btn => btn.onclick = onAccept);
      
      const sendBtn = document.getElementById('send-request-btn');
      if (sendBtn) sendBtn.onclick = onSendRequest;
    }

    async function onTabClick(e) {
      activeTab = e.currentTarget.getAttribute('data-tab');
      render();
    }

    async function onAccept(e) {
      var name = e.currentTarget.getAttribute('data-name');
      const result = await fl.acceptFriend(name);
      if (result.ok) render();
      else alert(result.error);
    }

    async function onSendRequest() {
      var input = document.getElementById('send-request-input');
      if (input && input.value.trim()) {
        const result = await fl.sendRequest(input.value);
        if (result.ok) {
          alert("Request sent!");
          input.value = '';
        } else {
          alert(result.error);
        }
      }
    }

    function esc(s) {
      var d = document.createElement('div');
      d.textContent = s;
      return d.innerHTML;
    }

    render(); 

    return function () { root.innerHTML = ''; };
  }
};