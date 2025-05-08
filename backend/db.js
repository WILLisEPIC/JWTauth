const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./auth.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the database.');
    }
});

db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        salt TEXT,
        role TEXT
    )
`);

module.exports = db;