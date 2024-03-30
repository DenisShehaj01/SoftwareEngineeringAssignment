var express = require('express');
var router = express.Router();
const usermodel = require("../../model/users"); //**  you may need to change file path to absolute instead of relative


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('create', { title: 'New Account' });
});

module.exports = router;

router.post('/', (req, res, next)=> {
  const username = req.body.username;
  const password = req.body.password;
  usermodel.addNewUser(username, password);
  res.render('login')

});