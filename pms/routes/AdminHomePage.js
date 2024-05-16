var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('AdminHomePage', { title: 'This is the Home Page' });
});

module.exports = router;
