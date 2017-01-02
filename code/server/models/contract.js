/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    _ = require('underscore');

/**
 * Contract Schema
 */
var ContractSchema = new Schema({

  resident: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },

  address: {
    street: String,
    unit: String,
    city: String,
    state: String,
    postal: String
  },

  landlord: {
    first_name: String,
    last_name: String,
    company: String,
    email: String,
    name: String, // TODO used?
    address: {
      street: String,
      unit: String,
      city: String,
      state: String,
      postal: String
    }
  },

  date_from: Date,
  date_to: Date,

  rent_amount: Number,
  rent_day: Number,

  recurring_payments: [{
    user: {
      type: Schema.ObjectId,
      ref: 'User',
      required: true
    },
    gateway: {
      type: String,
      required: true,
      enum: ['BRAINTREE']
    },
    pay_date: {
      type: Date,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    // Additional payments gateway settings
    settings: {
      braintree_subscription_id: String,
      debit: {
        type: Boolean,
        default: false
      }
    }
  }],

  deleted: Boolean // in archive
});

/**
 * Validations
 */
ContractSchema.pre('save', function(next) {
  if ( this.date_to < this.date_from ) {
    next(new Error('"Date from" ahead "Date to".'));
  } else {
    next();
  }
});


ContractSchema.path('date_from').validate(function(date_from) {
  return date_from && date_from.$exists;
}, '"Date from" cannot be empty.');

ContractSchema.path('date_to').validate(function(date_to) {
  return date_to && date_to.$exists;
}, '"Date to" cannot be empty.');

//ContractSchema.path('date_to').validate(function(date_to) {
//  return (date_to > Date.now());
//}, '"Date to" cannot be in past.');

/*ContractSchema.path('rent_amount').validate(function(rent_amount) {
  return (rent_amount > 0);
}, 'Rent amount has to be higher than 0.');*/

ContractSchema.path('resident').validate(function(resident) {
  return resident && resident.$exists;
}, 'Contract has to contain some Resident.');

/**
 * Statics
 */
ContractSchema.statics = {
  load: function(id, cb) {
    this.findOne({_id: id}).exec(cb);
  }
};


ContractSchema.methods.getRecurringPayment = function(userId) {
  return _.find(this.recurring_payments, function(recurring_payment) {
    return String(recurring_payment.user) === String(userId);
  });
};

ContractSchema.methods.getRecurringPaymentBySubscriptionId = function(subscriptionId) {
  return _.find(this.recurring_payments, function(recurring_payment) {
    return String(recurring_payment.settings.braintree_subscription_id) === subscriptionId;
  });
};

ContractSchema.methods.deleteRecurringPayment = function(userId) {
  var recurring_payments = this.recurring_payments;
  _.each(recurring_payments, function(recurring_payment, index) {
    if (String(recurring_payment.user) === String(userId)) {
      recurring_payments.splice(index, 1);
    }
  });
};


mongoose.model('Contract', ContractSchema);
