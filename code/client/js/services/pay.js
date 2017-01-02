var module = angular.module('smartnest.services');


module.factory('Pay', ['$resource', function($resource) {
  return $resource('', {}, {
    computeFee: {
      method: 'POST',
      url: 'pay/computeFee'
    }
  });
}]);


module.service('payFacade', ['_', 'Pay', function(_, Pay) {
  return {
    computeFee: function(amount) {
      return Pay.computeFee({amount: amount}).$promise;
    },
    findRecurring: function(contract, userId) {
      return _.find(contract.recurring_payments || [], function(recurring_payment) {
        return recurring_payment.user === userId;
      });
    }
  };
}]);
