/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    paymentService = require('../services/payments'),
    User = mongoose.model('User'),
    Contract = mongoose.model('Contract'),
    config = require('../config/config'),
    _ = require('underscore'),
    Q = require('q');


/**
 * Find Contract by id
 */
exports.contract = function(req, res, next, id) {
  Contract.findById(id).exec().then( function(contract) {
    if (!contract) {
      return next(new Error('Failed to load contract ' + id));
    }

    req.contract = contract;
    next();
  }, next);
};


exports.getResidentContract = function(req, res, next) {
  Contract
    .find({resident: req.user._id, deleted: {$ne: true}})
    .lean().exec()
    .then( function(contracts) {
      res.jsonp(contracts);
    }, next);
};


exports.createResidentContract = function(req, res, next) {
  var contract = new Contract(req.body);
  contract.resident = req.user._id;

  Q.ninvoke(contract, 'save').then( function() {
    res.jsonp(201, contract);
  }, next);
};


exports.updateResidentContract = function(req, res, next) {
  if (!req.contract.resident.equals(req.user._id) && req.user.role !== 'ADMIN') {
    return next(new Error("You can't update someone else's contract."));
  }

  var updates = _.pick(req.body, 'address', 'landlord', 'rent_amount', 'rent_day', 'recurring');
  req.contract.merge(updates);

  Q.ninvoke(req.contract, 'save').then( function() {
    res.jsonp(req.contract);
  }, next);
};


/**
 * Create a Contract
 */
exports.create = function(req, res, next) {
  var contract = new Contract(req.body);

  // Contract request from Renters are not Verified
  contract.verified = req.user.role !== 'user';

  Property.findById(contract.property).exec().then( function(property) {
    if (property.locked) {
      throw new Error('You can\'t create a new contract in a locked property.');
    }
    if (property.deleted) {
      throw new Error('You can\'t create a new contract in a deleted property.');
    }

    contract.rent_day = property.rent_day;
    contract.rent_late_delay = property.rent_late_delay;
    contract.rent_late_fee = property.rent_late_fee;

    return Q.ninvoke(contract, 'save');
  }).then( function() {
    return Contract.populate(contract, 'resident');
  }).then( function(contract) {
    return res.jsonp(201, contract);
  }, next);
};


/**
 * Update a Contract
 */
exports.update = function(req, res, next) {
  req.contract.merge(req.body);
  Q.ninvoke(req.contract, 'save').then( function() {
    res.jsonp(req.contract);
  }, next);
};


/**
 * Delete a Contract
 */
exports.delete = function(req, res, next) {
  req.contract.deleted = true;
  Q.ninvoke(req.contract, 'save').then( function() {
    res.send(200);
  }, next);
};


/**
 * Show a Contract
 */
exports.show = function(req, res, next) {
  Contract.populate(req.contract, 'resident').then( function(contract) {
    res.jsonp(contract);
  }, next);
};
