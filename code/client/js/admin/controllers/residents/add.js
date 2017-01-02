angular.module('smartnest.admin.residents')


.controller('AdminResidentAddController', ['$scope', 'flashMessage', 'residentFacade', function($scope, flashMessage, residentFacade) {

  function init() {

  }

  $scope.createResident = function(user, contract) {
    flashMessage.progress('Creating New Resident...');
    return residentFacade.createResident({user: user, contract: contract}).then( function(resident) {
      flashMessage.success('Resident created.', 'toast');
      $scope.$state.go('admin.residents.list.detail', {userId: resident._id}, {reload: true});
    }, flashMessage.danger);
  };

  $scope.onIndividualChanged = function(contract, individual) {
    if (contract.landlord) {
      if (individual === true) {
        delete contract.landlord.company;
      } else {
        delete contract.landlord.first_name;
        delete contract.landlord.last_name;
      }
    }
  };

  init();
}]);
