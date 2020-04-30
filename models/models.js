const { Sequelize, Model, Datatypes }  = require('sequelize');
var crypto = require('crypto');
var sequelize = require('../services/sequelize');

// ---- Task ----- //
class Task extends Model {}
Task.init({
	id: {
		type: Sequelize.UUID,
		defaultValue: Sequelize.UUIDV4,
		primaryKey: true
	}, 
	name: Sequelize.STRING,
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
	iterations: Sequelize.INTEGER
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
Task.belongsTo(List);

sequelize.sync({ alter:true });

module.exports.List = List;
module.exports.User = User;
module.exports.Task = Task;
module.exports.hashPassword = hashPassword;
module.exports.validatePassword = validatePassword;