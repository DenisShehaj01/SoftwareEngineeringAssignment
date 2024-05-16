var express = require('express');
var router = express.Router();
const util = require('util');
const connection = require('../modules/CarPark.js')

router.get('/', async function(req, res, next) {
  connection.query = util.promisify(connection.query);
  const fetchcarparks = 'SELECT Name from carpark WHERE NumberOfFreeSpaces > 0'; //doesnt output carpark if its full
  const carParks = await connection.query(fetchcarparks);
  console.log(carParks);
  res.render('sendrequest', { title: 'Send Request', carParks }); 
    
});


router.post('/', function(req, res, next) {
    // Store form data in variables
    // add check to see if carpark is full
    const destination = req.body.destination;
    const arrival = req.body.arrival;
    const departure = req.body.departure;
    connection.query('SELECT CarParkID FROM carpark WHERE Name = ?', [destination], (error, results, fields) => {
      const carParkID = results[0].CarParkID;
      const InsertSql = "INSERT INTO notifications (UserID, CarParkID, StartTime, EndTime) VALUES (1, ?,?,?)";
      connection.query(InsertSql, [carParkID, arrival, departure], function(err, result) {
        if (err) {
          // Handle any errors during query execution
          console.error("Error executing the query: " + err.message);
       } else {
          // If no error, print the result
          console.log("Entry added successfully, ID:", result.insertId);
        }
      });
    });
  // It's a good idea to close the connection when it's no longer needed
  // Note: In a real-world application, you might want to keep the connection open
  // if you're going to use it for more queries soon after.
  //connection.end();
    res.send('Request Received: ' + destination + ', ' + arrival + ', ' + departure);
    console.log('Request Received: ' + destination + ', ' + arrival + ', ' + departure);
});

module.exports = router;
