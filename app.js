require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var passport = require('./services/passport');
var flash = require('connect-flash');
var redis = require('redis');

let RedisStore = require('connect-redis')(session);
let redisClient = redis.createClient();

// Routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var listsRouter = require('./routes/lists');
var taskRouter = require('./routes/task');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("THIS_IS_A_SECRET"));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/scripts', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/scripts', express.static(__dirname + '/node_modules/jquery/dist/jquery.min.js'));

// session
app.use(session({
  secret: "THIS_IS_A_SECRET",
  resave: true,
  saveUninitialized: true,
  store: new RedisStore({client, redisClient})
}));
app.use(flash());

// passport
app.use(passport.initialize());
app.use(passport.session());


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/lists', listsRouter);
app.use('/task', taskRouter);

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
