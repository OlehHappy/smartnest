var module = angular.module('smartnest.services');


module.factory('BraintreeSubMerchant', ['$resource', function($resource) {
  return $resource('property/:propertyId/BTsubMerchant', {
    propertyId: '@_propertyId'
  }, {
    update: {
      method: 'PUT'
    }
  });
}]);


module.factory('BraintreePay', ['$resource', function($resource) {
  return $resource('pay/braintree/contract/:contractId', {
    contractId: '@_contractId'
  }, {
    pay: {
      method: 'POST',
      url: 'pay/braintree/contract/:contractId/pay'
    },
    cancelRecurring: {
      method: 'DELETE',
      url: 'pay/braintree/contract/:contractId/recurring'
    },
    updateRecurring: {
      method: 'PUT',
      url: 'pay/braintree/contract/:contractId/recurring'
    },
    isCardDebit: {
      method: 'POST',
      url: 'braintree/isCardDebit'
    }
  });
}]);


module.service('braintreeSubMerchantFacade', ['BraintreeSubMerchant', function(BraintreeSubMerchant) {
  return {
    get: function(propertyId) {
      return BraintreeSubMerchant.get({propertyId: propertyId}).$promise;
    },
    update: function(propertyId, data) {
      return BraintreeSubMerchant.update({propertyId: propertyId}, data).$promise;
    },
    create: function(propertyId, data) {
      return BraintreeSubMerchant.save({propertyId: propertyId}, data).$promise;
    }
  };
}]);


module.service('braintreeService', ['$http', '$q', 'BraintreePay', function($http, $q, BraintreePay) {
  var debitCardCache = {};

  return {
    /* request server for ClientToken */
    getClientToken: function() {
      return $http({
        method: 'POST',
        url: 'braintree/generateClientToken',
        data: {
          //NOTE: blank, in future we can provide clientID
        }
      }).then( function(response) {
        if (response.data && response.data.clientToken) {
          return response.data.clientToken;
        } else {
          return $q.reject();
        }
      }).catch( function(err) {
        // display internal error
        return $q.reject('Internal Error. Unable to prepare payment.');
      });
    },

    /* Payment action */
    pay: function(contractId, data) {
      return BraintreePay.pay({contractId: contractId}, data).$promise;
    },

    isCardDebit: function(bin) {
      if (debitCardCache[bin] !== undefined) {
        return $q.resolve(debitCardCache[bin]);
      }

      return BraintreePay.isCardDebit({bin: bin}).$promise.then( function(response) {
        debitCardCache[bin] = response.debit;
        return response.debit;
      });
    },

    cancelRecurring: function(contractId) {
      return BraintreePay.cancelRecurring({contractId: contractId}).$promise;
    },

    updateRecurring: function(contractId, amount) {
      return BraintreePay.updateRecurring({contractId: contractId}, {
        amount: amount
      }).$promise;
    },

    /* expiration date select options */
    expiration_month: [
      {label: '01 - January', value: '01'},
      {label: '02 - February', value: '02'},
      {label: '03 - March', value: '03'},
      {label: '04 - April', value: '04'},
      {label: '05 - May', value: '05'},
      {label: '06 - June', value: '06'},
      {label: '07 - July', value: '07'},
      {label: '08 - August', value: '08'},
      {label: '09 - September', value: '09'},
      {label: '10 - October', value: '10'},
      {label: '11 - November', value: '11'},
      {label: '12 - December', value: '12'}
    ],
    expiration_year: [
      {label: '2014', value: '14'},
      {label: '2015', value: '15'},
      {label: '2016', value: '16'},
      {label: '2017', value: '17'},
      {label: '2018', value: '18'},
      {label: '2019', value: '19'},
      {label: '2020', value: '20'},
      {label: '2021', value: '21'},
      {label: '2022', value: '22'},
      {label: '2023', value: '23'},
      {label: '2024', value: '24'},
      {label: '2025', value: '25'}
    ],


    /**
     * NOTE: Luhn validation algorithm
     * taken from https://gist.github.com/ShirtlessKirk/2134376
     * best performance
     */
    checkLuhn: function(cardNumber) {
      var len = cardNumber.length,
          mul = 0,
          prodArr = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [0, 2, 4, 6, 8, 1, 3, 5, 7, 9]],
          sum = 0;

      while (len--) {
        sum += prodArr[mul][parseInt(cardNumber.charAt(len), 10)];
        mul ^= 1;
      }
      return sum % 10 === 0 && sum > 0;
    },


    /**
     * Card data validation
     *
     * Card object:
     *  -name
     *  -number
     *  -cvv_code
     *  -expiration_month
     *  -expiration_year
     */
    validateCard: function(card) {
      // name cannot start with number
      var isNameValid = !card.name.match(/^\d/);


      // remove whitespaces
      var numberToValidate = card.number.replace(/\s+/g, '');

      //NOTE: double negation converts variable to Boolean

      /**
      * Card Number
      * NOTE: - American Express has 15 digits, others 16
      *       - must pass Luhn algorithm
      */
      var isNumberValid = !!( !isNaN(numberToValidate) && (numberToValidate.length == 15 || numberToValidate.length == 16) && this.checkLuhn(numberToValidate) );

      /**
      * CVV
      * NOTE: American Express has 4-digit CVV;
      *       AmEx cards starts with digits '34' or '37'.
      */
      var allowedCVVlength = 3;
      if ( numberToValidate.match(/^3[47]/) ) {
        allowedCVVlength = 4;
      }
      var isCvvValid = !!( !isNaN(card.cvv_code) && (card.cvv_code.length == allowedCVVlength) );



      // check expiration dates presence
      var isExpirationValid = !!( card.expiration_month && card.expiration_month.value && card.expiration_year && card.expiration_year.value );
      if (isExpirationValid) {
        // expiration date check
        var today = new Date();
        var currentMonth = today.getMonth() + 1;
        var currentYear = today.getFullYear().toString().substr(2, 2);

        if (currentYear > card.expiration_year.value) {
          isExpirationValid = false;
        } else if (currentYear == card.expiration_year.value) {
          if (currentMonth > parseInt(card.expiration_month.value)) {
            isExpirationValid = false;
          }
        }
      }

      // return result of validation
      return {
        name: isNameValid,
        number: isNumberValid,
        cvv_code: isCvvValid,
        expiration_date: isExpirationValid,
        card: (isNameValid && isNumberValid && isCvvValid && isExpirationValid)
      };
    }
  };
}]);
