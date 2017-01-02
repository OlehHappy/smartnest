angular.module('smartnest.admin.payments', [])


.controller('AdminPaymentsController', ['$scope', 'transactions', function($scope, transactions) {

  function init() {
    $scope.transactions = transactions;
  }

  init();
}]);
