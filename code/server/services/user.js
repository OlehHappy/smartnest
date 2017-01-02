/**
 * User service. Common functionality for existing renters and users.
 */

var libphonenumber = require('libphonenumber');


/* prepare RegEx for Mongo query, find will be case insensitive */
exports.findByEmailRegex = function(email) {
  // escape email address, because of characters like "@" and "."
  escapedEmail = email ? email.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') : '';
  return {$regex: '^' + escapedEmail + '$', $options: '-i'};
};


//format phone number as +123456789123
exports.formatPhone = function(phoneNumber,errorContainer) {
  try {
    return libphonenumber.e164(phoneNumber,'US');
  } catch(e) {
    if(errorContainer) {
      errorContainer.error = e;
    }
    return '';
  }
};


//decide if a phone number is valid. Returns true / false. If you want the error object, it will be returned in errorContrainer.error.
exports.isPhoneValid = function(phoneNumber,errorContainer) {
  try {
    return libphonenumber.validate(phoneNumber,'US');
  } catch(e) {
    if(errorContainer) {
      errorContainer.error = e;
    }
    //console.error('libphonenumber.validate error: ' + e.message);
    return false;
  }
};
