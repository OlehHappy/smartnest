var config = require('../config/config'),
    binlist = require('./binlist'),
    mongoose = require('mongoose'),
    Transaction = mongoose.model('Transaction'),
    Q = require('q'),
    _ = require('underscore'),
    braintree = require('braintree'),
    xero = require('./xero');


// configuration
var env = config.braintree.env ? config.braintree.env : 'sandbox';
var conf = config.braintree[env];
var gateway = braintree.connect({
  environment: braintree.Environment[config.braintree.environment],
  merchantId: conf.merchantId,
  publicKey: conf.publicKey,
  privateKey: conf.privateKey
});


/**
 * detect card type over BinList
 */
exports.isCardDebit = function(bin) {
  return binlist.getCardInfo(bin).then( function(cardInfo) {
    var isDebit = false;

    if (cardInfo && cardInfo.card_type == 'DEBIT') {
      isDebit = true;
    }

    return isDebit;
  });
};


/* generate client Token */
exports.generateClientToken = function() {
  var deferred = Q.defer();
  gateway.clientToken.generate({}, function(err, response) {
    if (err) {
      deferred.reject( new Error(err) );
      return;
    }
    deferred.resolve(response);
  });
  return deferred.promise;
};


/* webhook URL verification */
exports.webhookVerification = function(bt_challenge) {
  return gateway.webhookNotification.verify(bt_challenge);
};


/* webhook message parse */
exports.webhookParse = function(bt_signature, bt_payload) {
  var deferred = Q.defer();
  gateway.webhookNotification.parse(bt_signature, bt_payload, function(err, webhookNotification) {
    if (err) {
      deferred.reject( new Error(err) );
      return;
    }
    deferred.resolve(webhookNotification);
  });
  return deferred.promise;
};


/* check status changes for pending BT transactions */
exports.setTransactionsStatus = function(transactions) {
  //https://developers.braintreepayments.com/javascript+node/sdk/server/transaction-processing/search

  var promises = [];

  _.each(transactions, function(t) {
    promises.push(
      Q.ninvoke(gateway.transaction, 'find', t.payment.trackingId).then( function(BTtransaction) {
        if (BTtransaction.status == 'settled') {
          t.setPaymentStatus('COMPLETED');
          return Q.ninvoke(t, 'save').then( function(result) {
            xero.createInvoice(t);
            return t;
          });
        }
        return t;
      }, function(err) {
        console.error("Problematic BT transaction:", t);
        console.error("Err:", err);
      })
    );
  });

  // return transactions with updates
  return Q.all(promises);
};


/**
 * create and settle new BT Transaction based on incoming Nonce (= Credit Card info + Amount)
 */
exports.pay = function(paidAmount, nonce, transaction) {
  var deferred = Q.defer();

  gateway.transaction.sale({
    amount: paidAmount.toFixed(2),
    paymentMethodNonce: nonce,
    orderId: String(transaction._id),

    //NOTE: default account will be used
    //merchantAccountId: conf.merchantId,

    // settle Transaction
    options: {
      submitForSettlement: true
    }

  }, function(err, result) {
    // error handling
    if (err) {
      //NOTE: internal error
      deferred.reject( new Error('Internal error') );
      return;
    }

    // success
    if (result.success) {
      // return BT 'transaction.id', this will be later used as SN 'transaction.pay_key'
      deferred.resolve(result.transaction.id);

    // validation errors
    } else if (result.errors.deepErrors() > 0) {
      deferred.reject( new Error(result.errors) );

    // other errors
    } else {
      var error_message;

      if (!result.transaction) {
        error_message = "Transaction Error";
      }
      else if (result.transaction.status == "processor_declined") {
        error_message = result.transaction.processorResponseText;
      }
      else if (result.transaction.status == "settlement_declined") {
        error_message = result.transaction.processorSettlementResponseText;
      }
      else if (result.transaction.status == "gateway_rejected") {
        error_message = result.transaction.gatewayRejectionReason;
      }

      deferred.reject( new Error(error_message) );
    }
  });

  return deferred.promise;
};


/* Transaction Disbursed Webhook Process */
exports.transactionDisbursedWebhook = function(webhookNotification) {
  console.log("Braintree Transaction Disbursed Webhook. Transaction ID:", webhookNotification.transaction.id);

  var data = {
    trackingId: webhookNotification.transaction.id, //NOTE: only available in "transaction_disbursed"
    msg: '', //NOTE: is not used anywhere

    // will be stored in logs
    transaction_update: {
      date: webhookNotification.timestamp,
      msg: webhookNotification
    }
  };

  data.msg = 'Braintree Transaction has been disbursed.';
  data.transaction_update.status = 'completed';
  data.transaction_update.active = false;
  data.transaction_update.paid = true;

  return Q(data);
};


//NOTE: no functionality just for logging purpose
//TODO list of Transactions Disbursement Exception webhook
exports.disbursementExceptionWebhook = function(webhookNotification) {
  //TODO
  console.log("Braintree Transactions Disbursed Exception Webhook", webhookNotification);

  //TODO
  //webhookNotification.disbursement.transactionIds
  console.error("BT Transactions Disbursed Exception; Transaction IDs:", webhookNotification.disbursement.transactionIds);

  //TODO
  /*
  webhookNotification.disbursement.exceptionMessage - Only present for disbursement exception webhooks. Indicates the type of failure:
    - bank_rejected
    - insufficient_funds
    - account_not_authorized
  */
  console.error("Exception message:", webhookNotification.disbursement.exceptionMessage);

  //TODO
  /*
  webhookNotification.disbursement.followUpAction - Only present for disbursement exception webhooks. Indicates what (if any) action you should take:
    - contact_us
    - update_funding_information
    - none
  */
  console.error("Exception follow up action:", webhookNotification.disbursement.followUpAction);

  return Q(true);
};


/* withdraw funds from BT Escrow */
exports.withdraw = function(transactions) {
  var promises = [];
  var results = [];

  // release transactions one by one from BT Escrow
  _.each(transactions, function(t) {
    var deferred = Q.defer();
    promises.push(deferred.promise);

    //https://developers.braintreepayments.com/javascript+node/sdk/server/transaction-processing/escrow#releasing
    gateway.transaction.releaseFromEscrow(t.trackingId, function(err, result) {
      var status = 'ok';

      if (err) {
        console.error("Problematic BT transaction:", t);
        console.error("BT release from Escrow error:", err);
        status = err;

      // check result.transaction.escrowStatus == "release_pending"
      } else if (result.transaction.escrowStatus != "release_pending") {
        console.error('Problem, "result.transaction.escrowStatus" should be "release_pending"! Result Transaction:', result.transaction);
      }

      results.push({transaction: t, status: status});
      deferred.resolve(result);
    });
  });

  // return list of transactions and their statuses
  return Q.all(promises).then( function() {
    return Q(results);
  });
};


/* get sub-merchant account */
exports.getSubMerchant = function(merchantAccountId) {
  var deferred = Q.defer();

  gateway.merchantAccount.find(merchantAccountId, function(err, result) {
    if (err) {
      deferred.reject( new Error(err) );
      return;
    }

    // return merchantAccount
    deferred.resolve(result);
  });

  return deferred.promise;
};


/* update sub-merchant account */
exports.updateSubMerchant = function(merchantAccountParams) {
  var deferred = Q.defer();
  var subMerchantId = merchantAccountParams.id;

  // pick only allowed attributes to change
  merchantAccountParams = _.pick(merchantAccountParams, 'individual', 'business', 'funding');

  // omits
  delete merchantAccountParams.individual.ssnLast4;
  delete merchantAccountParams.funding.accountNumberLast4;

  gateway.merchantAccount.update(subMerchantId, merchantAccountParams, function(err, result) {
    if (err) {
      deferred.reject( new Error(err) );
      return;
    }

    if (result.success) {
      deferred.resolve(result.merchantAccount);
    } else {
      deferred.reject( new Error(result.message) );
    }
  });

  return deferred.promise;
};


/* create new sub-merchant account */
exports.createSubMerchant = function(merchantAccountParams) {
  var deferred = Q.defer();

  // set destination into 'bank'
  merchantAccountParams.funding.destination = braintree.MerchantAccount.FundingDestination.Bank;

  // set master merchant account ID
  merchantAccountParams.masterMerchantAccountId = conf.merchantAccountID;

  gateway.merchantAccount.create(merchantAccountParams, function(err, result) {
    if (err) {
      deferred.reject( new Error(err) );
      return;
    }

    if (result.success) {
      deferred.resolve(result.merchantAccount);
    } else {
      deferred.reject( new Error(result.message) );
    }
  });

  return deferred.promise;
};


/* debug webhooks */
exports.webhookTest = function(webhookNotificationKind, transactionId) {
  return gateway.webhookTesting.sampleNotification(webhookNotificationKind, transactionId);
};


/* update status of BT pending transactions */
exports.BTsettlementCutoff = function() {
  // get pending BT transactions
  return Transaction
    .find({'payment.gateway': 'BRAINTREE', 'payment.status': 'PENDING'})
    .populate('contract resident')
    .exec()
    .then( function(transactions) {
      console.log('pending BT transactions: ', transactions.length);
      return transactions;
    })
    .then(exports.setTransactionsStatus);
};


exports.savePaymentMethod = function(userEntity, paymentMethodNonce) {
  var promise = Q();

  // If Braintree Customer didn't set, create it
  if (!userEntity.braintree.customer_id) {
    promise = promise.then( function() {
      return Q.ninvoke(gateway.customer, 'create', {
        firstName: userEntity.first_name,
        lastName: userEntity.last_name,
      });
    }).then( function(result) {
      if (!result.success) {
        return Q.reject( new Error(result.message) );
      }

      userEntity.braintree.customer_id = result.customer.id;
      return Q.ninvoke(userEntity, 'save');
    });
  }

  return promise.then( function() {
    return Q.ninvoke(gateway.paymentMethod, 'create', {
      customerId: userEntity.braintree.customer_id,
      paymentMethodNonce: paymentMethodNonce
    });
  }).then( function(result) {
    if (!result.success) {
      return Q.reject( new Error(result.message) );
    }

    userEntity.braintree.payment_method_token = result.creditCard.token;
    return Q.ninvoke(userEntity, 'save');
  }).then( function() {
    return userEntity.braintree.payment_method_token;
  });
};


/**
 * amount = rent amount
 * paidAmount = total charged money, including all fees
 */
exports.createSubscription = function(contractEntity, paymentMethodToken, pay_date, amount, paidAmount, isDebit) {
  if (contractEntity.getRecurringPayment(contractEntity.resident)) {
    return Q.reject(new Error('You have already setup subscription.'));
  }

  return Q.ninvoke(gateway.subscription, 'create', {
    paymentMethodToken: paymentMethodToken,
    planId: conf.planId,
    firstBillingDate: pay_date,
    // amount including Fees
    price: paidAmount
  }).then( function(result) {
    if (!result.success) {
      return Q.reject( new Error(result.message) );
    }

    contractEntity.recurring_payments.push({
      user: contractEntity.resident,
      gateway: 'BRAINTREE',
      pay_date: pay_date,
      // rent amount
      amount: amount,
      settings: {
        braintree_subscription_id: result.subscription.id,
        debit: isDebit
      }
    });

    return Q.ninvoke(contractEntity, 'save');
  });
};


exports.updateSubscription = function(contractEntity, userEntity, amount, paidAmount) {
  var recurring_payment = contractEntity.getRecurringPayment(userEntity._id);

  if (!amount) {
    return Q.reject(new Error('Bad Request'));
  }

  if (!recurring_payment || recurring_payment.gateway !== 'BRAINTREE' || !recurring_payment.settings.braintree_subscription_id) {
    return Q.reject(new Error('You have not setup subscription.'));
  }

  return Q.ninvoke(gateway.subscription, 'update', recurring_payment.settings.braintree_subscription_id, {
    //NOTE: "First Billing Date cannot be updated."
    price: paidAmount
  }).then( function(result) {
    if (!result.success) {
      return Q.reject( new Error(result.message) );
    }

    recurring_payment.amount = amount;
    return Q.ninvoke(contractEntity, 'save');
  });
};


exports.removeSubscription = function(contractEntity, userEntity) {
  var recurring_payment = contractEntity.getRecurringPayment(userEntity._id);

  if (!recurring_payment || recurring_payment.gateway !== 'BRAINTREE' || !recurring_payment.settings.braintree_subscription_id) {
    return Q.reject(new Error('You have not setup subscription.'));
  }

  return Q.ninvoke(gateway.subscription, 'cancel', recurring_payment.settings.braintree_subscription_id).then( function(result) {
    if (!result.success) {
      return Q.reject( new Error(result.message) );
    }

    contractEntity.deleteRecurringPayment(userEntity._id);
    return Q.ninvoke(contractEntity, 'save');
  }).then( function() {
    return Q.ninvoke(gateway.paymentMethod, 'delete', userEntity.braintree.payment_method_token);
  }).then( function() {
    userEntity.braintree.payment_method_token = undefined;
    return Q.ninvoke(userEntity, 'save');
  });
};


/* get information about Card of given Transaction */
exports.getCardInfo = function(orderId) {
  var deferred = Q.defer();
  gateway.transaction.find(orderId, function(err, response) {
    if (err) {
      deferred.reject( new Error(err) );
      return;
    }
    deferred.resolve(response.creditCard);
  });
  return deferred.promise;
};
