var module = angular.module('smartnest.services');


module.factory("Country", ['$resource', function($resource) {
  return $resource('countries/:countryId', {
    countryId: '@_countryId'
  }, {
    update: {
      method: 'PUT'
    },
    states: {
      method: 'GET',
      url: 'countries/:countryId/states',
      isArray: true
    }
  });
}]);


module.service('countryFacade', ['Country', function(Country) {
  return {
    getCountries: function() {
      return Country.query().$promise;
    },

    getCountry: function(countryId) {
      return Country.get({countryId: countryId}).$promise;
    },

    getStates: function(countryId) {
      return Country.states({countryId: countryId}).$promise;
    }
  };
}]);
