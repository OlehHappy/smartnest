angular.module('smartnest.services')


.factory('Contract', ['$resource', function($resource) {
  return $resource('contracts/:contractId', {
    contractId: '@_id'
  }, {
    update: {
      method: 'PUT'
    }
  });
}])

.factory('ResidentContract', ['$resource', function($resource) {
  return $resource('resident/me/contracts/:contractId', {
    contractId: '@_id'
  }, {
    update: {
      method: 'PUT'
    }
  });
}])

.service('contractFacade', ['Contract', 'ResidentContract', function(Contract, ResidentContract) {
  return {
    getContracts: function() {
      return Contract.query().$promise;
    },
    getContract: function(contractId) {
      return Contract.get({contractId: contractId}).$promise;
    },
    createContract: function(contract) {
      return Contract.save(contract).$promise;
    },
    updateContract: function(contractId, contract) {
      return Contract.update({contractId: contractId}, contract).$promise;
    },
    deleteContract: function(contractId) {
      return Contract.delete({contractId: contractId}).$promise;
    },
    getResidentContracts: function() {
      return ResidentContract.query().$promise;
    },
    getResidentContract: function(contractId) {
      return ResidentContract.get({contractId: contractId}).$promise;
    },
    createResidentContract: function(contract) {
      return ResidentContract.save(contract).$promise;
    },
    updateResidentContract: function(contractId, contract) {
      return ResidentContract.update({contractId: contractId}, contract).$promise;
    },
    deleteResidentContract: function(contractId) {
      return ResidentContract.delete({contractId: contractId}).$promise;
    }
  };
}]);
