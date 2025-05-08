const express = require('express');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const db = require('./db');
const router = express.Router();
const { encrypt, decrypt } = require('./encryption');

const SECRET_KEY = process.env.SECRET_KEY;

//Register route
router.post('/register', (req, res) => {
    const { username, password } = req.body;

    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.createHash('sha256').update(password + salt).digest('hex');

    db.run(`INSERT INTO users (username, password, salt, role) VALUES (?, ?, ?, ?)`,
        [username, hash, salt, 'user'], (err) => {
            if (err) return res.status(400).json({ message: "Username already exists" });
            res.status(201).json({ message: "Registration Complete" });
        }
    );
});

//Login route
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
        if (err || !user) return res.status(401).json({ message: "Invalid username or password" });

        const hash = crypto.createHash('sha256').update(password + user.salt).digest('hex');

        if (hash !== user.password) {
            return res.status(401).json({ message: "Invalid username or password" });
        }
        const token = jwt.sign({
            username: user.username,
            role: user.role,
            system: "wai_CET324",
            issuedAt: Date.now(),
        }, SECRET_KEY, { algorithm: "HS256", expiresIn: "1h" });
        
        const encryptedToken = encrypt(token);
        res.json({ token: encryptedToken });
    });
});

//Verify Token
router.post('/verify', (req, res) => {
    const { token } = req.body;

    try {
        const decryptedToken = decrypt(token);
        const decoded = jwt.verify(decryptedToken, SECRET_KEY);
        res.json({ valid: true, decoded });
    } catch (err) {
        res.status(401).json({ valid: false, message: "*Login failed" });
    }
});

module.exports = router;