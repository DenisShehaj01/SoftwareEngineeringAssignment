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
    subject: 'Departure Notification',
    text: ('Notification: A user has departed from the parking lot. Spot 5 is now available.')
  };  

router.get('/', function(req, res, next) {
 
    res.render("notifyadmindeparture", {title: 'Departure'})
  });

module.exports = router;

router.post('/', (req, res, next)=> {
    console.log("Departed");
    transporter.sendMail(mailOptions, function(error,info){
        if (error)  {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    res.render('notifyadmindeparture');  
    });
  