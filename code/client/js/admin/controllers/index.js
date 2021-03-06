angular.module('smartnest.admin.index', [])


.controller('AdminIndexController', ['$rootScope', '$scope', '$state', '$history', 'Global', function($rootScope, $scope, $state, $history, Global) {

  function init() {
    $scope.Math = Math;
    $scope.$state = $state; // usage of "$state" in templates for highlighting of links
    $scope.$history = $history;
    $scope.global = Global.getUser();

    $rootScope.isDropdown = 'is-hidden';
    // Default nav classes
    $rootScope.isNavShown = 'is-hidden';
    $rootScope.isNavOpened = "is-inactive";
  }

  // TOGGLE without param, SET with param
  $rootScope.toggleNav = function(state) {
    state = state !== undefined ? state : $rootScope.isNavShown === 'is-hidden';
    $rootScope.isNavShown = state ? 'is-shown' : 'is-hidden';
  };

  // TOGGLE without param, SET with param
  $rootScope.showNav = function(state) {
    state = state !== undefined ? state : $rootScope.isNavOpened === 'is-inactive';
    $rootScope.isNavOpened = state ? 'is-active' : 'is-inactive';
  };
  
  $rootScope.showDropdown = function($event, state) {
    state = state !== undefined ? state : $rootScope.isDropdown === 'is-hidden';
    $rootScope.isDropdown = state ? 'is-shown' : 'is-hidden';
    $event.stopPropagation();
  };

  window.onclick = function() {
    if ($rootScope.isDropdown === 'is-shown') {
      $rootScope.isDropdown = 'is-hidden';

      // You should let angular know about the update that you have made, so that it can refresh the UI
      $rootScope.$apply();
    }
  };

  init();
}]);
