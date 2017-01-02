angular.module('smartnest.public.generalModal', ['ui.bootstrap'])


.controller('GenericModalCtrl', ['$scope', '$modalInstance', '$modal', 'modalConfig', function($scope, $modalInstance, $modal, modalConfig) {

  $scope.modalConfig = modalConfig;

  // submit modal window
  $scope.ok = function() {
    $modalInstance.close(true);
  };

  // cancel modal window
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };

}]);
