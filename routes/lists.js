var express = require('express');
var auth = require('../services/auth');
var Models = require('../models/models');

var router = express.Router();

router.delete('/delete/:id', auth.isAuthenticated, (req, res, next) => {
	if (!req.params.id) {
		return res.send(400);
	}

	Models.List.destroy({
		where: {
			id: req.params.id
		},
		cascade: true,
	}).then (() => {
		res.send(200);
	}).catch(err => {
		next (500);
	});
});

router.get('/new', auth.isAuthenticated, (req, res, next) => {
	res.render('lists/new');
});

router.post('/new', auth.isAuthenticated, (req, res, next) => {
	Models.List.create({
		name: req.body.name,
		color: req.body.color.toLowerCase(),
		UserId: req.user.id
	}).then(() => {
		res.redirect('/');
	}).catch(err => {
		next(err);
	});
});

router.get('/edit/:id', auth.isAuthenticated, (req, res, next) => {
	Models.List.findOne({
		where: { 
			id: req.params.id
		}
	}).then(list => {
		res.render('lists/edit', {list});
	}).catch(err => {
		next(err);
	});
});

router.post('/edit/:id', auth.isAuthenticated, (req, res, next) => {
	Models.List.update({
		name: req.body.name,
		color: req.body.color
	}, {
		where: {
			id: req.params.id
		}
	}).then (() => {
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
		res.render('lists/index', {user: req.user, list: req.params.list, lists: results[0], tasks: results[1].Tasks });
	}).catch(err => {
		return next(err);
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