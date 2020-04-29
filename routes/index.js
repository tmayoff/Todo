var express = require('express');
var auth = require('../services/auth');
var Models = require('../models/models');
var router = express.Router();

/* GET home page. */
router.get('/', auth.isAuthenticated, function(req, res, next) {
  lists = Models.List.findAll({

  });
  res.render('index', { title: 'Express' });
});

module.exports = router;
