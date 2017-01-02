angular.module('smartnest.services')


.service('filterStorage', ['$localStorage', '$state', '_', function($localStorage, $state, _) {
  $localStorage.filterStore = [];

  return {
    getState: function() {
      var names = $state.current.name.split('.');
      return names[2] ? names[2] : '';
    },
    get: function(name, defaults, permanent) {
      var state = this.getState();
      var filter = _.find($localStorage.filterStore, function(filter) {
        return filter.name === name && filter.state === state;
      });
      return filter ? filter.filter : this.set(name, defaults !== undefined ? defaults : {}, permanent);
    },
    set: function(name, filter, permanent) {
      this.remove(name);
      $localStorage.filterStore.push({
        name: name,
        state: this.getState(),
        permanent: permanent === true ? true : false,
        filter: filter
      });
      return filter;
    },
    remove: function(name) {
      if (!this.isFilterSet()) return;
      var state = this.getState();
      for (var i = $localStorage.filterStore.length; i--;) {
        if ($localStorage.filterStore[i].name === name && $localStorage.filterStore[i].state === state) {
          $localStorage.filterStore.splice(i, 1);
        }
      }
    },
    clean: function() {
      if (!this.isFilterSet()) return;
      var state = this.getState();
      for (var i = $localStorage.filterStore.length; i--;) {
        if ($localStorage.filterStore[i].permanent !== true && $localStorage.filterStore[i].state !== state) {
          $localStorage.filterStore.splice(i, 1);
        }
      }
    },
    isFilterSet: function() {
      return angular.isArray($localStorage.filterStore) && $localStorage.filterStore.length > 0;
    }
  };
}])



.run(['$rootScope', 'filterStorage', function($rootScope, filterStorage) {

  $rootScope.$on('$stateChangeSuccess', function() {
    filterStorage.clean();
  });

}]);


