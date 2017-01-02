angular.module('smartnest.services')


.factory('Transaction', ['$resource', function($resource) {
  return $resource('transactions/:transactionId', {
    transactionId: '@_transactionId'
  }, {
    update: {
      method: 'PUT'
    }
  });
}])


.factory('ResidentTransaction', ['$resource', function($resource) {
  return $resource('resident/me/contracts/:contractId/transactions/:transactionId', {
    contractId: '@_contractId',
    transactionId: '@_transactionId'
  }, {
    update: {
      method: 'PUT'
    }
  });
}])


.service('transactionFacade', ['_', 'Transaction', 'ResidentTransaction', function(_, Transaction, ResidentTransaction) {
  return {
    getTransactions: function() {
      return Transaction.query().$promise;
    },
    getTransaction: function(transactionId) {
      return Transaction.get({transactionId: transactionId}).$promise;
    },
    updateTransaction: function(transactionId, data) {
     return Transaction.update({transactionId: transactionId}, data).$promise;
    },

    getResidentTransactions: function(contractId) {
      return ResidentTransaction.query({contractId: contractId}).$promise;
    },

    getLog: function(logs, status) {
      return _.find(logs, function(log) {
        return log.status === status;
      });
    },
    getTransactionStep: function(transaction) {
      var step = 0;
      if (['COMPLETED', 'REVERSED'].indexOf(transaction.payment.status) !== -1) {
        step = 1;
      }
      if (this.getLog(transaction.check.logs, 'CREATED')) {
        step = 2;
      }
      if (transaction.check.status === 'COMPLETED' || Date.parse(transaction.check.expected_delivery_date) < new Date()) {
        step = 3;
      }
      if (transaction.check.status === 'COMPLETED') {
        step = 4;
      }
      return step;
    }
  };
}]);
