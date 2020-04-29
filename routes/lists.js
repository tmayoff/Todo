var express = require('express');
var auth = require('../services/auth');
var Models = require('../models/models');

var router = express.Router();

router.get('/', auth.isAuthenticated, (req, res, next) => {

});

router.get('/new', auth.isAuthenticated, (req, res, next) => {
	res.render('lists/new');
});

router.post('/new', auth.isAuthenticated, (req, res, next) => {
	Models.List.create({
		name: req.body.name,
		color: req.body.color
	}).then(() => {
		res.redirect('/');
	}).catch(err => {
		next(err);
	});
});

module.exports = router;