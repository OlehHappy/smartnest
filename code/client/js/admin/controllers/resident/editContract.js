angular.module('smartnest.admin.resident')


.controller('AdminResidentEditContractController', ['$scope', 'contractFacade', 'contract', function($scope, contractFacade, contract) {

  function init() {
    $scope.contract = contract;
    $scope.individual = !contract.landlord.company;
  }

  $scope.setIndividual = function(individual) {
    $scope.individual = !!individual;
  };

  $scope.update = function(contract, individual) {
    contractFacade.updateResidentContract(contract._id, $scope.clearIndividual(contract, individual)).then( function() {
      $scope.$state.go('^.list');
    });
  };

  $scope.clearIndividual = function(contract, individual) {
    if (individual === true) {
      delete contract.landlord.company;
    } else {
      delete contract.landlord.first_name;
      delete contract.landlord.last_name;
    }
    return contract;
  };

  init();
}]);
