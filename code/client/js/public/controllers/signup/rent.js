angular.module('smartnest.public.index')


.controller('SignupRentController', ['$scope', '$q', 'flashMessage', 'userFacade', 'contractFacade', 'checkFacade', function($scope, $q, flashMessage, userFacade, contractFacade, checkFacade) {

  function init() {
    flashMessage.setType('page');
    $scope.individual = false;
  }

  $scope.signup = function(account, rent, individual) {
    flashMessage.progress();
    checkFacade.verifyAddress(rent.landlord.address).then( function(response) {
      if (response.message) {
        return $q.reject("Landlord's " + response.message);
      }
      return userFacade.register(account);
    }).then( function() {
      return userFacade.reloadUser();
    }).then( function() {
      return contractFacade.createResidentContract($scope.cleanIndividual(rent, individual));
    }).then( function() {
      flashMessage.removeAll();
      $scope.$state.go('^.done');
    }, flashMessage.danger);
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

  $scope.back = function(account) {
    $scope.$state.go('^.personal');
  };

  init();
}]);
