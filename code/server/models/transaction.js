/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Transaction Schema
 */
var TransactionSchema = new Schema({
  contract: {
    type: Schema.ObjectId,
    ref: 'Contract',
    required: true
  },

  resident: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },

  createdAt: {
    type: Date,
    required: true
  },

  sendCheck: {
    type: Boolean,
    default: true
  },

  // rent amount
  amount: {
    type: Number,
    required: true
  },

  // total charged money, including all fees
  paidAmount: Number,

  fees: [{
    amount: Number,
    description: String,
    type: {
      type: String,
      uppercase: true,
      enum: ['PAYMENT', 'CHECK']
    }
  }],

  payment: {
    // Payment Gate transaction ID
    trackingId: {
      type: String
    },

    gateway: {
      type: String,
      uppercase: true,
      enum: ['BRAINTREE'],
      required: true
    },
    status: {
      type: String,
      uppercase: true,
      enum: ['CREATED', 'PENDING', 'COMPLETED', 'REVERSED', 'ERROR']
    },
    logs: {
      type: [{
        status: {
          type: String,
          uppercase: true,
          enum: ['CREATED', 'PENDING', 'COMPLETED', 'REVERSED', 'ERROR']
        },
        date: Date,
        msg: Schema.Types.Mixed
      }]
    },

    recurring: {
      type: Boolean,
      default: false
    },

    // is used Braintree Debit Card type?
    debit: {
      type: Boolean,
      default: false
    }
  },

  check: {
    // Lob check ID
    checkId: {
      type: String
    },

    tracking: {
      id: String,
      tracking_number: String,
      carrier: String,
      link: String
    },

    // Check preview
    thumbnail: String,

    status: {
      type: String,
      uppercase: true,
      enum: ['CREATED', 'PENDING', 'COMPLETED', 'REVERSED', 'ERROR']
    },
    logs: {
      type: [{
        status: {
          type: String,
          uppercase: true,
          enum: ['CREATED', 'PENDING', 'COMPLETED', 'REVERSED', 'ERROR']
        },
        date: Date,
        msg: Schema.Types.Mixed
      }]
    },
    expected_delivery_date: Date
  }
});


/**
 * Statics
 */
TransactionSchema.statics = {
  load: function(id, cb) {
    this.findOne({_id: id}).exec(cb);
  }
};


/**
 * Update Transaction payment status
 */
TransactionSchema.methods.setPaymentStatus = function(newStatus, msg) {
  this.payment.status = newStatus;
  this.payment.logs.push({
    status: newStatus,
    date: new Date(),
    msg: msg
  });
};


/**
 * Update Transaction payment status
 */
TransactionSchema.methods.setCheckStatus = function(newStatus, msg, date) {
  if (date === undefined) {
    date = new Date();
  }

  if (this.check.logs.length === 0 && newStatus !== 'CREATED') {
    this.check.logs.push({
      status: 'CREATED',
      date: date
    });
  }

  this.check.status = newStatus;
  this.check.logs.push({
    status: newStatus,
    date: date,
    msg: msg
  });
};


TransactionSchema.methods.addFee = function(type, amount, description) {
  this.fees.push({
    type: type,
    amount: amount,
    description: description || ''
  });
};


mongoose.model('Transaction', TransactionSchema);
