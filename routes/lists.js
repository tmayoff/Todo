var express = require('express');
var auth = require('../services/auth');
var router = express.Router();

router.get('/', auth.isAuthenticated, (req, res, next) => {

});

router.get('/new', auth.isAuthenticated, (req, res, next) => {
	res.send("NEW");
});

module.exports = router;