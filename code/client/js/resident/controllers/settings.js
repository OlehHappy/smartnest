angular.module('smartnest.resident.settings', [])


.controller('ResidentSettingsController', ['$scope', '$q', 'flashMessage', 'userFacade', 'contractFacade', 'checkFacade', 'user', function($scope, $q, flashMessage, userFacade, contractFacade, checkFacade, user) {

  function init() {
    $scope.user = angular.copy($scope.global.user);
    $scope.user_contract = angular.copy($scope.contract);
    $scope.tmp = {
      email: user.email
    };
    $scope.individual = !$scope.contract.landlord.company;
  }

  $scope.updateSettings = function(user, contract, individual) {
    flashMessage.progress('Updating settings.');
    checkFacade.verifyAddress(contract.landlord.address).then( function(response) {
      if (response.message) {
        return $q.reject("Landlord's " + response.message);
      }
      return userFacade.updateUser('me', user);
    }).then( function() {
      return contractFacade.updateResidentContract(contract._id, $scope.cleanIndividual(contract, individual));
    }).then( function() {
      return userFacade.reloadUser();
    }).then( function() {
      flashMessage.success('Settings updated.', 'toast');
      $scope.$state.reload();
    }, flashMessage.danger);
  };

  $scope.setIndividual = function(individual) {
    $scope.individual = !!individual;
  };

  $scope.cleanIndividual = function(contract, individual) {
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
