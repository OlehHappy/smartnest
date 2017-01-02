angular.module('smartnest.admin.residents')


.controller('AdminResidentsEditController', ['$scope', 'flashMessage', 'residentFacade', 'resident', function($scope, flashMessage, residentFacade, resident) {

  function init() {
    $scope.resident = resident;
  }

  $scope.updateResident = function(resident) {
    flashMessage.progress('Updating Resident ...');
    return residentFacade.updateResident(resident._id, resident).then( function(resident) {
      flashMessage.success('Resident updated.');
      $scope.$state.go('admin.residents.list.detail', {userId: resident._id}, {reload: true});
    }, flashMessage.danger);
  };


  init();
}]);
