var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Model = require('../models/models');

passport.use(new LocalStrategy((username, password, done) => {
	Model.User.findOne({
		where: {
			username: username
		}
	}).then((user) => {
		if (!user) {
			return done(null, false, {message: "Username or password is invalid"});
		}

		if(Model.validatePassword(user, password)) {
			return done(null, user);
		} else {
			return done(null, false, {message: "Username or password is invalid"});
		}
	}).catch (err => {
		return done(err, null);
	})
}
));

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	Model.User.findOne({
		where: {
			id:id
		}
	}).then((user) => {
		return done(null, user);
	}).catch(err => {
		return done(err, null);
	});
});

module.exports = passport;