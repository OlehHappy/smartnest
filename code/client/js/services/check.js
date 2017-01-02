var module = angular.module('smartnest.services');


module.factory("Check", ['$resource', function($resource) {
  return $resource('checks/:checkId', {
    checkId: '@_checkId'
  }, {
    update: {
      method: 'PUT'
    },
    verifyAddress: {
      method: 'POST',
      url: 'checks/verifyAddress'
    }
  });
}]);


module.service('checkFacade', ['Check', function(Check) {
  return {
    verifyAddress: function(address) {
      return Check.verifyAddress(address).$promise;
    }
  };
}]);
