/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    paymentService = require('../services/payments'),
    config = require('../config/config'),
    braintree = require('../services/braintree'),
    Transaction = mongoose.model('Transaction'),
    Q = require('q'),
    _ = require('lodash');


/**
 * return fees based on amount for all Paygates
 */
exports.computeFee = function(req, res) {
  try {
    var fees = paymentService.computeFee(req.body.amount);
    return res.jsonp(fees);
  } catch(err) {
    return res.send(500, err.message);
  }
};


/**
 * pay via Card
 */
 exports.payBT = function(req, res, next) {
  if (!req.body.nonce || !req.body.bin) {
    throw new Error('CreditCard information is missing.');
  }

  if (!req.body.amount) {
    throw new Error('Amount value is missing.');
  }


  // use Bin to detect Card type
  return braintree.isCardDebit(req.body.bin).then( function(isDebit) {

    // compute fee
    var fees = paymentService.computeFee(req.body.amount);
    var feeAmount = isDebit ? fees.debit : fees.credit;

    // compute total amount to be paid
    var paidAmount = req.body.amount + feeAmount;


    // Recurring billing
    if (req.body.recurring === true) {
      if (req.contract.getRecurringPayment(req.user._id)) {
        return next(new Error('Renter has already set recurring payment.'));
      }

      return braintree.savePaymentMethod(req.user, req.body.nonce).then( function(paymentMethodToken) {
        return braintree.createSubscription(req.contract, paymentMethodToken, req.body.pay_date, req.body.amount, paidAmount, isDebit);
      }).then( function() {
        res.send(200);
      }, next);
    }

    // create Transaction
    var transaction = new Transaction({
      contract: req.contract._id,
      resident: req.user._id,
      createdAt: new Date(),

      // rent amount
      amount: req.body.amount,

      // total charged money, including all fees
      paidAmount: paidAmount,

      fees: [{
        amount: paymentService.computeBraintreeTransactionFee(req.body.amount),
        description: 'Braintree transaction fee',
        type: 'PAYMENT'
      }],

      payment: {
        gateway: 'BRAINTREE',
        debit: isDebit
      }
    });


    return Q.ninvoke(transaction, 'save').then( function(result) {
      transaction = result[0];
      return braintree.pay(paidAmount, req.body.nonce, transaction);

    }).then( function(trackingId) {
      transaction.setPaymentStatus('PENDING');
      transaction.payment.trackingId = trackingId;
      return Q.ninvoke(transaction, 'save');

    }).then( function() {
      return res.send(200);
    });

  }).fail( function(err) {
    console.error(err.stack);
    return res.send(500, err.message);
  });
};


/**
 * update recurring payments
 */
exports.updateRecurring = function(req, res, next) {
  if (String(req.contract.resident) !== String(req.user._id)) {
    return next(new Error('Not Allow, you must be owner of contract.'));
  }

  var recurring_payment = req.contract.getRecurringPayment(req.user._id);

  // compute fee
  var fees = paymentService.computeFee(req.body.amount);
  var feeAmount = recurring_payment.settings.debit ? fees.debit : fees.credit;

  // compute total amount to be paid
  var paidAmount = req.body.amount + feeAmount;

  var promise = Q.reject();

  switch (recurring_payment.gateway) {
    case 'BRAINTREE':
      promise = braintree.updateSubscription(req.contract, req.user, req.body.amount, paidAmount);
      break;
  }

  promise.then( function() {
    res.send(200);
  }, next);
};


exports.deleteRecurring = function(req, res, next) {
  if (String(req.contract.resident) !== String(req.user._id)) {
    return next(new Error('Not Allow, you must be owner of contract.'));
  }

  var promise = Q.reject();
  var recurring_payment = req.contract.getRecurringPayment(req.user._id);

  switch (recurring_payment.gateway) {
    case 'BRAINTREE':
      promise = braintree.removeSubscription(req.contract, req.user);
      break;
  }

  promise.then( function() {
    res.send(200);
  }, next);
};
