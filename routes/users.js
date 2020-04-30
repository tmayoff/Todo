var express = require('express');
var passport = require('../services/passport');
var Models = require('../models/models');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', (req, res, next) => {
  res.render('auth/register', {messages: req.flash('error')});
});

router.post('/register', (req, res, next) => {
  let user = req.body.username;
  let email = req.body.email;
  let password = req.body.password;

  // TODO server side validation

  let pass = Models.hashPassword(password);
  Models.User.create({
    username: user,
    email,
    hash: pass.hash,
    salt: pass.salt,
    iterations: pass.iterations
  })
  .then(() => {
    res.redirect('/users/login');
  })
  .catch(err => {
    return next(err);
  });
});

router.get('/login', (req, res, next) => {
  res.render('auth/login', {messages: req.flash('error')});
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/', 
  failureRedirect: '/users/login', 
  failureFlash: true}),
  (req, res, next) => {});

module.exports = router;
