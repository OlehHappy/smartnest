angular.module('smartnest.public.index', [])


.controller('IndexController', ['$scope', '$stateParams', '$window', '$compile', 'Global', 'flashMessage', 'userFacade', 'Analytics', function($scope, $stateParams, $window, $compile, Global, flashMessage, userFacade, Analytics) {

  function init() {
    flashMessage.setType('page');
    $scope.user = {
      email: $stateParams.email
    };
    $scope.pay_period = true;
    if (Global.getUser().authenticated) {
      $scope.$state.go('root');
    }
  }


  $scope.signin = function(user) {
    flashMessage.progress();
    userFacade.login(user.email, user.password).then( function() {
      $scope.$state.go('root');
    }).catch( function() {
      flashMessage.danger('Invalid email or password.');
    });
  };


  $scope.resetPassword = function(user) {
    flashMessage.progress();
    userFacade.resetPassword(user.email).then( function() {
      flashMessage.success('We sent you an email.');
      $scope.hideResetForm = true;
    }).catch( function(error) {
      flashMessage.danger(error.data.err);
    });
  };


  $scope.changePassword = function(user) {
    flashMessage.progress();
    userFacade.changePassword($stateParams.reset_token, user.password).then( function() {
      flashMessage.success('Password updated', 'toast');
      $scope.$state.go('root');
    }).catch( function(error) {
      flashMessage.danger(error.err);
    });
  };


  $scope.next = function(user) {
    $scope.$state.go('public.signup.personal', {defaults: user});
    Analytics.trackEvent('event', 'click', 'button', 1, 'Next Page');
  };


  init();
}]);
