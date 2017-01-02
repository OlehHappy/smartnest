angular.module('smartnest.admin.residents')


.controller('AdminResidentDetailController', ['$scope', 'deleteResidentModal', 'resident', function($scope, deleteResidentModal, resident) {

  function init() {
    $scope.resident = resident;
  }

  $scope.showDeleteModal = function(resident) {
    deleteResidentModal.get(resident).then( function() {
      $scope.$state.go('admin.residents.list', {}, {reload: true});
    });
  };

  init();
}]);

