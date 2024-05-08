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
      const user = await db.query('SELECT * FROM users WHERE username = ?', [username]);
      if (user.length && await bcrypt.compare(password, user[0].password)) {
        // Genererar en ny API-nyckel 
        const newApiKey = crypto.randomBytes(20).toString('hex');
        res.json({ apikey: newApiKey });
      } else {
        res.status(401).json({ message: 'Authentication failed' });
      }
    } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

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
