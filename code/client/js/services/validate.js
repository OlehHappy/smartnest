angular.module('smartnest.services')


.service('validate', ['$window', function($window) {
  return {

    isObject: function(object) {
      return angular.isObject(object);
    },

    //see if an object has any truthy properties
    hasTruthyProperties: function( obj ) {
      return _.find( obj, function(value) {
        return (value ? true: false);
      }) ? true : false;
    },

    isEmail: function(email) {
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },

    isPhone: function(phone) {
      try {
        return $window.phoneUtils.isValidNumber(phone);
      } catch(e) {
        return false;
      }
    },

    formatPhone: function(phone) {
      return $window.phoneUtils.formatE164(phone);
    },

    //checks if a value is a number
    isNumber: function(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    },

    //returns empty string if everything is ok and an error message if something is wrong.
    numberError: function( value, options ) {
      var composeError = function( options ) {
        var msg = 'Please enter a' + (options.integer ? ' whole' : '' ) + ' number';
        if( options.min && options.max ) {
          msg += ' between ' + options.min + ' and ' + options.max;
        } else if(typeof(options.min) !== 'undefined') {
          msg += ' not lower than ' + options.min;
        } else if(typeof(options.max) !== 'undefined') {
          msg += ' not higher than ' + options.max;
        }
        msg += '.';
        return msg;
      };

      if( isNaN(parseFloat(value)) || !isFinite(value) ) {
        return composeError(options);
      }

      var numVal = parseFloat(value);

      if( options.integer && (numVal%1 !== 0 )) {
        return composeError(options);
      }

      if( (typeof(options.min) !== 'undefined') && (numVal < options.min) ) {
        return composeError(options);
      }

      if( (typeof(options.max) !== 'undefined') && (numVal > options.max) ) {
        return composeError(options);
      }

      return '';
    }

  };
}]);
