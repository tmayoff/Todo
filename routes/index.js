var express = require('express');
var auth = require('../services/auth');
var Models = require('../models/models');
var router = express.Router();

/* GET home page. */
router.get('/', auth.isAuthenticated, function(req, res, next) {
  Models.List.findAll({
    where: {
      UserId: req.user.id
    }
  })
  .then(lists => {
    res.render('index', { title: 'Express', lists });
  })
  .catch(err => {
    return next(err);
  });
});

module.exports = router;
