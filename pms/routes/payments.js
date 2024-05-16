var express = require('express');
var router = express.Router();
const paymodel = require("../../model/payments");

var nodemailer = require ('nodemailer');

var transporter = nodemailer.createTransport  ({
  service: 'gmail',
  auth: {
    user: 'mackenzieh331@gmail.com',
    pass: 'auym plvp zjoj revc'
  }
});

var mailOptions = { 
  from: 'mackenzieh331@gmail.com',
  to: 'mackenzieh331@gmail.com',
  subject: 'Parking Notification',
  text: ('Your transaction was completed! Thank you.')
};



router.get('/', function(req, res, next) {
 
    res.render("payments", {title: "payments"})
  });

module.exports = router;


router.post('/', (req, res, next)=> {
  const credit = req.body.credit;
  paymodel.addBal(credit);
  transporter.sendMail(mailOptions, function(error,info){
    if (error)  {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
  res.render('payments');  
  });