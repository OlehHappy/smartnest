angular.module('smartnest.directives')


.directive('braintreePayment', ['flashMessage', 'braintreeService', 'timeService', function(flashMessage, braintreeService, timeService) {
  return {
    restrict: 'E',
    scope: {
      contractId: '=',
      amount: '=',
      isDebit: '=',
      recurring: '=',
      payDate: '=',
      onDone: '&'
    },
    templateUrl: 'views/directives/braintree/braintreePayment.html',
    link: function(scope, elem, attrs) {
      flashMessage.setType('braintree');

      scope.processed = false;
      scope.isProgress = flashMessage.isProgress();


      /* get BT client token from server */
      flashMessage.progress('Connecting to server.');

      braintreeService.getClientToken().then( function(token) {
        scope.clientToken = token;
        flashMessage.removeAll();
      }, flashMessage.danger);


      /* payment act */
      scope.pay = function(card) {
        flashMessage.progress('Please wait your payment is being processed.');

        var BTclient = new braintree.api.Client({
          clientToken: scope.clientToken
        });

        // custom implementation of Braintree form send
        BTclient.tokenizeCard({
          cardholderName: card.name,
          number: card.number.replace(/\s+/g, ''),
          expirationMonth: card.expiration_month.value,
          expirationYear: card.expiration_year.value,
          cvv: card.cvv_code
        }, function(err, nonce) {
          //NOTE: error should never happen
          if (err) {
            //NOTE: 'err' isn't standardized; Still actual or obsolete?
            // https://github.com/braintree/braintree-encryption.js/issues/20
            console.error('Braintree internal error:', err);
            flashMessage.danger('Internal Error. Unable to prepare payment.');
            $scope.$apply(); // force refresh
            return;
          }

          // server payment act call
          braintreeService.pay(scope.contractId, {
            nonce: nonce,
            bin: card.number.replace(/\s+/g, '').substring(0, 6),
            amount: scope.amount,
            recurring: scope.recurring,
            pay_date: timeService.withoutTimezone(scope.payDate)
          }).then( function() {
            flashMessage.success('Transaction was successful.');
            scope.processed = true;
            scope.onDone({});
          }, flashMessage.danger);
        });
      };
    }
  };
}])


.directive('braintreeCardInput', ['flashMessage', 'braintreeService', function(flashMessage, braintreeService) {
  return {
    restrict: 'E',
    scope: {
      pay: '=',
      isDebit: '='
    },
    templateUrl: 'views/directives/braintree/braintreeCardInput.html',
    link: function(scope, elem, attrs) {
      flashMessage.setType('braintree');

      scope.card = {
        number: '',
        name: '',
        cvv_code: ''
      };

      // Expiration Date options
      scope.options = {
        expiration_month: braintreeService.expiration_month,
        expiration_year: braintreeService.expiration_year
      };

      // card data validation
      scope.validateCard = function() {
        scope.validation = braintreeService.validateCard(scope.card);
        if (scope.card.number.length >= 6) {
          braintreeService.isCardDebit(scope.card.number.substring(0, 6)).then( function(isDebit) {
            scope.isDebit = isDebit;
          });
        } else {
          scope.isDebit = undefined;
        }
      };

      // trigger initial validation
      scope.validateCard();
    }
  };
}]);
