/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  config = require('../config/config'),
  Contract = mongoose.model('Contract'),
  User = mongoose.model('User'),
  Transaction = mongoose.model('Transaction'),
  _ = require('lodash'),
  Q = require('q');


/* list of all Residents for "Residents" tab */
exports.getResidents = function(req, res, next) {
  var promises = [];

  User
    .find({role: 'RESIDENT', deleted: {$ne: true}}, {first_name: 1, last_name: 1, email: 1, last_login: 1, created_at: 1, phone: 1})
    .lean().sort({created_at: -1}).exec()
    .then( function(residents) {
      // add Contracts
      _.each(residents, function(resident) {
        promises.push( Contract.find({resident: resident._id, deleted: {$ne: true}}, {landlord: 1}).exec().then( function(contracts) {
          resident.contracts = contracts;
        }) );
      });

      return Q.all(promises).then( function() {
        res.jsonp(residents);
      });
    }, next);
};


/* Resident detail */
exports.getResident = function(req, res, next) {
  Contract.find({resident: req.profile._id}).exec().then( function(contracts) {
    var resident = req.profile.toObject();
    resident.contracts = contracts;
    res.jsonp(resident);
  }, next);
};


/* create new Resident with Contract */
exports.createResident = function(req, res, next) {
  var resident = new User(req.body.user);
  resident.role = 'RESIDENT';

  Q.ninvoke(resident, 'save').then( function() {
    var contract = new Contract(_.extend({resident: resident._id}, req.body.contract));
    return Q.ninvoke(contract, 'save');
  }).then( function() {
    res.jsonp(201, resident);
  }).catch( function(err) {
    if (err && err.code === 11000) {
      return res.send(409, 'Email is already in use.');
    }

    next(err);
  });
};


/* update Resident */
exports.updateResident = function(req, res, next) {
  // limit attributes for security reasons
  var updates = _.pick(req.body, 'email', 'password', 'phone', 'first_name', 'last_name', 'birth_date');

  _.extend(req.profile, updates);
  Q.ninvoke(req.profile, 'save').then( function(result) {
    return res.jsonp(result[0]);
  }, next);
};


/* delete Resident and his Contracts */
exports.delete = function(req, res, next) {
  Q.all([
    User.update({_id: req.profile._id}, { $set: {deleted: true, email: '#DELETED#' + req.profile.email} }).exec(),
    Contract.update({resident: req.profile._id}, {$set: {deleted: true}}, {multi: true}).exec(),
  ]).then( function() {
    res.send(200);
  }, next);
};


/* Resident's full profile list of Contracts */
exports.contracts = function(req, res, next) {
  Contract
    .find({resident: req.profile._id, deleted: {$ne: true}})
    .lean().exec()
    .then( function(contracts) {
      res.jsonp(contracts);
    }, next);
};


/* Resident's full profile payment history */
exports.ledger = function(req, res, next) {
  var query = Transaction.find({resident: req.profile._id, 'payment.status': {$in: ['PENDING', 'COMPLETED', 'REVERSED']} }).lean().sort({createdAt: -1});

  Q.ninvoke(query, 'exec').then( function(transactions) {
    res.jsonp(transactions);
  }, next);
};
