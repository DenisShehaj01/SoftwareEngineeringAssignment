var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "admin",
  database: "CarParks"
});

connection.connect(function(err){
  if(err) throw err;
  console.log("Connected to Car Park database!");

});

module.exports = connection;