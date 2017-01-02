/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto'),
    _ = require('underscore'),
    uService = require ('../services/user.js');

/**
 * User Schema
 */
var UserSchema = new Schema({
  // in archive
  deleted: {
    type: Boolean,
    default: false
  },

  role: {
    type: String,
    required: true,
    uppercase: true,
    enum: ['ADMIN', 'RESIDENT']
  },

  email: {
    type: String,
    unique: true,
    required: true
  },

  first_name: String,
  last_name: {
    type: String,
    required: true
  },

  birth_date: Date,

  phone: String,
  phone_verified: {
    type: Boolean,
    default: false
  },

  created_at: Date,
  last_login: Date,

  hashed_password: String,
  salt: String,
  reset_token: String,

  // SynapsePay payment gateway
  synapse: {
    user_id: String,
    refresh_token: String,
    permission: {
      type: String,
      uppercase: true,
      enum: ['UNVERIFIED', 'RECEIVE', 'SEND-AND-RECEIVE', 'LOCKED']
    }
  },

  braintree: {
    customer_id: String,
    payment_method_token: String
  }
});


//verify and phormat the fone
UserSchema.pre('validate', function(next) {

  var errc = {};
  if( this.phone && !uService.isPhoneValid(this.phone,errc)) {
    var msg = '"' + this.phone + '" is not a valid phone number. ' + (errc.error ? errc.error.message : '');
    return next(new Error(msg));
  }
  next();
});


/**
 * Virtuals
 */
UserSchema.virtual('password').set( function(password) {
  this._password = password;
  this.salt = this.makeSalt();
  this.hashed_password = this.encryptPassword(password);
}).get(function() {
  return this._password;
});

/**
 * Validations
 */
var validatePresenceOf = function(value) {
  return value && value.length;
};

// validations below only apply if you are signing up traditionally
UserSchema.path('email').validate( function(email) {
  return (email && email.length);
}, 'Email is required and cannot be blank');

/* verify email address format */
UserSchema.path('email').validate( function(email) {
  var EMAIL_REGEXP = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  return EMAIL_REGEXP.test(email);
}, 'The email format is invalid');

UserSchema.path('last_name').validate( function(last_name) {
  return (last_name && last_name.length);
}, 'Last Name is required and cannot be blank');

UserSchema.path('hashed_password').validate( function(hashed_password) {
  return (hashed_password && hashed_password.length);
}, 'Password is required and cannot be blank');


/**
 * Pre-save hook
 */
UserSchema.pre('save', function(next) {
  if ( !this.created_at ) {
    this.created_at = new Date();
  }

  if (!this.isNew) {
    return next();
  }
  if ( !validatePresenceOf(this.password) && !this.hashed_password ) {
    next(new Error('Invalid password'));
  } else {
    next();
  }
});

/**
 * Methods
 */
UserSchema.methods = {
  /**
    * Authenticate - check if the passwords are the same
    *
    * @param {String} plainText
    * @return {Boolean}
    * @api public
    */
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  /**
    * Make salt
    *
    * @return {String}
    * @api public
    */
  makeSalt: function() {
    return Math.round((new Date().valueOf() * Math.random())) + '';
  },

  /**
    * Encrypt password
    *
    * @param {String} password
    * @return {String}
    * @api public
    */
  encryptPassword: function(password) {
    if (!password) {
      return '';
    }
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
  }
};

/**
 * Statics
 */
UserSchema.statics = {
  load: function(id, cb) {
    this.findOne({_id: id}).exec(cb);
  }
};


mongoose.model('User', UserSchema);
