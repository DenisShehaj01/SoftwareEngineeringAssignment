var express = require('express');
var router = express.Router();
const util = require('util');
const connection = require('../modules/CarPark.js')
//get lists of blocked and reserved spaces
router.get('/', async function(req, res, next) {
  connection.query = util.promisify(connection.query);
  const SelectReservedSpaces = 'SELECT CarParkID, SpaceNum from space WHERE Availability = "Reserved"';
  const ReservedSpaces = await connection.query(SelectReservedSpaces);
  const ReservedSpacesArray = ReservedSpaces.map(row => [row.CarParkID, row.SpaceNum]);

  console.log("Reserved Spaces: "+ReservedSpacesArray);

  const SelectBlockedSpaces = 'SELECT CarParkID, SpaceNum from space WHERE Availability = "Blocked"'; 
  const BlockedSpaces = await connection.query(SelectBlockedSpaces);
  const BlockedSpacesArray = BlockedSpaces.map(row => [row.CarParkID, row.SpaceNum]);

  console.log("Blocked Spaces: "+BlockedSpacesArray)

  const SelectCarParks = 'SELECT Name, CarParkID, NumberOfSpaces from carpark';
  const CarParks = await connection.query(SelectCarParks);
  const CarParkArray = CarParks.map(row => [row.CarParkID, row.Name,row.NumberOfSpaces]);

  console.log("CarParks: "+CarParkArray)

  res.render('settings', { title: 'Admin Settings',CarParkArray, ReservedSpacesArray, BlockedSpacesArray }); 
    
});

router.post('/block', async function(req, res, next) {
  console.log(req.body)
  // Store form data in variables
  // add check to see if carpark is full
  const carParkID = req.body.carParkName;
  const spaceNumberKey = `spaceNumber${carParkID}`;
  const spaceNumber = req.body[spaceNumberKey];
  console.log(`Car Park ID: ${carParkID}, Space Number: ${spaceNumber}`);
  const CheckIfExists = 'SELECT SpaceNum from space WHERE SpaceNum = ? and CarParkID = ?';
  const exists = await connection.query(CheckIfExists,[spaceNumber,carParkID]);
  if (!exists.length){
    //If doesnt already exist, insert space into db and set Availability to blocked
    const insert = 'INSERT INTO space (CarParkID, SpaceNum, Availability) VALUES (?, ?, ?)';
    const insertspace = await connection.query(insert,[carParkID,spaceNumber,"Blocked"]);
    console.log("Space:" + spaceNumber + " created");
  }
  else{
    //If already exists, change Availability to "blocked"
    const update = 'UPDATE space SET Availability = "Blocked" WHERE SpaceNum = ?;'
    const updatespace = await connection.query(update,[spaceNumber]);
    console.log("Existing Space: "+spaceNumber+" Updated to Blocked")
  }
  res.redirect("/settings");
  });


  router.post('/reserve', async function(req, res, next) {
    console.log(req.body)
    // Store form data in variables
    // add check to see if carpark is full
    const carParkID = req.body.carParkName;
    const spaceNumberKey = `spaceNumber${carParkID}`;
    const spaceNumber = req.body[spaceNumberKey];
    console.log(`Car Park ID: ${carParkID}, Space Number: ${spaceNumber}`);
    const CheckIfExists = 'SELECT SpaceNum from space WHERE SpaceNum = ? and CarParkID = ?';
    const exists = await connection.query(CheckIfExists,[spaceNumber,carParkID]);
    if (!exists.length){
      //If doesnt already exist, insert space into db and set Availability to blocked
      const insert = 'INSERT INTO space (CarParkID, SpaceNum, Availability) VALUES (?, ?, ?)';
      const insertspace = await connection.query(insert,[carParkID,spaceNumber,"Reserved"]);
      console.log("Space:" + spaceNumber + " created");
    }
    else{
      //If already exists, change Availability to "blocked"
      const update = 'UPDATE space SET Availability = "Reserved" WHERE SpaceNum = ?;'
      const updatespace = await connection.query(update,[spaceNumber]);
      console.log("Existing Space: "+spaceNumber+" Updated to Reserved")
    }
    res.redirect("/settings");
    });


    router.post('/unblock', async function(req, res, next) {
      console.log(req.body)
      const carParkID = req.body.carParkName;
      const spaceNumberKey = `spaceNumber${carParkID}`;
      const spaceNumber = req.body[spaceNumberKey];
      const update = 'UPDATE space SET Availability = "Available" WHERE SpaceNum = ?;'
      const updatespace = await connection.query(update,[spaceNumber]);
      console.log("Existing Space: "+spaceNumber+" Updated to Available")
      res.redirect("/settings");
    });


module.exports = router;
