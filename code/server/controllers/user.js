/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    config = require('../config/config'),
    Contract = mongoose.model('Contract'),
    User = mongoose.model('User'),
    uService = require('../services/user'),
    _ = require('underscore'),
    Q = require('q'),
    nodemailer = require('nodemailer'),
    crypto = require('crypto');


/**
 * Auth callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect(config.app.base_url + '#!/');
};


/**
 * Logout
 */
exports.signout = function(req, res) {
  req.logout();
  res.jsonp({});
};


/**
 * !!!!!!!!!!!!!!!!!!! IMPORTANT !!!!!!!!!!!!!!!!!!!!!
 * !!!!!! only ADMIN can USE this endpoint !!!!!!
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 */
exports.forceUserLogin = function(req, res, next) {
  if (req.user.role !== 'ADMIN') {
    return next(new Error('Only a Admin can use this'));
  }

  req.logIn(req.profile, function(err) {
    if (err) {
      return next(err);
    }
    return res.jsonp(req.profile);
  });
};


/**
 * Session
 */
exports.session = function(req, res) {
  // update of 'last login' record
  req.user.last_login = new Date();
  Q.ninvoke(req.user, 'save').then( function(result) {
    return res.jsonp({user: req.user});

  }).fail( function(err) {
    return res.jsonp(500, {err: ""});
  });
};


/**
 * Current user
 */
exports.me = function(req, res, next) {
  return req.user ? res.jsonp(req.user) : res.send(404);
};


/**
 * Create user
 */
exports.create = function(req, res, next) {
  var user = new User(req.body);
  user.role = 'RESIDENT';

  user.save( function(err) {
    if (err) {
      return next(err);
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      return res.jsonp(201, user);
    });
  });
};


/**
 * Update personal info
 */
exports.updateProfile = function(req, res) {
  // pick only allowed attributes to change
  var updates = _.pick(req.body, 'first_name', 'last_name', 'email', 'password', 'phone');

  // unverify phone when user wants to change it
  if ('phone' in updates && updates.phone !== req.user.phone) {
    updates.phone_verified = false;
  }

  var user = _.extend(req.user, updates);

  user.save( function(err) {
    if (err) {
      return next(err);
    }
    res.jsonp(user);
  });
};


/**
 * set User's password during password reset
 */
exports.changePassword = function(req, res) {
  var password = req.body.password;
  var token = req.body.token;

  return Q.ninvoke(User, 'findOne', { reset_token: token }).then( function(user) {
    if (!user) {
      throw 'Invalid token';
    }

    user.password = password;
    return Q.ninvoke(user, 'save').then( function(result) {
      return Q.ninvoke(req, 'logIn', user);
    })
    .then( function(done) {
      res.jsonp({user: req.user});
    });

  }).fail( function(err) {
    return res.jsonp(500, {err: err});
  });
};


/**
 * change User's password
 */
var encryptPassword = function(password, salt) {
  if (!password) {
    return '';
  }
  return crypto.createHmac('sha1', salt).update(password).digest('hex');
};
exports.updatePassword = function(req, res) {
  var oldPassword = req.body.oldPassword;
  var password = req.body.password;
  console.log(req.body.userId);

  return Q.ninvoke(User, 'findOne', { _id: req.body.userId }).then( function(user) {

    var hashed_password = encryptPassword(oldPassword, user.salt);

    if (hashed_password !== user.hashed_password) {
      throw 'Wrong password';
    }
    user.password = password;
    return Q.ninvoke(user, 'save').then( function(result) {

    })
    .then( function(done) {
      res.jsonp({user: req.user});
    });

  }).fail( function(err) {
    return res.jsonp(500, {err: err});
  });
};


/**
 * send email in case of forgotten password
 */
exports.resetPassword = function(req, res) {
  var hashCode = function(s) {
    return s.split("").reduce( function(a,b) {a=((a<<5)-a)+b.charCodeAt(0);return a&a;}, 0);
  };

  var email = req.body.email;


  return Q.ninvoke(User, 'findOne', {email: uService.findByEmailRegex(req.body.email)}).then( function(user) {
    if (!user) {
      throw "We couldn't find an account for given email address.";
    }
    var reset_token = (new Date()).getTime().toString(36) + hashCode(user._id.toString()).toString(36);

    user.reset_token = reset_token;
    return Q.ninvoke(user, 'save').then( function(result) {
      return reset_token;
    });
  })
  .then( function(token) {
    var reset_url = config.app.protocol + "://" + config.app.host_name + config.app.base_url + "#!/reset/" + token;
    var email_to = config.app.email_redirect || email;
    var bcc_email = config.app.bcc_email;

    // debug console logs, send email
    //console.log("sending email to ", email_to);
    //console.log("url email will be: " + reset_url);

    // create reusable transport method (opens pool of SMTP connections)
    var smtpTransport = nodemailer.createTransport("SMTP", {
      service: config.email_sender_service,
      auth: {
        user: config.email_sender,
        pass: config.email_sender_password
      }
    });

    // setup e-mail data with unicode symbols
    var mailOptions = {
      from: config.email_sender_from, // sender address
      to: email_to,
      bcc: bcc_email,
      subject: "SmartNest.Pay password reset", // Subject line
      // email message
      text: "Please follow this link to SmartNest.Pay to change your password: " + reset_url // plaintext body
    };

    // send mail with defined transport object
    smtpTransport.sendMail(mailOptions, function(err, res) {
      if (err) {
        console.log('Cant send email. ' + err);
      } else {
        console.log('Email sent:', res.message);
      }

      // if you don't want to use this transport object anymore, uncomment following line
      smtpTransport.close(); // shut down the connection pool, no more messages
    });

    return res.jsonp('ok');
  })
  .fail( function(err) {
    res.jsonp(500, {err: err});
  });
};


/**
 * Find user by id
 */
exports.user = function(req, res, next, id) {
  User.findOne({_id: id, deleted: {$ne: true}}).exec( function(err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(new Error('Failed to load User ' + id));
    }
    req.profile = user;
    next();
  });
};


/**
 * Find one user by id
 */
exports.findOne = function(req, res) {
  res.jsonp(req.profile);
};


/**
 * Updates an User.
 */
exports.update = function(req, res) {
  var priorities = ['ADMIN', 'RESIDENT'];

  var priority = priorities.indexOf(req.user.role);
  User.load(req.body._id, function(err, user) {
    var userPriority = priorities.indexOf(user.role);

    if (priority === -1 || userPriority === -1) {
      return res.send(400);
    }

    if (req.user._id.toString() === user._id.toString() || priority < userPriority) {
      if (req.user.role !== 'ADMIN') {
        delete req.body.role;
      }

      user = _.extend(user, req.body);
      user.save( function(err) {
        if (err) {
          return res.send(400, err);
        }
        return res.jsonp(user);
      });
    } else {
      return res.send(403);
    }
  });
};


exports.checkUnique = function(req, res, next) {
  User.findOne({email: uService.findByEmailRegex(req.params.email)}).exec()
    .then( function(user) {
      if (!user) {
        return res.send(200);
      }
      return res.send(409);
    });
};
