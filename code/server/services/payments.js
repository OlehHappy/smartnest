/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    config = require('../config/config'),
    _ = require('underscore'),
    Q = require('q');


// compute fees based on amount for all Paygates
exports.computeFee = function(amount) {
  // check 'amount', error raise
  if ( isNaN(amount) || amount < 0 ) {
    throw new Error('Invalid amount for fee computing.');
  }

  /**
   *   Service fee = money for SN (George)
   *   Processing fee = money for Payment gate
   */

  // compute fees for all supported Paygates
  var fees = {
    // Braintree Credit Card fee
    credit: function(rent) {
      var serviceFee = rent * config.braintree.service_fee_rate/100 + config.braintree.service_fee;
      var pf = config.braintree.processing_fee_rate/100;
      var computedFee = (serviceFee + config.braintree.processing_fee + pf * (rent + serviceFee)) / (1 - pf);

      //NOTE: set minimum fee to $3
      return  Math.max(3, computedFee);
    }(amount),

    // Braintree Debit Card fee
    debit: function(rent) {
      var debitFee = 0;
      if (rent > 5000) {
        debitFee = 10;
      }

      return debitFee;
    }(amount)

    //TODO
    //synapse:
  };

  // prevent floating point issue
  _.each(fees, function(value, key) {
    fees[key] = +(value).toFixed(2);
  });

  return fees;
};


// compute amount of BT Transaction fee
exports.computeBraintreeTransactionFee = function(amount) {
  var serviceFee = amount * config.braintree.service_fee_rate/100 + config.braintree.service_fee;
  var pf = config.braintree.processing_fee_rate/100;
  var transactionFee = (serviceFee + config.braintree.processing_fee + pf * (amount + serviceFee)) / (1 - pf) - serviceFee;

  // prevent floating point issue
  return +(transactionFee).toFixed(2);
};
