var config = require('../config/config'),
    Q = require('q'),
    _ = require('underscore'),
    fs = require('fs'),
    Xero = require('xero');


// configuration
var env = config.xero.env ? config.xero.env : 'sandbox';
var conf = config.xero[env];
var Xero = new Xero(conf.key, conf.secret, fs.readFileSync(conf.private_key_file));


var xeroFormatDate = function(date) {
  return date.toISOString().split('T')[0];
};


var descriptionFormatDate = function(date) {
  return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear() + ' ' +
  date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + ' UTC';
};


exports.createInvoice = function(transaction) {
  var deferred = Q.defer();
  var now = new Date();
  var due = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 14);
  var description = '' +
    transaction.resident.first_name + ' ' + transaction.resident.last_name + ', ' +
    'unit ' + transaction.contract.address.unit + ', ' +
    'gateway ' + transaction.payment.gateway + ', ' +
    'order ' + transaction.payment.trackingId + ', ' +
    'date ' + descriptionFormatDate(now);

  var invoice = {
    Type: 'ACCREC',
    Contact: {
      Name: transaction.contract.landlord.company || '',
      FirstName: transaction.contract.landlord.first_name || '',
      LastName: transaction.contract.landlord.last_name || '',
      EmailAddress: transaction.contract.landlord.email || '',
      Addresses: [{
        AddressLine1: transaction.contract.landlord.address.street,
        AddressLine2: transaction.contract.landlord.address.unit || '',
        City: transaction.contract.landlord.address.city,
        Region: transaction.contract.landlord.address.state,
        PostalCode: transaction.contract.landlord.address.postal,
        Country: 'USA'
      }]
    },
    LineItems: [{
      Description: description,
      Quantity: 1,
      UnitAmount: transaction.amount,
      AccountCode: 400,
      ItemCode: 'rent',
      DiscountRate: 0
    }],
    Date: xeroFormatDate(now),
    DueDate: xeroFormatDate(due),
    LineAmountTypes: 'NoTax',
    Reference: transaction.payment.trackingId,
    Status: 'AUTHORISED'
  };

  Xero.call('POST', '/Invoices', invoice, function(error, response) {
    if (error) {
      return deferred.reject(error);
    }

    deferred.resolve(response);
  });

  return deferred.promise;
};


exports.createBill = function(transaction) {
  var deferred = Q.defer();
  var now = new Date();
  var due = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 14);
  var description = '' +
    transaction.resident.first_name + ' ' + transaction.resident.last_name + ', ' +
    'unit ' + transaction.contract.address.unit + ', ' +
    'gateway ' + transaction.payment.gateway + ', ' +
    'order ' + transaction.payment.trackingId + ', ' +
    'date ' + descriptionFormatDate(now);

  var bill = {
    Type: 'ACCPAY',
    Contact: {
      Name: transaction.contract.landlord.company || '',
      FirstName: transaction.contract.landlord.first_name || '',
      LastName: transaction.contract.landlord.last_name || '',
      EmailAddress: transaction.contract.landlord.email || '',
      Addresses: [{
        AddressLine1: transaction.contract.landlord.address.street,
        AddressLine2: transaction.contract.landlord.address.unit || '',
        City: transaction.contract.landlord.address.city,
        Region: transaction.contract.landlord.address.state,
        PostalCode: transaction.contract.landlord.address.postal,
        Country: 'USA'
      }]
    },
    LineItems: [{
      Description: description,
      Quantity: 1,
      UnitAmount: transaction.amount,
      AccountCode: 400,
      ItemCode: 'rent'
    }],
    Date: xeroFormatDate(now),
    DueDate: xeroFormatDate(due),
    LineAmountTypes: 'NoTax',
    InvoiceNumber: transaction.check.checkId,
    Status: 'AUTHORISED'
  };

  Xero.call('POST', '/Invoices', bill, function(error, response) {
    if (error) {
      return deferred.reject(error);
    }

    deferred.resolve(response);
  });

  return deferred.promise;
};
