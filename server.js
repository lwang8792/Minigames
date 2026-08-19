const express = require('express');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const db = new Database('minigames.db');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    game TEXT NOT NULL,
    score INTEGER NOT NULL,
    played_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS friendships (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sender_username TEXT NOT NULL,
  receiver_username TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending' or 'accepted'
  created_at TEXT DEFAULT (datetime('now')),
  UNIQUE(sender_username, receiver_username)
 );
`);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'web')));

// Register
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.json({ ok: false, error: 'Username and password required.' });
  }
  try {
    db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run(username, password);
    res.json({ ok: true });
  } catch (e) {
    res.json({ ok: false, error: 'Username already taken.' });
  }
});

// Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE username = ? AND password = ?').get(username, password);
  if (user) {
    res.json({ ok: true });
  } else {
    res.json({ ok: false, error: 'Invalid username or password.' });
  }
});

// Submit score
app.post('/api/scores', (req, res) => {
  const { username, game, score } = req.body;
  if (!username || !game || score === undefined) {
    return res.json({ ok: false, error: 'Missing fields.' });
  }
  db.prepare('INSERT INTO scores (username, game, score) VALUES (?, ?, ?)').run(username, game, score);
  res.json({ ok: true });
});

// Get leaderboard for a game
app.get('/api/scores/:game', (req, res) => {
  const rows = db.prepare(
    'SELECT username, score, played_at FROM scores WHERE game = ? ORDER BY played_at DESC LIMIT 50'
  ).all(req.params.game);
  res.json(rows);
});

// Get a user's own recent scores
app.get('/api/scores/user/:username', (req, res) => {
  const rows = db.prepare(
    'SELECT game, score, played_at FROM scores WHERE username = ? ORDER BY played_at DESC LIMIT 30'
  ).all(req.params.username);
  res.json(rows);
});

// Get recent scores from a user's friends
app.get('/api/scores/friends/:username', (req, res) => {
  const user = req.params.username;
  const rows = db.prepare(`
    SELECT s.username, s.game, s.score, s.played_at
    FROM scores s
    WHERE s.username IN (
      SELECT sender_username FROM friendships WHERE receiver_username = ? AND status = 'accepted'
      UNION
      SELECT receiver_username FROM friendships WHERE sender_username = ? AND status = 'accepted'
    )
    ORDER BY s.played_at DESC
    LIMIT 30
  `).all(user, user);
  res.json(rows);
});

//send friend requests
app.post('/api/friends/request', (req, res) => {
  const { sender, receiver } = req.body;
  try {
    // Ensure the receiver actually exists
    const user = db.prepare('SELECT username FROM users WHERE username = ?').get(receiver);
    if (!user) return res.json({ ok: false, error: 'User does not exist.' });

    db.prepare('INSERT INTO friendships (sender_username, receiver_username) VALUES (?, ?)')
      .run(sender, receiver);
    res.json({ ok: true });
  } catch (e) {
    res.json({ ok: false, error: 'Request already sent or error occurred.' });
  }
});

//accept friend requests
app.post('/api/friends/accept', (req, res) => {
  const { username, friendName } = req.body;
  const result = db.prepare(`
    UPDATE friendships 
    SET status = 'accepted' 
    WHERE receiver_username = ? AND sender_username = ? AND status = 'pending'
  `).run(username, friendName);

  if (result.changes > 0) {
    res.json({ ok: true });
  } else {
    res.json({ ok: false, error: 'No pending request found.' });
  }
});

//get accepted friends
app.get('/api/friends/:username', (req, res) => {
  const user = req.params.username;
  const friends = db.prepare(`
    SELECT sender_username AS friend FROM friendships WHERE receiver_username = ? AND status = 'accepted'
    UNION
    SELECT receiver_username AS friend FROM friendships WHERE sender_username = ? AND status = 'accepted'
  `).all(user, user);
  res.json(friends);
});

//get pending friend requests
app.get('/api/friends/requests/incoming/:username', (req, res) => {
  const requests = db.prepare("SELECT sender_username FROM friendships WHERE receiver_username = ? AND status = 'pending'")
    .all(req.params.username);
  res.json(requests);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
