angular.module('smartnest.admin.residents')


.controller('AdminResidentListController', ['$scope', 'residents', 'contractFacade', function($scope, residents, contractFacade) {

  function init() {
    $scope.residents = residents;
  }

  $scope.isResidentSelect = function(userId) {
    return $scope.$state.params.userId === userId;
  };

  init();
}]);
