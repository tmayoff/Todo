var express = require('express');
var auth = require('../services/auth');
var Models = require('../models/models');

var router = express.Router();

router.get('/new', auth.isAuthenticated, (req, res, next) => {
	Models.List.findOne({
		where: {
			userId: req.user.id,
			normalized_name: req.query.list
		}
	}).then (list => {
		res.render('tasks/new', {getDateInput, getTimeInput, listId: list.id});
	}).catch(err => next(err));
});

router.post('/new', auth.isAuthenticated, (req, res, next) => {
	let dueDate;
	if (req.body.reminder) {
		let date = req.body.dueDate[0].split('-');
		let time = req.body.dueDate[1].split(':');
		dueDate = new Date(date[0], date[1] - 1, date[2], time[0], time[1], 0, 0);
	}
	
	Models.Task.create({
		name: req.body.name,
		ListId: req.body.list,
		completed: false,
		dueDate
	}).then(() => {
		Models.List.findOne({
			where: {
				id : req.body.list
			}
		}).then((l) => {
			res.redirect('/lists/' + l.normalized_name);
		}).catch(err => next(err));
	}).catch(err => next(err));
});

router.get('/edit/:id', auth.isAuthenticated, (req, res, next) => {
	
	Models.Task.findOne({
		where: {
			id: req.params.id
		}
	}).then(task => {
		res.render('tasks/edit', {getDateInput, getTimeInput, task});
	}).catch(err => {
		next(err);
	});
});

router.post('/edit/:id', auth.isAuthenticated, (req, res, next) => {
	let date = req.body.dueDate[0].split('-');
	let time = req.body.dueDate[1].split(':');
	let dueDate = new Date(date[0], date[1] - 1, date[2], time[0], time[1], 0, 0);
	Models.Task.update({
		name: req.body.name,
		dueDate,
	}, {
		where: {
			id: req.params.id
		}
	}).then(() => {
		Models.List.findOne({
			where: {
				id : req.query.listId
			}
		}).then((l) => {
			res.redirect('/lists/' + l.normalized_name);
		}).catch(err => next(err));
	}).catch(err => {
		next(err);
	})
});

router.put('/:id', auth.isAuthenticated, (req, res, next) => {
	if(!req.params.id) {
		return res.send(400);
	}
	Models.Task.update({
		complete: req.body.complete
	}, {
		where: {
			id: req.params.id
		}
	}).then(() => {
		res.send(200);
	}).catch(() => {
		res.send(400)
	});
});

router.delete('/:id', auth.isAuthenticated, (req, res, next) => {
	if (!req.params.id) {
		return res.send(400);
	}

	Models.Task.destroy({
		where: {
			id: req.params.id
		}
	}).then(() => {
		res.send(200);
	}).catch(err => {
		res.send({
			code: 400,
			msg: err
		});
	});
});

/**
 * 
 * @param {Date} date 
 */
function getDateInput(date) {
	if (date == undefined) {
		date = new Date();
	}

	let month = ("0" + (date.getMonth() + 1)).slice(-2)
	let day = ("0" + date.getDate()).slice(-2)
	return date.getFullYear() + "-" + month + "-" + day
}

/**
 * 
 * @param {Date} date 
 */
function getTimeInput(date) {
	if (date == undefined) {
		date = new Date();
	}
	
	let hours = ("0" + date.getHours()).slice(-2);
	let minutes = ("0" + date.getMinutes()).slice(-2);
	return hours + ":" + minutes;
}

module.exports = router;