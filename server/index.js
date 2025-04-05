const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const CREDENTIALS_FILE = path.join(__dirname, 'credentials.json');

// LOGIN: Validate user and return if it's first login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const data = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, 'utf8'));

  const user = data.users.find(u => u.username === username && u.password === password);
  if (user) {
    res.json({ success: true, firstLogin: user.firstLogin });
  } else {
    res.json({ success: false });
  }
});

// SIGNUP: Add new user with firstLogin = true
app.post('/signup', (req, res) => {
  const { username, password } = req.body;
  const data = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, 'utf8'));

  if (data.users.find(u => u.username === username)) {
    return res.status(400).json({ message: 'User already exists' });
  }

  data.users.push({ username, password, firstLogin: true });
  fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify(data, null, 2));
  res.json({ success: true });
});

// UPDATE firstLogin to false after intake
app.post('/setReturning', (req, res) => {
  const { username } = req.body;
  const data = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, 'utf8'));
  const user = data.users.find(u => u.username === username);

  if (user) {
    user.firstLogin = false;
    fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify(data, null, 2));
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

app.listen(3001, () => console.log('✅ Server running on http://localhost:3001'));
