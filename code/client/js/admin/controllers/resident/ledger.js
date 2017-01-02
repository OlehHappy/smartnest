angular.module('smartnest.admin.resident')


.controller('AdminResidentLedgerController', ['$scope', 'transactions', function($scope, transactions) {

  function init() {
    // pagination
    $scope.page_chunk = 10;
    $scope.current_page = 0;
    $scope.transactions = transactions;
  }


  // back to first page
  $scope.resetPagination = function() {
    $scope.current_page = 0;
  };


  init();
}]);
