angular.module('smartnest.resident.index')


.controller('ResidentHistoryController', ['$scope', 'transactionFacade', 'transactions', function($scope, transactionFacade, transactions) {

  function init() {
    $scope.setTransactionsStep(transactions);
    $scope.transactions = transactions;

    var sum = _.reduce(transactions, function(memo, transaction) {
      return memo + transaction.amount;
    }, 0);

    $scope.averageRent = sum / $scope.transactions.length;
  }

  $scope.showDetail = function(id) {
    $scope.showDetailId = id;
  };

  $scope.getLog = function(logs, status) {
    return transactionFacade.getLog(logs, status);
  };

  $scope.getLatestLog = function(logs) {
    return logs[logs.length - 1];
  };

  $scope.setTransactionsStep = function(transactions) {
    _.each(transactions, function(transaction) {
      transaction.step = transactionFacade.getTransactionStep(transaction);
    });
  };

  init();
}]);
