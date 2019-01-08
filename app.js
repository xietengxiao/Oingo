var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var ejs=require("ejs");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var homepageRouter = require('./routes/homepage');
var tagRouter = require('./routes/tag');
var friendRouter = require('./routes/friends');

var notesRouter = require('./routes/notes');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


var session=require("express-session");
var cookieParser=require("cookie-parser");
app.use(cookieParser());//这里要加()
app.use(session({
    secret: "12345",
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge:60000*1000}
}));
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET,POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}
app.use(allowCrossDomain);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/homepage', homepageRouter);
app.use('/tag', tagRouter);
app.use('/friends', friendRouter);
app.use('/notes', notesRouter);




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
