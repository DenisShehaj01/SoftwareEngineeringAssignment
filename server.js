const express = require("express");
const app = express();
const path = require('path');
const mysql = require('mysql');


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Software007',
    database: 'Userdb',
    port: '3308',
});

app.listen(5502, () => {
    console.log("Server started on port 5502");
});



connection.connect((error) => {
    if (error) {
        console.log('Error connecting to MySQL database:', error);
        return;
    }
    console.log('Connected to MySQL database');
});

//middleware 

const publicDirectory = path.join(__dirname, 'public');
app.use(express.static(publicDirectory));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/auth', require('./pms/routes/auth'));
app.use('/log', require('./pms/routes/log'));
app.use('/register', require('./pms/routes/register'));
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'pms', 'views'));

//routes for each page 
app.get("/", (req, res) => {
    res.render('password');
});

app.get("/log", (req, res) => {
    res.render('log');
});

app.get("/create", (req, res) => {
    res.render('create');
});



app.get("/profile", (req, res) => {
    res.render('profile');
});


app.get("/payment", (req, res) => {
    res.render('payment');
});

app.get("/notifyadminarrival", (req, res) => {
    res.render('notifyadminarrival');
});
app.get("/notifyadmindeparture", (req, res) => {
    res.render('notifyadmindeparture');
});
app.get("/index", (req, res) => {
    res.render('index');
});
app.get("/notifyadmindeparture", (req, res) => {
    res.render('notifyadmindeparture');
});
app.get("/notifyadmindeparture", (req, res) => {
    res.render('notifyadmindeparture');
});
//routes for serving the server.js file 
app.get("/server.js", (req, res) => {
    res.type('text/javascript');
    res.sendFile(path.join(__dirname, 'server.js'));
});

//route for serving their css
app.get("/EasyParking.css", (req, res) => {
    res.type('text/css');
    res.sendFile(path.join(__dirname, 'pms/public/stylesheets/EasyParking.css'));
});

app.get("/layout.pug", (req, res) => {
    res.type('text/css');
    res.sendFile(path.join(__dirname, 'views/layout.pug'));
});

// Route for serving the styles.css file for password.pug
app.get("/styles.css", (req, res) => {
    res.type('text/css');
    res.sendFile(path.join(__dirname, 'pms/public/stylesheets/styles.css'));
});

// Route for rendering the reset password form
app.get("/resetpassword", (req, res) => {
    res.render("password");
});

app.get("/login", (req, res) => {
    res.render("log");
});
app.get("/AdminHome", (req, res) => {
    res.render("AdminHome");
});
app.get("/SendRequest", (req, res) => {
    res.render("SendRequest");
});
// Export the app
module.exports = app;