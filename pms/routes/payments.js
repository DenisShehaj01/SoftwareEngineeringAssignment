var express = require('express');
var router = express.Router();
const paymodel = require("../../model/payments");

router.get('/', function(req, res, next) {
 
    res.render("payments", {title: "payments"})
  });

module.exports = router;


router.post('/', (req, res, next)=> {
  const credit = req.body.credit;
  paymodel.addBal(credit);
  res.render('payments');  
  });