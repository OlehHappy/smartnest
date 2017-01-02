var config = require('../config');

/**
 * Generic require login routing middleware
 */
exports.requiresLogin = function(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.send(401, 'You have to be logged for this action.');
  }
  next();
};


/**
 * Generic require roles routing middleware
 */
exports.requireRoles = function(roles) {
  return function (req, res, next) {
    if (!req.isAuthenticated()) {
      return res.send(401, 'You have to be logged for this action.');
    }
    if (roles.indexOf(req.user.role) === -1) {
      return res.send(403, 'You are not authorized for this action.');
    }
    next();
  };
};


/**
 * User authorizations routing middleware
 */
exports.user = {
  hasAuthorization: function(req, res, next) {
    if ((req.user.role !== 'pm_admin') && (req.user.role !== 'admin') && (req.user.role !== 'pm')) {
      return res.send(401, 'You are not authorized for this action.');
    }
    next();
  }
};

/**
 * Property authorizations routing middleware
 */
exports.property = {
  hasAuthorization: function(req, res, next) {
    //TODO _id ???
    if (req.property.user.id != req.user.id && req.user.role != 'admin') {
      return res.send(401, 'You are not authorized for this action.');
    }
    next();
  }
};
