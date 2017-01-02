angular.module('smartnest.resident.index')


.controller('ResidentChangePasswordController', ['$scope', 'flashMessage', 'userFacade', 'contractFacade', 'user', function($scope, flashMessage, userFacade, contractFacade, user) {

  function init() {
    $scope.user = user;
    $scope.password = {};
  }

  $scope.updatePassword = function(password) {
    if (password.old === password.new) {
      flashMessage.danger('New password must be different.');
      return;
    }
    flashMessage.progress();
    userFacade.updatePassword(user._id, password.old, password.new).then( function() {
      flashMessage.success('Password changed', 'toast');
      $scope.$state.go('root');
    }).catch( function(error) {
      flashMessage.danger(error.data.err);
    });
  };

  init();
}]);
