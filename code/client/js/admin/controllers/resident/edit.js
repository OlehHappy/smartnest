angular.module('smartnest.admin.resident')


.controller('AdminResidentEditController', ['$scope', 'residentFacade', function($scope, residentFacade) {

  function init() {
  }

  $scope.updateResident = function(resident) {
    residentFacade.updateResident(resident._id, resident).then( function(resident) {
      $scope.$state.go('^.detail');
    });
  };

  init();
}]);
