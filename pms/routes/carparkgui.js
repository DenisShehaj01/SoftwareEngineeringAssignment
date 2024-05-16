var express = require('express');
var router = express.Router();
const util = require('util');
const connection = require('../modules/CarPark.js')

// Handle GET request for sendrequest.pug
// router.get('/', function(req, res, next) {
//     console.log("hello2");
//     res.render('carparkgui', { title: 'View Car Park' }); 
// });

router.get('/', async (req, res) => {
    connection.query('SELECT CarParkID, Name, NumberOfSpaces, NumberOfFreeSpaces FROM carpark', (error, carparks, fields) => {
        res.render('carparkgui', { title: 'View Car Park', carparks: carparks });
        //console.log(carparks);
    });
});

//Handle get requests for parking space availability
router.get('/space-availability/:CarParkID/:spaceId', async (req, res) => {
    const { CarParkID, spaceId } = req.params;
    const status = await getSpaceStatus(CarParkID, spaceId);
    res.json({ status });
});


//Handle add carpark requests
router.post('/addcarpark', function(req, res) {
    const { CarParkName, numSpaces } = req.body;
    console.log(CarParkName,numSpaces);
    if (!CarParkName || numSpaces <= 0) {
      return res.status(400).send('Invalid input');
    }
    console.log(CarParkName);
    const query = 'INSERT INTO carpark (Name, NumberOfSpaces) VALUES (?, ?)';
    connection.query(query, [CarParkName, parseInt(numSpaces, 10)]);
    res.redirect('/carparkgui');
  });
//handle delete carpark requests
  router.delete('/carpark/:name', async (req, res) => {
      const {name} = req.params
        //const result = await CarPark.deleteOne({ _id: req.params.id });
      const query = 'DELETE from carpark WHERE Name = ?';
      connection.query(query,[name]);
      console.log("deleting",name);
  });

async function getSpaceStatus(CarParkId, spaceId) {
  connection.query = util.promisify(connection.query);
  const sqlfetch = 'SELECT SpaceNum, CarParkID FROM space WHERE CarParkID = ? AND SpaceNum = ?';
  try {
      const results = await connection.query(sqlfetch, [CarParkId, spaceId]);
      if (results.length > 0) {
          console.log('Space ID exists:', results);
          return 'blocked';
      } else {
          //console.log("data given:", CarParkId, spaceId, "Data received:", results);
          return 'available';
      }
  } catch (error) {
      console.error(error.message);
      throw error;  // Rethrow or handle error appropriately
  }
}

module.exports = router;
// NEEDS DOING: //
//1. Take inputs and put them into database
//2. Make Grid gui show blocked(or red colour and/or remove drop down menu ) spaces [this is gnna be aids probably]
//3. Add times to database and implement functionality for times (start of parking time, parking time experation)
//4. Add random space allocation
