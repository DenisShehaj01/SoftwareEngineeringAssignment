var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
 
  res.render("login", {title: 'Login'})
});

module.exports = router;


router.post('/', (req, res, next)=> {
const username = req.body.username;
const password = req.body.password;
if (username == "user1" && password == 'hello')  {
  res.render('user');
}
else  {
  res.render('login', {error: true});
}


});

router.post('/', (req, res, next)=> {
  const username = req.body.username;
  const password = req.body.password;
  
  let loginResult = usermodel.checkloginDetails(username, password);
  if (loginResult)  {
    res.render("login", {title: 'Welcome: ', name: username});
  }
  else {
    res.render('login', {error: true});
  }

});

module.exports = router;