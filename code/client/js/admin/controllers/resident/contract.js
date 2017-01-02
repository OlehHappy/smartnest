angular.module('smartnest.admin.resident')


.controller('AdminResidentContractController', ['$scope', 'contracts', function($scope, contracts) {

  function init() {
    $scope.contracts = contracts;
  }

  init();
}]);
