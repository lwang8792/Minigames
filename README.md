# Group10 Minigames Project

## Running the Web Interface

The web frontend is served through the Node.js backend.

### Option 1 (Recommended: Local Server)

1. Open a terminal.
2. Navigate to the project folder:

```
cd group10
```

3. Install dependencies:

```
npm install
```

4. Start the server:

```
node server.js
```

5. Open a browser and go to:

```
http://localhost:3000
```

The website should now load and allow you to access the minigames interface.

---

### Option 2 (VS Code Live Server)

1. Open the project in VS Code.
2. Open `web/index.html`.
3. Right-click the file and select **Open with Live Server**.

The website will automatically open in your browser, but backend features (login, scores, friends) will not work without the Node server running.

---

### Option 3 (Directly Opening the File)

You can also open the site by double-clicking:

```
web/index.html
```

However, backend features (login, scores, friends) will not work correctly without the Node server running.

---

## Notes

* The `web/` folder contains the HTML, CSS, and JavaScript for the frontend interface.
* The backend API is handled by `server.js`.
* A local server is required for features such as login, scores, and friends.