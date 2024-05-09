
// Variablar för att använda express, bcrypt och cors

const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const db = require('./database');
const app = express();


app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true, 
    methods: ['GET', 'POST'], 
}));

// Logga in användare

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await db.query('SELECT id FROM users WHERE username = ?', [username]);
    if (user.length && await bcrypt.compare(password, user[0].password)) {
      const newApiKey = crypto.randomBytes(20).toString('hex');
      await db.query('INSERT INTO api_keys (user_id, api_key) VALUES (?, ?)', [user[0].id, newApiKey]);
      res.json({ apikey: newApiKey });
    } else {
      res.status(401).json({ message: 'Authentication failed' });
    }
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Registrera användare

  app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
      res.status(201).send('User created');
    } catch (error) {
      res.status(500).json({ message: 'Error creating user' });
    }
  });

app.listen(3001, () => {
  console.log('Server running on port 3001');
});

// Validerar API-nyckel

const validateApiKey = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) {
    return res.status(401).json({ message: 'API key missing' });
  }
  try {
    const key = await db.query('SELECT user_id FROM api_keys WHERE api_key = ?', [apiKey]);
    if (key.length) {
      req.user = key[0];
      next();
    } else {
      res.status(401).json({ message: 'Invalid API key' });
    }
  }
  catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Kör en skyddad rutt

app.get('/protected-route', validateApiKey, (req, res) => {
  res.json({ message: 'This is protected data.' });
});