angular.module('smartnest.admin.residents', [])


.controller('AdminResidentsController', ['$scope', '_', 'filterStorage', function($scope, _, filterStorage) {

  function init() {
    $scope.filter = filterStorage.get('filter');
  }

  $scope.applyFilters = function(residents) {
    return residents;
  };

  $scope.goToTop = function() {
    window.scrollTo(0,0);
  };

  init();
}]);
