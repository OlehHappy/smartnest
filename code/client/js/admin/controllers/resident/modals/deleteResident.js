angular.module('smartnest.admin.resident')


.service('deleteResidentModal', ['$modal', function($modal) {
  return {
    get: function(resident) {
      var config = {
        controller: 'ResidentDeleteModalController',
        templateUrl: 'views/admin/residents/modals/delete.html',
        windowTemplateUrl: 'views/template/modal.html',
        resolve: {
          resident: function() {
            return resident;
          }
        }
      };

      return $modal.open(config).result;
    }
  };
}])

.controller('ResidentDeleteModalController', ['$scope', '$modalInstance', 'residentFacade', 'resident', function($scope, $modalInstance, residentFacade, resident) {

  function init() {
    $scope.resident = resident;
  }

  $scope.ok = function(resident) {
    residentFacade.deleteResident(resident._id).then( function() {
      $modalInstance.close();
    });
  };

  $scope.dismissModal = function() {
    $modalInstance.dismiss('cancel');
  };

  init();

}]);
