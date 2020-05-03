const { Sequelize, Model, Datatypes }  = require('sequelize');
var crypto = require('crypto');
var sequelize = require('../services/sequelize');

var months = ["Jan.", "Feb", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
var days = ["Sun.", "Mon.", "Tue.", "Wed.", "Thu.", "Fri.", "Sat." ]

/**
 * 
 * @param {Date} date The date to format
 * @param {Boolean} useTime add the time to format as well
 * @param {Boolean} twelveHour Use 12-hour format or not
 */
function formateDate(date, useTime, twelveHour) {
	let dayOfWeek = days[date.getDay()];
	let dayOfMonth = date.getDate();
	let month = months[date.getMonth()];
	let year = date.getFullYear();

	let format = dayOfWeek + "" + month + ", " + dayOfMonth + ", " + year
	if (useTime) {
		let hours = date.getHours();
		if (twelveHour && hours > 12) {
			hours -= 12;
		}

		let minutes = ("0" + date.getMinutes()).slice(-2);
		format += " at " + hours + ":" + minutes;
	}

	return format
}

// ---- Task ----- //
class Task extends Model {}
Task.init({
	id: {
		type: Sequelize.UUID,
		defaultValue: Sequelize.UUIDV4,
		primaryKey: true
	}, 
	name: Sequelize.STRING,
	normalized_name: Sequelize.STRING,
	dueDate: Sequelize.DATE,
	dueDateFormatted: {
		type: Sequelize.VIRTUAL,
		get() {
			let date = new Date(this.dueDate);
			let past = date < new Date();
			return {
				past, 
				date: formateDate(date, true, true)
			};
		}
	},
	complete: Sequelize.BOOLEAN
	
}, {
	sequelize,
	modelName: "Task"
});

// ---- List ----- //
class List extends Model {}
List.init({
	id: {
		type: Sequelize.UUID,
		defaultValue: Sequelize.UUIDV4,
		primaryKey: true
	},

	name: Sequelize.STRING,
	normalized_name: Sequelize.STRING,
	color: Sequelize.STRING
}, {
	sequelize,
	modelName: "List"
});


// ---- Users ----- //
class User extends Model {}
User.init({
	id: {
		type: Sequelize.UUID,
		defaultValue: Sequelize.UUIDV4,
		primaryKey: true
	},
	username: Sequelize.STRING,
	email: Sequelize.STRING,
	verified: Sequelize.BOOLEAN,
	hash: Sequelize.STRING(512),
	salt: Sequelize.STRING(512),
	iterations: Sequelize.INTEGER,
	valid: {
		type: Sequelize.BOOLEAN,
		defaultValue: false
	}
},{
	sequelize,
	modelName: "User"
});

function hashPassword (password) {
	var salt  = crypto.randomBytes(128).toString('hex');
	var iterations = 10000;
	var hash = crypto.pbkdf2Sync(password, salt, iterations, 32, 'sha512').toString('hex');

	return {
		hash,
		salt,
		iterations
	};
}

/**
 * 
 * @param {User} user The user to validate
 * @param {string} password The password to validate 
 */
function validatePassword(user, password) {
	let hash = crypto.pbkdf2Sync(password, user.salt, user.iterations, 32, 'sha512').toString('hex');
	return user.hash == hash;
}

User.hasMany(List);
List.belongsTo(User);
List.hasMany(Task);
Task.belongsTo(List, {
	onDelete: 'CASCADE'
});

sequelize.sync({ alter:true });

module.exports.List = List;
module.exports.User = User;
module.exports.Task = Task;
module.exports.hashPassword = hashPassword;
module.exports.validatePassword = validatePassword;