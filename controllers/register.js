const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost', 
    user: 'root', 
    password: 'Software007', 
    database: 'Userdb',
    port: '3308',
});

exports.reg = (req, res) => {
    console.log(req.body);

    const { email, username, password, 'phone-number': phonenumber, firstname, surname, license } = req.body;

    connection.query(
        'SELECT * FROM Userlogin WHERE username = ? OR email = ?',
        [username, email],
        (err, results) => {
            if (err) {
                console.error('Error checking username/email existence: ' + err.stack);
                res.send('Error registering user');
                return;
            }

            
            if (results.length > 0) {
                res.send('Username or email is already in use');
                return;
            }

           
            const userData = {
                username,
                password,
                email,
                first_name: firstname,
                surname,
                phonenumber,
                carregistration: license 
            };

            
            connection.query('INSERT INTO Userlogin SET ?', userData, (error, results) => {
                if (error) {
                    console.error(error);
                    res.status(500).send('Error registering user');
                } else {
                    console.log('User registered successfully');
                    res.redirect('/log');
                }
            });
        }
    );
};
