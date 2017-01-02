/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    config = require('../config/config'),
    Transaction = mongoose.model('Transaction'),
    Q = require('q'),
    _ = require('underscore'),
    braintree = require('../services/braintree'),
    lob = require('../services/lob'),
    errors = require('../config/errors');


// NOTE: manually trigger Cron job
exports.BTsettlementCutoff = function(req, res, next) {
  braintree.BTsettlementCutoff().then( function(transactions) {
    res.jsonp(transactions);
  }, next);
};

// NOTE: manually trigger Cron job
exports.LOBsendChecks = function(req, res, next) {
  lob.LOBsendChecks().then( function(checks) {
    res.jsonp(checks);
  }, next);
};


/**
 * Find transaction by id
 */
exports.transaction = function(req, res, next, id) {
  Transaction
    .findOne({_id: id})
    .populate('resident')
    .exec()
    .then( function(transaction) {
      if (!transaction) {
        return next(new Error('Failed to load transaction ' + id));
      }
      req.transaction = transaction;
      next();
    }, next);
};


/**
 * Show a Transaction
 */
exports.getTransaction = function(req, res) {
  res.jsonp(req.transaction);
};


/**
 * List of all Transactions
 */
exports.getTransactions = function(req, res, next) {
  Transaction
    .find({})
    .populate('resident')
    .sort({createdAt: -1})
    .lean().exec()
    .then( function(transactions) {
      res.jsonp(transactions);
    }, next);
};


exports.updateTransaction = function(req, res, next) {
  if (req.body.payment && req.body.payment.status !== req.transaction.payment.status) {
    req.transaction.setPaymentStatus(req.body.payment.status, 'Admin update payment status');
  }

  if (req.body.check && req.body.check.status !== req.transaction.check.status) {
    req.transaction.setCheckStatus(req.body.check.status, 'Admin update check status');
  }

  req.transaction.merge(req.body);

  Q.ninvoke(req.transaction, 'save').then( function() {
    res.jsonp(req.transaction);
  }, next);
};


/**
 * List of Transactions for given Contract
 */
exports.getContractTransactions = function(req, res, next) {
  if (String(req.contract.resident) !== String(req.user._id)) {
    return next(new HttpError(401, 'Not authorized'));
  }

  Transaction
    .find({contract: req.contract._id, 'payment.status': {$in: ['PENDING', 'COMPLETED', 'REVERSED']} })
    .sort({createdAt: -1})
    .lean().exec()
    .then( function(transactions) {
      res.jsonp(transactions);
    }, next);
};


/*
 * get information about Card of given Transaction
 */
exports.getCardInfo = function(req, res, next) {
  return braintree.getCardInfo(req.transaction.orderId).then( function(cardInfo) {
    res.json(cardInfo);
  }).fail(next);
};

