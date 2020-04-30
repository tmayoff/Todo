require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var passport = require('./services/passport');
var flash = require('connect-flash');
var sass = require('node-sass');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var listsRouter = require('./routes/lists');

var app = express();

sass.renderSync({
  file: "./scss/custom.scss",
  outFile: "./public/stylesheets"
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("THIS_IS_A_SECRET"));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/scripts', express.static(__dirname + '/node_modules/bootstrap/dist/js'));

// session
app.use(session({
  secret: "THIS_IS_A_SECRET",
  resave: true,
  saveUninitialized: true
}));
app.use(flash());

// passport
app.use(passport.initialize());
app.use(passport.session());


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/lists', listsRouter);

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
