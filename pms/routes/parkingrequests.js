var express = require('express');
var router = express.Router();
const util = require('util');
const connection = require('../modules/CarPark.js');

router.get('/', async function(req, res, next) {
  try {
    //Fetches notifications from the database
    connection.query('SELECT notification_id, UserID, CarParkID, StartTime, EndTime FROM notifications', async (error, notifications, fields) => {
      if (error) {
        console.error('Error fetching notifications:', error);
        return res.status(500).send('Internal Server Error');
      }

      //Creates dictionary to store available spaces
      const availableSpacesDict = {};

      const promises = notifications.map(notification => {
        const carParkID = notification.CarParkID;
        return new Promise((resolve, reject) => {
          GetAvailableSpaces(carParkID, (error, availableSpaces) => {
            if (error) {
              reject(error);
            } else {
              availableSpacesDict[carParkID] = availableSpaces;
              resolve();
            }
          });
        });
      });

      // Wait for all promises to complete
      try {
        await Promise.all(promises);
        // Step 5: Render the template with the necessary data
        res.render('parkingrequests', { title: 'Parking Requests', notifications: notifications, availableSpaces: availableSpacesDict });
      } catch (err) {
        console.error('Error fetching available spaces:', err);
        res.status(500).send('Internal Server Error');
      }
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).send('Internal Server Error');
  }
});

//Get available spaces
router.get('/available-spaces/:carParkID', (req, res) => {
  const carParkID = req.params.carParkID;
  GetAvailableSpaces(carParkID, (error, availableSpaces) => {
    if (error) {
      return res.status(500).json({ error: 'Error fetching available spaces' });
    }
    res.json({ availableSpaces });
  });
});

// Route to handle form submission
router.post('/handle-notification', (req, res) => {
  const action = req.body.action;
  const notification_id = req.body.notification_id;
  const UserID = req.body.UserID;
  const CarParkID = req.body.CarParkID;
  const parkingSpace = req.body.parkingSpace;
  const arrival = formatDateTimeForMySQL(req.body.StartTime);
  const departure = formatDateTimeForMySQL(req.body.EndTime);

  if (action === 'accept') {
    //onsole.log('accept' + UserID + CarParkID + parkingSpace);
    
    if (parkingSpace == ""){ //checks for automatic allocation
      console.log("automatic")
      connection.query('SELECT CarParkID, NumberOfSpaces FROM carpark WHERE CarParkID = ?', [CarParkID], (error, results, fields) => {
        const carParkID = results[0].CarParkID;
        const NumOfSpaces = results[0].NumberOfSpaces
        //calculate best parking space
        connection.query('SELECT SpaceNum FROM space WHERE CarParkID = ?', [carParkID], (error, results, fields) => {
          if (error) {
            console.error('Error executing query:', error.stack);
            return;
          }
          const spaceNums = results.map(row => row.SpaceNum); //Array of SpaceNums
          console.log(spaceNums);
    
          // Generate a unique random number
          let Found = false;
          let newNum;
          const max = NumOfSpaces; // Adjust max as needed if different
          while (!Found) {
            newNum = Math.floor(Math.random() * (max + 1)); // Generates a number between 0 and max (inclusive)
            if (!spaceNums.includes(newNum)) {
              Found = true;
            }
          }
          console.log(newNum);

        
    
      //Must eventially include Car Registration and UserID
      //console.log(arrival,departure);
      const InsertSql = 'INSERT INTO space (CarParkID, StartTime, EndTime, SpaceNum) VALUES (?, ?, ?, ?)'; //spaceName temp here
      // Execute the SQL query
      connection.query(InsertSql, [carParkID, arrival, departure,newNum], function(err, result) { //5 = random test value
        if (err) {
          // Handle any errors during query execution
          console.error("Error executing the query: " + err.message);
        } else {
          // If no error, print the result
          console.log("Entry added successfully, ID:", result.insertId);
        }
      });
      const DeleteSql = 'DELETE FROM notifications WHERE notification_id = ?';
      connection.query(DeleteSql, [notification_id], function(err, result) {
        if (err) {
          console.error("Error deleting notification")
        } else{
          console.log("notification deleted succesfully")
        }   
      });
    });
  });

      
    }
    
    else{

      const InsertSql = 'INSERT INTO space (CarParkID, StartTime, EndTime, SpaceNum) VALUES (?, ?, ?, ?)'; //spaceName temp here
      // Execute the SQL query
      connection.query(InsertSql, [CarParkID, arrival, departure,parkingSpace], function(err, result) { //5 = random test value
        if (err) {
          // Handle any errors during query execution
          console.error("Error executing the query: " + err.message);
        } else {
          // If no error, print the result
          console.log("Entry added successfully, ID:", result.insertId);
        }
      });
      const DeleteSql = 'DELETE FROM notifications WHERE notification_id = ?';
      connection.query(DeleteSql, [notification_id], function(err, result) {
        if (err) {
          console.error("Error deleting notification")
        } else{
          console.log("notification deleted succesfully")
        }   
      });

    }
    // Handle accept logic here
  } else if (action === 'deny') {
    console.log('deny');
    // Handle deny logic here
    const DeleteSql = 'DELETE FROM notifications WHERE notification_id = ?';
      connection.query(DeleteSql, [notification_id], function(err, result) {
        if (err) {
          console.error("Error deleting notification")
        } else{
          console.log("notification deleted succesfully")
        }   
      });
  }

  // Send a response back to the client (you can customize this)
  res.redirect("/parkingrequests");
});


function GetAvailableSpaces(CarParkID, callback) {


  connection.query('SELECT SpaceNum FROM space WHERE CarParkID = ?', [CarParkID], (error, spaces, fields) => {
    if (error) {
      return callback(error, null);
    }

    const spaceNums = spaces.map(row => row.SpaceNum); // Array of SpaceNums

    connection.query('SELECT NumberOfSpaces FROM carpark WHERE CarParkID = ?', [CarParkID], (error, results, fields) => {
      if (error) {
        return callback(error, null);
      }

      const NumOfSpaces = results[0].NumberOfSpaces;
  
      const allSpaces = Array.from({ length: NumOfSpaces }, (_, i) => i + 1);
      const availableSpaces = allSpaces.filter(space => !spaceNums.includes(space));

      callback(null, availableSpaces);
    });
  });
}

const formatDateTimeForMySQL = (isoString) => {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = (`0${date.getMonth() + 1}`).slice(-2); // Months are zero-indexed
  const day = (`0${date.getDate()}`).slice(-2);
  const hours = (`0${date.getHours()}`).slice(-2);
  const minutes = (`0${date.getMinutes()}`).slice(-2);
  const seconds = (`0${date.getSeconds()}`).slice(-2);
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

module.exports = router;