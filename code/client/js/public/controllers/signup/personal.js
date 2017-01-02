angular.module('smartnest.public.index')


.controller('SignupPersonalController', ['$scope', function($scope) {

  function init() {
  }

  $scope.next = function(account) {
    $scope.$state.go('^.rent');
  };

  init();
}]);
