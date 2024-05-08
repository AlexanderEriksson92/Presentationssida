const express = require('express');
const app = express();
const port = 3001; 

app.get('/', (req, res) => {
  res.send('Hej från Express!');
});

app.listen(port, () => {
  console.log(`Server lyssnar på port ${port}`);
});
