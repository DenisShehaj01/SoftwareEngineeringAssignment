var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
 
    res.render("payments", {title: "payments"})
  });

module.exports = router;
