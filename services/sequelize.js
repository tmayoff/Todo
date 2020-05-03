const { Sequelize}  = require('sequelize');
var tunnel = require('tunnel-ssh');
var fs = require('fs');

const sequelize = new Sequelize({
	dialect: 'mariadb',
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	database: process.env.DB_NAME,
	username: process.env.DB_USER,
	password: process.env.DB_PASS,
	logging: false,
	timezone: "Etc/GMT+4",
	
	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000
	}
});

if (process.env.SSH_HOST) {
	let sshServer = tunnel({
		username: process.env.SSH_USER,
		password: process.env.SSH_PASS,
		host: process.env.SSH_HOST,
		port: process.env.SSH_PORT,
		
		localPort:3306,

		dstHost: "127.0.0.1",
		dstPort: 3306,
	}, (err, srv) => {
		if (err) {
			return console.error(err);
		}

		sequelize.authenticate()
		.then(() => {
			console.log("Authenticated");
		}).catch(err => {
			console.error(err);
		});
	});

	sshServer.on('error', (err) => {
		console.error(err)
	});
} else {
	sequelize.authenticate()
	.then(() => {
		console.log("Authenticated");
	}).catch(err => {
		console.error(err);
	});
}

module.exports = sequelize;