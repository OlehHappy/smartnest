angular.module('smartnest.header', []).controller('HeaderController', ['$scope', '$state', '$location', '$http', 'Global', function($scope, $state, $location, $http, Global) {
  $scope.global = Global.getUser();

  $scope.$watch( function() {
    return window.user;
  }, function() {
    $scope.global = Global.getUser();
  });

  // Sign Out, remove user
  $scope.signout = function() {
    $http({
      method: 'POST',
      url: 'users/signout'
    }).success( function(result) {
      $scope.global = null;
      Global.setUser(null);
      $state.go('root');
    }).error( function(error) {
      console.error(error);
    });
  };


  // Header Sign In/ Sign Up buttons
  $scope.hideSignin = function() {
    return $location.path() === '/signin';
  };
}]);
