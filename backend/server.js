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

function authenticate(req, res, next) {
  const apiKey = req.headers['api-key'];
  if (!apiKey) {
    return res.status(401).send({ message: 'API-nyckel krävs' });
  }
  db.query('SELECT * FROM users WHERE api_key = ?', [apiKey], (err, result) => {
    if (err || !result.length) {
      return res.status(401).send({ message: 'Ogiltig API-nyckel' });
    }
    next();  // API-nyckel är giltig, fortsätt med förfrågan
  });
}

app.post('/register', async (req, res) => {
  const { username, password } = req.body;                // Hämtar användarnamn och lösenord från förfrågan
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
    const apiKey = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });  // Generera en ny API-nyckel
    db.query('UPDATE users SET api_key = ? WHERE username = ?', [apiKey, username], (err, updateResult) => {
      if (err) {
        return res.status(500).send({ message: 'Kunde inte uppdatera API-nyckel' });
      }
      res.json({ apikey: apiKey });
    });
  });
});

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
      console.log('Database query error:', err); // Logga fel
      return res.status(500).send('Error fetching posts');
    }
    console.log('Fetched posts from database:', results); // Logga resultat
    res.json(results);
  });
});

app.post('/posts', async (req, res) => {
  console.log('POST /posts request received', req.body);
  const { title, content, imageUrl, page } = req.body;
  if (!title || !content || !page) {
    return res.status(400).json({ message: 'Title, content, and page are required' });
  }
  const query = 'INSERT INTO posts (title, content, image_url, page) VALUES (?, ?, ?, ?)';
  db.query(query, [title, content, imageUrl, page], (err, result) => {
    if (err) {
      console.error('Error during post creation:', err);
      return res.status(500).json({ message: 'Failed to create post' });
    }
    res.status(201).json({ message: 'Post created successfully', postId: result.insertId });
  });
});

app.delete('/posts/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM posts WHERE id = ?',  [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to delete post' });
  }
  if (result.affectedRows === 0) {
    return res.status(404).json({ message: 'Inlägg ej hittat'});
  }
  res.status(200).json({ message: 'Inlägg raderat' });
});
});
app.put('/posts/:id', (req, res) => {
  const { id } = req.params;
  const { title, content, imageUrl } = req.body;

  // Logga inkommande PUT-förfrågan
  console.log('PUT /posts/:id');
  console.log('Request params:', req.params);
  console.log('Request body:', req.body);

  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }

  let query = 'UPDATE posts SET title = ?, content = ?';
  let queryParams = [title, content];

  if (imageUrl !== undefined) {
    query += ', image_url = ?';
    queryParams.push(imageUrl);
  }

  query += ' WHERE id = ?';
  queryParams.push(id);

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
app.post('/update-positions', (req, res) => {
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