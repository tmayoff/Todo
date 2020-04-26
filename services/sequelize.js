const { Sequelize}  = require('sequelize');
const sequelize = new Sequelize({
	dialect: 'mariadb',
	host: process.env.DB_HOST,
	port: 32777,
	database: process.env.DB_NAME,
	username: process.env.DB_USER,
	password: process.env.DB_PASS
});

sequelize.authenticate()
.then(() => {
	console.log("Authenticated");
}).catch(err => {
	console.error(err);
})

module.exports = sequelize;