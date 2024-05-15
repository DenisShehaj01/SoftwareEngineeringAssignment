var express = require('express');
var router = express.Router();
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
  subject: 'Arrival Notification',
  //text: ('Someone has arrived!")
};



router.get('/', function(req, res, next) {
 
  res.render("notifyadminarrival", {title: 'Arrival'})
});

module.exports = router;

router.post('/', (req, res, next)=> {
  console.log("Arrived");
  transporter.sendMail(mailOptions, function(error,info){
    if (error)  {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
  res.render('notifyadminarrival');  
  });
