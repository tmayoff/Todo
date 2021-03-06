var express = require('express');
var auth = require('../services/auth');
var Models = require('../models/models');
var sequelize = require('../services/sequelize');

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
		normalized_name: req.body.name.toLowerCase().replace(" ", "_"),
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

	let taskPromise;
	let listPromise = Models.List.findOne({
		where: {
			UserId: req.user.id,
			normalized_name: req.params.list
		}
	})

	Promise.all([listsPromise, listPromise, taskPromise])
	.then((results) => {
		list = results[1];
		Models.Task.findAll({
			where: {
				listId: list.id,
			},
			order: [
				[list.sort.split(',')[0], list.sort.split(',')[1]]
			]
		}).then(tasks => {
			res.render('lists/index', {user: req.user, list: results[1], lists: results[0], tasks});
		})

	}).catch(err => {
		return next(err);
	});

});

router.put('/:listId', auth.isAuthenticated, (req, res, next) => {
	Models.List.update(req.body, {
			where: {
				id: req.params.listId
			}
		})
	.then(() => {
		res.send(200);
	}).catch((err) => {
		res.send(500);
	})
});

module.exports = router;