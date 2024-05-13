const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./database'); // Importera din databasanslutning

const app = express();
const PORT = process.env.PORT || 3001;
const SECRET_KEY = 'verysecretkey';

app.use(cors());
app.use(bodyParser.json());

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  console.log(`Attempting to register user: ${username}`);
  db.query('SELECT username FROM users WHERE username = ?', [username], async (err, result) => {
    if (err) {
      console.error('Error during user search:', err);
      return res.status(500).send('Databasfel');
    }
    if (result.length) {
      console.log('User already exists:', username);
      return res.status(409).send('Användaren finns redan.');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err, result) => {
      if (err) {
        console.error('Error during user creation:', err);
        return res.status(500).send('Kunde inte skapa användare.');
      }
      console.log('User created successfully:', username);
      res.status(201).send('Användare skapad!');
    });
  });
});


app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, result) => {
    if (err) {
      return res.status(500).send('Databasfel');
    }
    if (!result.length || !(await bcrypt.compare(password, result[0].password))) {
      return res.status(401).send('Fel användarnamn eller lösenord.');
    }
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '24h' });
    res.json({ apikey: token });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
