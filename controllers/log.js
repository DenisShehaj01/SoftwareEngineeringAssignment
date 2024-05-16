const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost', 
    user: 'root', 
    password: 'Software007', 
    database: 'Userdb',
    port:'3308',
});


exports.login = (req, res) => {
    console.log('Received input from HTML form:', req.body);

    const { username, password, userType, hiddenUserType } = req.body;

    
    console.log('Received input from HTML form:');
    console.log('Username:', username);
    console.log('Password:', password);
    console.log('UserType:', userType);
    console.log('Hidden Usertype:', hiddenUserType);

    
    connection.query('SELECT username, password, usertype FROM Userlogin WHERE username = ?', [username], (error, results) => {
        if (error) {
            console.error('Error querying database:', error);
            return res.status(500).send('Unable to connect to database');
        }

        if (results.length === 0) {
           
            return res.status(401).send('Invalid username or password');
        }

        const user = results[0];

        
        if (password !== user.password) {
            
            return res.status(401).send('Invalid username or password');
        }

       
        if (hiddenUserType !== user.usertype) {
            return res.status(401).send('Account not found');
        }

        // Redirect based on usertype
        if (hiddenUserType === '0') {
            // Client
            res.redirect('/profile');
        } else if (hiddenUserType === '1') {
            // Admin
            res.redirect('/homepage.html');
        }
    });
};
