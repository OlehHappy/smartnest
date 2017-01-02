/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    paymentService = require('../services/payments'),
    braintree = require('../services/braintree'),
    Contract = mongoose.model('Contract'),
    Transaction = mongoose.model('Transaction'),
    User = mongoose.model('User'),
    Q = require('q'),
    _ = require('lodash');


/**
 * detect card type over BinList
 */
exports.isCardDebit = function(req, res, next) {
  return braintree.isCardDebit(req.body.bin).then( function(isDebit) {
    return res.jsonp({debit: isDebit});

  }).fail(next);
};


// --------------- Braintree ---------------
/* generate BT ClientToken */
exports.generateClientToken = function(req, res) {
  Q.fcall(braintree.generateClientToken).then( function(result) {
    res.json({clientToken: result.clientToken});
  }).fail( function(err) {
    console.error(err.stack);
    return res.jsonp(500, {err: err.message});
  });
};


/* Braintree webhook Verification; GET - required for verification of webhook URL */
exports.BTwebhookVerification = function(req, res) {
  if (!req.query.bt_challenge) {
    return res.send(500);
  }
  res.send( braintree.webhookVerification(req.query.bt_challenge) );
};


/* BT single Transaction Disbursement webhook */
exports.BTtransactionDisbursementWebhook = function(req, res) {
  //NOTE: transaction status is updated by Cron Job, webhook remains with no logic, only for logging reasons

  // parse webhook message
  braintree.webhookParse(req.body.bt_signature, req.body.bt_payload)
    .then(braintree.transactionDisbursedWebhook)
    .then( function() {
      return res.send(200);
    }).fail( function(err) {
      console.error(err.stack);
      return res.jsonp(500, {err: err.message});
    });
};

/* BT list of Transactions Disbursement Exception webhook */
exports.BTdisbursementExceptionWebhook = function(req, res) {
  // parse webhook message
  braintree.webhookParse(req.body.bt_signature, req.body.bt_payload)
    .then(braintree.disbursementExceptionWebhook)
    .then( function() {
      return res.send(200);
    }).fail( function(err) {
      console.error(err.stack);
      return res.jsonp(500, {err: err.message});
    });
};


/* Sub-merchant Account activation status update */
exports.BTsubMerchantWebhook = function(req, res) {
  // parse webhook message
  braintree.webhookParse(req.body.bt_signature, req.body.bt_payload).then( function(webhookNotification) {
    var status;

    if (webhookNotification.kind == 'sub_merchant_account_declined') {
      status = webhookNotification.message; // error reason
      console.log('Sub-merchant account "' + webhookNotification.merchantAccount.id + '" has been declined. Declined Reason:', webhookNotification.message);

    } else if (webhookNotification.kind == 'sub_merchant_account_approved') {
      status = webhookNotification.merchantAccount.status; // 'active'
      console.log('Sub-merchant account "' + webhookNotification.merchantAccount.id + '" has been approved.');

    } else {
      console.log(webhookNotification);
      throw new Error('Unknown webhookNotification Kind.');
    }

    // find Property BT account matching ID
    var query = Property.findOneAndUpdate({braintree_account: webhookNotification.merchantAccount.id}, {braintree_account_status: status});
    return Q.ninvoke(query, 'exec');

  }).then( function(property) {
    if (!property) {
      throw new Error('Unable to find Property with such a BT account ID.');
    }
    return res.send(200);

  }).fail( function(err) {
    console.error(err.stack);
    return res.jsonp(500, {err: err.message});
  });
};


/* Subscription (= recurring payment) was successfully charged */
exports.BTsubscriptionSuccessfullyChargedWebhook = function(req, res, next) {
  var webhookNotification;

  // parse webhook message
  braintree.webhookParse(req.body.bt_signature, req.body.bt_payload).then( function(_webhookNotification) {
    webhookNotification = _webhookNotification;
    
    //TODO debug log
    console.log("[Webhook Received " + webhookNotification.timestamp + "] | Kind: " + webhookNotification.kind + " | Subscription: " + webhookNotification.subscription.id + " | Transaction: " + webhookNotification.subscription.transactions[0]);
    // https://developers.braintreepayments.com/javascript+node/reference/response/subscription

    var query = Contract.findOne({'recurring_payments.settings.braintree_subscription_id': webhookNotification.subscription.id});
    return Q.ninvoke(query, 'exec');

  }).then( function(contract) {
    var recurring_payment = contract.getRecurringPaymentBySubscriptionId(webhookNotification.subscription.id);
    var isDebit = !!recurring_payment.settings.debit;

    // compute fee
    var fees = paymentService.computeFee(recurring_payment.amount);
    var feeAmount = isDebit ? fees.debit : fees.credit;

    // compute total amount to be paid
    var paidAmount = recurring_payment.amount + feeAmount;

    // create Transaction
    var transaction = new Transaction({
      contract: contract._id,
      resident: recurring_payment.user,
      createdAt: new Date(),

      // rent amount
      amount: recurring_payment.amount,

      // total charged money, including all fees
      paidAmount: paidAmount,

      fees: [{
        amount: paymentService.computeBraintreeTransactionFee(recurring_payment.amount),
        description: 'Braintree transaction fee',
        type: 'PAYMENT'
      }],

      payment: {
        gateway: 'BRAINTREE',
        recurring: true,
        debit: isDebit
      }
    });

    transaction.setPaymentStatus('PENDING');
    transaction.payment.trackingId = webhookNotification.subscription.transactions[0].id;
    promises.push( Q.ninvoke(transaction, 'save') );

    // update Contract next recurring payment Date
    recurring_payment.pay_date = webhookNotification.subscription.nextBillingDate;
    promises.push( Q.ninvoke(contract, 'save') );

    return Q.all(promises);

  }).then( function() {
    return res.send(200);

  }).fail( function(err) {
    console.error('Error BTsubscriptionSuccessfullyChargedWebhook:', err.stack);
    return res.send(500, err.message);
  });
};


/* Subscription didn't charge */
exports.BTsubscriptionUnsuccessfullyChargedWebhook = function(req, res, next) {
  // parse webhook message
  braintree.webhookParse(req.body.bt_signature, req.body.bt_payload).then( function(webhookNotification) {
    //TODO Should we store this event in logs? Should we create error transaction?
    console.error('BTsubscriptionUnsuccessfullyCharged', webhookNotification);
  });
};


/* debug webhooks */
exports.BTwebhookTest = function(req, res) {
  //NOTE: possible Kinds
  /*
    TransactionDisbursed: "transaction_disbursed" - single transaction

    Disbursement: "disbursement" - multiple transactions
    DisbursementException: "disbursement_exception" - multiple transactions

    DisputeOpened: "dispute_opened" - single transaction
    DisputeLost: "dispute_lost" - single transaction
    DisputeWon: "dispute_won" - single transaction

    PartnerMerchantConnected: "partner_merchant_connected"
    PartnerMerchantDisconnected: "partner_merchant_disconnected"
    PartnerMerchantDeclined: "partner_merchant_declined"
    SubscriptionCanceled: "subscription_canceled"
    SubscriptionChargedSuccessfully: "subscription_charged_successfully"
    SubscriptionChargedUnsuccessfully: "subscription_charged_unsuccessfully"
    SubscriptionExpired: "subscription_expired"
    SubscriptionTrialEnded: "subscription_trial_ended"
    SubscriptionWentActive: "subscription_went_active"
    SubscriptionWentPastDue: "subscription_went_past_due"
    SubMerchantAccountApproved: "sub_merchant_account_approved"
    SubMerchantAccountDeclined: "sub_merchant_account_declined"
  */

  // use query parameters
  var transaction_id = req.query.id || 'myTransactionId',
      kind = req.query.kind,
      processingMethod;

  // create a dummy webhook
  var sampleNotification = braintree.webhookTest(kind, transaction_id);
  req.body = sampleNotification;

  switch (kind) {
    case 'transaction_disbursed':
      processingMethod = exports.BTtransactionDisbursementWebhook;
      break;
    case 'disbursement':
      processingMethod = exports.BTdisbursementWebhook;
      break;
    case 'disbursement_exception':
      processingMethod = exports.BTdisbursementExceptionWebhook;
      break;
    case 'subscription_charged_successfully':
      processingMethod = exports.BTsubscriptionSuccessfullyChargedWebhook;
      break;
    case 'subscription_charged_unsuccessfully':
      processingMethod = exports.BTsubscriptionUnsuccessfullyChargedWebhook;
      break;
    case 'sub_merchant_account_approved':
    case 'sub_merchant_account_declined':
      processingMethod = exports.BTsubMerchantWebhook;
      break;
  }

  if (!processingMethod) {
    return res.jsonp(500, {err: 'Unsupported kind of webhook.'});
  }

  return processingMethod(req, res);
};
