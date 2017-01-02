angular.module('smartnest.admin.admintools', []).controller('AdminAdmintoolsController', ['$scope', '$state', '$http', '_', function($scope, $state, $http, _) {
  
  $scope.settingsLoaded = false;
  $scope.sessionsDeleteResult = false;
  $scope.applyResult = false;
  $scope.settings = {};

  
  // get settings from DB
  function init() {
    // check permissions
    if ( !$scope.global.user || $scope.global.user.role != 'admin') {
      $state.go('root');
    }

    $http({
      method: 'GET',
      url: 'administration'
    }).success( function(response) {
      $scope.settingsLoaded = true;
      $scope.settings = response;
    }).error( function(err) {
      console.error("Unable to GET administration settings:", err);
    });
  }


  // logout all SmartNest users
  //TODO modal confirmation?
  $scope.deleteSessions = function() {
    $scope.sessionsDeleteResult = false;

    $http({
      method: 'POST',
      url: 'administration/deleteSessions',
      data: {
        confirmation: true
      }
    }).success( function(response) {
      $scope.sessionsDeleteResult = "Success";
    }).error( function(err) {
      $scope.sessionsDeleteResult = "Error";
      console.error("Unable to SET administration settings:", err);
    });
  };


  // save new settings
  $scope.applySettings = function() {
    $scope.applyResult = false;

    $http({
      method: 'POST',
      url: 'administration',
      data: $scope.settings
    }).success( function(response) {
      $scope.applyResult = "Success";
      $scope.settings = response;
    }).error( function(err) {
      $scope.applyResult = "Error";
      console.error("Unable to SET administration settings:", err);
    });
  };
  
  
  init();
}]);