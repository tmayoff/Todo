var express = require('express');
var auth = require('../services/auth');
var Models = require('../models/models');

var router = express.Router();

router.put('/:id', (req, res, next) => {
	Models.Task.update(req.body, {
		where: {
			id: req.params.id
		}
	}).then(() => {
		res.send(200);
	}).catch(() => {
		res.send(400)
	});
});

module.exports = router;