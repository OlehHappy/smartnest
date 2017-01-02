var mongoose = require('mongoose'),
  config = require('../config/config'),
  Transaction = mongoose.model('Transaction'),
  Q = require('q'),
  _ = require('underscore'),
  fs = require('fs'),
  nodemailer = require('nodemailer'),
  lobFactory = require('lob'),
  xero = require('./xero');

// configuration
var env = config.lob.env ? config.lob.env : 'sandbox';
var conf = config.lob[env];
var Lob = new lobFactory(conf.apiKey);


exports.verifyAddress = function(line1, unit, city, state, zip, country) {
  if (country === undefined) {
    country = 'US';
  }

  if (unit) {
    unit = 'Unit ' + unit;
  }

  return Lob.verification.verify({
    address_line1: line1,
    address_line2: unit,
    address_city: city,
    address_state: state,
    address_zip: zip,
    address_country: country
  });
};


/**
 * Convert SmartNest.Pay Landlord to Lob.com address format
 */
exports.formatAddress = function(landlord) {
  return {
    name: landlord.first_name || landlord.last_name ? landlord.first_name + ' ' + landlord.last_name : undefined,
    company: landlord.company,
    email: landlord.email,
    address_line1: landlord.address.street,
    address_line2: landlord.address.unit ? 'Unit ' + landlord.address.unit : undefined,
    address_city: landlord.address.city,
    address_state: landlord.address.state,
    address_zip: landlord.address.postal,
    address_country: landlord.address.country || 'US'
  };
};


/**
 * Create new Address in Lob.com
 */
exports.createAddress = function(landlord) {
  return Lob.addresses.create(exports.formatAddress(landlord));
};


/**
 * Populate `contract` and `resident` if not populated
 */
var populateTransaction = exports.populateTransaction = function(transaction) {
  var populate = _.filter(['contract', 'resident'], function(p) {
    return transaction.populated(p) === undefined;
  });
  return Q.ninvoke(transaction, 'populate', populate.join(' ')).then( function() {
    return transaction;
  });
};


var sendCheckEmail = function(check, transaction) {
  var email_to = config.app.email_redirect || check.to.email;
  var bcc_email = config.app.bcc_email;

  // create reusable transport method (opens pool of SMTP connections)
  var smtpTransport = nodemailer.createTransport("SMTP", {
    service: config.email_sender_service,
    auth: {
      user: config.email_sender,
      pass: config.email_sender_password
    }
  });

  // setup e-mail data with unicode symbols
  var mailOptions = {
    from: config.email_sender_from, // sender address
    to: email_to,
    bcc: bcc_email,
    subject: 'Payment Check - ' + transaction.resident.first_name + ' ' + transaction.resident.last_name, // Subject line
    // email message
    html: 'Resident ' + transaction.resident.first_name + ' ' + transaction.resident.last_name + ' just made a rent payment.<br />' +
          'Check is on the way your address: <br />' +
          transaction.contract.landlord.address.street + '<br />' +
          transaction.contract.landlord.address.city + '<br /><br />' +
          'Check Thumbnail can be found in email attachment.<br /><br />' +
          'Processed by <a href="' + config.app.protocol + '://' + config.app.host_name + config.app.base_url + '">SmartNestPay</a><br />' +
          'tickets@smartnest.uservoice.com',
    attachments: [
      {   // use URL as an attachment
        fileName: 'check.pdf',
        filePath: check.url
      }
    ]
  };

  // send mail with defined transport object
  smtpTransport.sendMail(mailOptions, function(err, res) {
    if (err) {
      console.log('Cant send email. ' + err);
    } else {
      console.log('Email sent:', res.message);
    }

    // if you don't want to use this transport object anymore, uncomment following line
    smtpTransport.close(); // shut down the connection pool, no more messages
  });
};


var createCheck = exports.createCheck = function(transaction) {
  if (!(transaction.payment.status === 'COMPLETED' || transaction.payment.status === 'PENDING') || transaction.check.status !== undefined) {
    return Q.when();
  }

  var check;
  return populateTransaction(transaction).then( function() {
    return Lob.checks.create({
      bank_account: conf.bank_account_id,
      to: exports.formatAddress(transaction.contract.landlord),
      amount: transaction.amount,
      data: {
        first_name: transaction.resident.first_name,
        last_name: transaction.resident.last_name,
        street: transaction.contract.address.street,
        unit: transaction.contract.address.unit || '-',
        city: transaction.contract.address.city,
        state: transaction.contract.address.state,
        postal: transaction.contract.address.postal
      },
      logo: 'http://i.imgur.com/FXhYpxI.png',
      file: fs.readFileSync(__dirname + '/templates/lob/check.html', 'utf8')
    });
  }).then( function(_check) {
    check = _check;
    transaction.check.checkId = check.id;
    // tracking information
    transaction.check.tracking = {
      id: check.tracking.id,
      tracking_number: check.tracking.tracking_number,
      carrier: check.tracking.carrier,
      link: check.tracking.link
    };
    // Check preview
    transaction.check.thumbnail = (check.thumbnails && check.thumbnails.length) ? check.thumbnails[0].large : '';

    transaction.check.expected_delivery_date = check.expected_delivery_date;
    transaction.addFee('CHECK', check.price, 'Check transport fee');
    transaction.setCheckStatus('CREATED', '', check.date_created);
    transaction.setCheckStatus('PENDING');
    return Q.ninvoke(transaction, 'save');
  }).then( function() {
    console.log('Successfully created Check for Transaction _id:', transaction._id);
    sendCheckEmail(check, transaction);
    xero.createBill(transaction);
    return check;
  });
};


var sendTransactionsCheck = exports.sendTransactionsCheck = function(transactions) {
  var promises = [];
  _.each(transactions, function(transaction) {
    if (transaction.sendCheck === true &&
        ['COMPLETED', 'PENDING'].indexOf(transaction.payment.status) !== -1 &&
        transaction.check.status === undefined) {
      promises.push(createCheck(transaction));
    }
  });

  return Q.all(promises);
};


//NOTE: Check can send right after payment, no need to way 2 business days for payment settlement
exports.LOBsendChecks = function() {
  return Transaction
    .find({sendCheck: true, 'payment.status': {$in: ['COMPLETED', 'PENDING']}, 'check.status': {$exists: false}})
    .exec()
    .then( function(transactions) {
      console.log('Total transactions without Check:', transactions.length);
      return transactions;
    })
    .then(sendTransactionsCheck);
};
