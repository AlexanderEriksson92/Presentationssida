const mysql = require('mysql');


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'presentation'
});

// Anslut till databasen
db.connect(err => {
    if (err) {
        console.error('An error occurred while connecting to the database:', err);
        return;
    }
    console.log('Connected to the database successfully!');
});

module.exports = db;
