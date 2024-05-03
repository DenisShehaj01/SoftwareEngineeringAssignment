const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const mysql = require('mysql');

// Initialize the Express application
const app = express();

// Middleware for parsing request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Session middleware configuration
app.use(session({
    secret: 'secret_key', // Change this to a random unique string in production
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// MySQL connection pool configuration
const pool = mysql.createPool({
    connectionLimit: 10, // Maximum number of connections to create at once
    host: 'localhost', // Host where  database server is running
    user: 'mysql_username', // database username
    password: 'mysql_password', //  database password
    database: 'EasyParking' // Name of your database
});

// Serve static files from a specified directory (e.g., where your frontend files are)
app.use(express.static(__dirname));

// Define a simple route for the homepage
app.get('/', (req, res) => {
    res.send('Welcome to Easy Parking!');
});

// User login endpoint
app.post('/user-login', (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM users WHERE username = ? AND password = ? AND role = "user"';
    pool.query(query, [username, password], (error, results) => {
        if (error) {
            return res.status(500).send('An error occurred with the database');
        }
        if (results.length > 0) {
            req.session.loggedin = true;
            req.session.username = username;
            res.redirect('/user-dashboard');
        } else {
            res.status(401).send('Incorrect Username and/or Password or not authorized!');
        }
    });
});

// Admin login endpoint
app.post('/admin-login', (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM users WHERE username = ? AND password = ? AND role = "admin"';
    pool.query(query, [username, password], (error, results) => {
        if (error) {
            return res.status(500).send('An error occurred with the database');
        }
        if (results.length > 0) {
            req.session.loggedin = true;
            req.session.username = username;
            res.redirect('/admin-dashboard');
        } else {
            res.status(401).send('Incorrect Username and/or Password or not authorized!');
        }
    });
});

// Start the server on a specified port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

