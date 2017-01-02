angular.module('smartnest.admin.users.edit', []).controller('AdminUserEditController', ['$scope', '$window', 'Global', 'user', function($scope, $window, Global, user) {

  function init() {
    $scope.user = user;
    $scope.excludeEmail = $scope.user.email;
  }
  
  $scope.goBack = function() {
    $window.history.back();
  };

  // save changes
  $scope.update = function() {
    $scope.successMessage = '';
    $scope.errorMessage = '';

    if ($scope.user.password === '') {
      delete $scope.user.password;
    }

    $scope.user.$update( function(user) {
      // update my own profile
      if (user._id == $scope.global.user._id) {
        $scope.global.user = user;

        // set User as another reference
        Global.setUser( angular.copy(user) );
      }

      $scope.password_check = '';

      // success
      $scope.successMessage = 'Account has been successfully updated.';
    }, function(error) {
      $scope.errorMessage = error.data;
    });
  };

  init();
}]);
