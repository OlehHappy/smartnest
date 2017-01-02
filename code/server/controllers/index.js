/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    config = require('../config/config'),
    _ = require('underscore');

exports.render = function(req, res) {
  res.render('index', {
    user: req.user ? JSON.stringify(req.user) : "null",
    base_url: config.app.base_url,
    appConfig: JSON.stringify({
      version: version
    })
  });
};


/* redirection from invitation emails */
exports.register = function(req, res) {
  return res.redirect(301, config.app.protocol + '://' + config.app.host_name + '#!/signup');
};
