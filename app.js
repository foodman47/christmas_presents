
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

// Database
var mongo = require('mongodb');
var monk = require('monk');
var db;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var doneRouter = require('./routes/done');

var app = express();

// create session id
app.use(session({
    secret: '34SDgsdgspxxxxxxxdfsG', // just a long random string
    resave: false,
    saveUninitialized: true
}));

// get sessionID if needed
app.get('/getuser', function(req,res) {
  res.send({"sessionID": req.sessionID});
});

// call python script to draw names
app.get('/draw', function (req, res) {
  var spawn = require("child_process").spawn;
  // sessionID
  var id = req.sessionID;
  // spawn child process
  var process = spawn('python', ["./draw.py",id]);
  process.stdout.on('data', function(data) {
    // res.send(data);
    res.redirect("/done");
  });
} );

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Make our db accessible to our router
app.use(function(req,res,next){
    db = monk('localhost:27017/' +req.sessionID);
    req.db = db;
    next();
});

// router settings
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/done', doneRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// let static middleware do its job
app.use(express.static(__dirname + '/public'));

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
