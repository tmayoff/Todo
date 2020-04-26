var express = require('express');
var auth = require('../services/auth');
var router = express.Router();

/* GET home page. */
router.get('/', auth.isAuthenticated, function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
