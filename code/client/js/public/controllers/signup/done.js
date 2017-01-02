angular.module('smartnest.public.index')


.controller('SignupDoneController', ['$scope', function($scope) {

  function init() {
  }

  $scope.gotoAccount = function() {
    $scope.$state.go('root');
  };

  init();
}]);
