var util = require('util');


function HttpError(code, message) {
  Error.call(this);
  Error.captureStackTrace(this, arguments.callee);
  this.name = 'HttpError';
  this.message = message;
  this.statusCode = code;
}
util.inherits(HttpError, Error);
exports.HttpError = HttpError;


function AuthError(type, message) {
  HttpError.call(this);
  Error.captureStackTrace(this, arguments.callee);
  this.name = 'AuthError';
  this.message = message;
  this.statusCode = 401;
  this.authType = type;
}
util.inherits(AuthError, HttpError);
exports.AuthError = AuthError;
