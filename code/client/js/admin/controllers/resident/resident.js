angular.module('smartnest.admin.resident', [])


.controller('AdminResidentController', ['$scope', 'userFacade', 'deleteResidentModal', 'resident', function($scope, userFacade, deleteResidentModal, resident) {

  function init() {
    $scope.resident = resident;
  }

  $scope.showDeleteModal = function(resident) {
    deleteResidentModal.get(resident).then( function() {
      $scope.$state.go('admin.residents.list');
    });
  };

  $scope.forceUserLogin = function(resident) {
    userFacade.forceUserLogin(resident._id);
  };

  init();
}]);
