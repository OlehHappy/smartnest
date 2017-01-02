angular.module('smartnest.public.index')


.controller('SignupController', ['$scope', function($scope) {

  function init() {
    var defaults = $scope.$state.params.defaults || {};
    $scope.account = {
      email: defaults.email
    };
    $scope.rent = {
      rent_amount: defaults.rent_amount
    };
  }

  $scope.getCurrentState = function() {
    return $scope.$state.$current.name.split('.').pop();
  };

  $scope.isActive = function(state) {
    return $scope.getCurrentState() === state;
  };

  init();
}]);
