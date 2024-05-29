// Skapar en backend-server med Express.js som hanterar autentisering och CRUD-operationer för inlägg
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./database'); 
const app = express();
const PORT = process.env.PORT || 3001;
const SECRET_KEY = 'verysecretkey';

app.use(cors());
app.use(bodyParser.json());
// Authentiseringsmiddleware
function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).send({ message: 'API-nyckel krävs' });
  }
  const token = authHeader.split(' ')[1]; // Ta bort "Bearer " prefixet

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'Ogiltig API-nyckel' });
    }
    req.user = decoded; // Sparar den dekodade användarinformationen i req-objektet
    next();
  });
}
// Registrerings- och inloggningsendpunkter
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT username FROM users WHERE username = ?', [username], async (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Databasfel' });
    }
    if (result.length) {
      return res.status(409).json({ message: 'Användaren finns redan.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Kunde inte skapa användare.' });
      }
      const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '24h' });
      res.status(201).json({ message: 'Användare skapad!', apikey: token });
    });
  });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, result) => {
    if (err) {
      return res.status(500).send({ message: 'Databasfel' });
    }
    if (!result.length || !(await bcrypt.compare(password, result[0].password))) {
      return res.status(401).send({ message: 'Fel användarnamn eller lösenord.' });
    }
    const apiKey = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
    db.query('UPDATE users SET api_key = ? WHERE username = ?', [apiKey, username], (err, updateResult) => {
      if (err) {
        return res.status(500).send({ message: 'Kunde inte uppdatera API-nyckel' });
      }
      res.json({ apikey: apiKey });
    });
  });
});
// Hämtar inlägg från databasen
app.get('/posts', (req, res) => {
  const page = req.query.page;
  let query = 'SELECT * FROM posts';
  let queryParams = [];

  if (page) {
    query += ' WHERE page = ?';
    queryParams.push(page);
  }

  db.query(query, queryParams, (err, results) => {
    if (err) {
      return res.status(500).send('Error fetching posts');
    }
    res.json(results);
  });
});
// Skapar ett nytt inlägg och går igenom authoriseringsprocessen
app.post('/posts', authenticate, async (req, res) => {
  const { title, content, page } = req.body;
  let textContent = '';
  let imageUrl = '';
  let listContent = '';
  let headerContent = '';
  content.forEach(element => {
    switch (element.type) {
      case 'text':
        textContent = element.content;
        break;
      case 'image':
        imageUrl = element.content;
        break;
      case 'list':
        listContent = JSON.stringify(element.content);
        break;
      case 'header':
        headerContent = element.content;
        break;
      default:
        break;
    }
  });

  const query = 'INSERT INTO posts (title, text_content, image_url, list_content, header_content, page, position) VALUES (?, ?, ?, ?, ?, ?, ?)';
  const queryParams = [title, textContent, imageUrl, listContent, headerContent, page, null];

  db.query(query, queryParams, (err, result) => {
    if (err) {
      console.error('Error during post creation:', err);
      return res.status(500).json({ message: 'Failed to create post', error: err });
    }
    res.status(201).json({ message: 'Post created successfully', postId: result.insertId });
  });
});

// Raderar inlägg från databasen
app.delete('/posts/:id', authenticate, (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM posts WHERE id = ?', [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to delete post' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Inlägg ej hittat' });
    }
    res.status(200).json({ message: 'Inlägg raderat' });
  });
});

// Uppdaterar inlägg i databasen
app.put('/posts/:id', authenticate, (req, res) => {
  const { id } = req.params;
  const { title, text_content, image_url, list_content, header_content } = req.body;

  console.log('PUT /posts/:id');
  console.log('Request params:', req.params);
  console.log('Request body:', req.body);

  const query = 'UPDATE posts SET title = ?, text_content = ?, image_url = ?, list_content = ?, header_content = ? WHERE id = ?';
  const queryParams = [title, text_content, image_url, list_content, header_content, id];

  db.query(query, queryParams, (err, result) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Failed to update post' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json({ message: 'Post updated successfully' });
  });
});
// Uppdaterar positioner i databasen
app.post('/update-positions', authenticate, (req, res) => {
  const { positions } = req.body;
  const updates = positions.map(({ id, position }) => {
    return new Promise((resolve, reject) => {
      db.query('UPDATE posts SET position = ? WHERE id = ?', [position, id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  });

  Promise.all(updates)
    .then(() => res.status(200).json({ message: 'Positioner uppdaterade!' }))
    .catch((err) => res.status(500).json({ message: 'Positioner kunde inte uppdateras.', error: err }));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
