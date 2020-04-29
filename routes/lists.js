var express = require('express');
var auth = require('../services/auth');
var Models = require('../models/models');

var router = express.Router();

router.get('/new', auth.isAuthenticated, (req, res, next) => {
	res.render('lists/new');
});

router.post('/new', auth.isAuthenticated, (req, res, next) => {
	Models.List.create({
		name: req.body.name,
		color: req.body.color,
		UserId: req.user.id
	}).then(() => {
		res.redirect('/');
	}).catch(err => {
		next(err);
	});
});

router.get('/:list', auth.isAuthenticated, (req, res, next) => {
	let listsPromise = Models.List.findAll({
		where: {
			UserId: req.user.id
		}
	});

	let listPromise = Models.List.findOne({
		where: {
			UserId: req.user.id,
			name: req.params.list
		},
		include: [Models.Task]
	});

	Promise.all([listsPromise, listPromise])
	.then((results) => {
		console.log(results);

		res.render('lists/index', {list: req.params.list, lists: results[0], tasks: results[1].Tasks });
	}).catch(err => {
		console.error (err);
	});

});

router.get('/:list/new', auth.isAuthenticated, (req, res, next) => {
	Models.List.findOne({
		where: {
			UserId: req.user.id,
			name: req.params.list
		}
	}).then(list => {
		res.render('tasks/new', {listId: list.id});
	}).catch(err => {
		return next(err);
	});
});

router.post('/:list/new', auth.isAuthenticated, (req, res, next) => {
	Models.Task.create({
		name: req.body.name,
		ListId: req.body.list
	}).then(() => {
		res.redirect('/lists/' + req.params.list);
	}).catch(err => {
		return next(err);
	})
});


module.exports = router;