var mongoose = require('mongoose'),
    LocalStrategy = require('passport-local').Strategy,
    User = mongoose.model('User'),
    uService = require('../services/user'),
    config = require('./config'),
    Q = require('q');

module.exports = function(passport) {
  // serialize sessions
  passport.serializeUser( function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser( function(id, done) {
    User.findOne({_id: id, deleted: {$ne: true}}, '-salt -hashed_password', function(err, user) {
      done(err, user);
    });
  });

  // use local strategy
  passport.use( new LocalStrategy({usernameField: 'email', passwordField: 'password'}, function(email, password, done) {
    User.findOne({email: uService.findByEmailRegex(email)}, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, {message: 'Unknown user'});
      }

      // check password
      if (!user.authenticate(password)) {
        return done(null, false, {message: 'Invalid password'});
      }
      return done(null, user);
    });
  }));
};
