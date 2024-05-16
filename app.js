var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var login = require('./routes/login');
var profile = require('./routes/profile');
var settings = require('./routes/settings');
var create = require('./routes/create');
var payment = require('./routes/payments');
var notifyadminarrival = require('./routes/notifyadminarrival');
var notifyadmindeparture = require('./routes/notifyadmindeparture');
// var notifications = require('./routes/notifications'); // Remove this line
// var chat = require('./routes/chat'); // Remove this line

var chatRoutes = require('./routes/chat'); // Add this line to import the combined routes

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/login', login);
app.use('/profile', profile);
app.use('/settings', settings);
app.use('/create', create);
app.use('/payments', payment);
app.use('/notifyadminarrival', notifyadminarrival);
app.use('/notifyadmindeparture', notifyadmindeparture);
app.use('/', chatRoutes); // Use the combined routes

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

