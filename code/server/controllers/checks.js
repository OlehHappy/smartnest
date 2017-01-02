/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  config = require('../config/config'),
  lob = require('../services/lob'),
  Q = require('q'),
  _ = require('lodash'),
  errors = require('../config/errors');



exports.verifyAddress = function(req, res, next) {
  lob.verifyAddress(
    req.body.street,
    req.body.unit,
    req.body.city,
    req.body.state,
    req.body.postal
  ).then( function(response) {
    res.jsonp(response);
  }).catch( function(err) {
    if (err.message) {
      return res.jsonp(err);
    }
    next(err);
  });
};
