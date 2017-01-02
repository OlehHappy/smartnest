var module = angular.module('smartnest.services');


module.factory('Resident', ['$resource', function($resource) {
  return $resource('residents/:userId', {
    userId: '@_id'
  }, {
    update: {
      method: 'PUT'
    },
    contracts: {
      method: 'GET',
      url: 'residents/:userId/contracts',
      isArray: true
    },
    ledger: {
      method: 'GET',
      url: 'residents/:userId/ledger',
      isArray: true
    }
  });
}]);


module.service('residentFacade', ['Resident', function(Resident) {
  return {
    getResidents: function() {
      return Resident.query().$promise;
    },
    getResident: function(userId) {
      return Resident.get({userId: userId}).$promise;
    },
    createResident: function(resident) {
      return Resident.save(resident).$promise;
    },
    updateResident: function(userId, resident) {
      return Resident.update({userId: userId}, resident).$promise;
    },
    deleteResident: function(userId) {
      return Resident.delete({userId: userId}).$promise;
    },
    contracts: function(userId) {
      return Resident.contracts({userId: userId}).$promise;
    },
    ledger: function(userId) {
      return Resident.ledger({userId: userId}).$promise;
    }
  };
}]);
