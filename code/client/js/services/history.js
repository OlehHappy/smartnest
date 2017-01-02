angular.module('smartnest.services')

.service('$history', ['$state', function($state) {

  var history = [];

  angular.extend(this, {
    push: function(state, params) {
      history.push({ state: state, params: params });
    },
    all: function() {
      return history;
    },
    go: function(step) {
      var prev = this.previous(step || -1);
      return $state.go(prev.state, prev.params);
    },
    previous: function(step) {
      return history[history.length - Math.abs(step || 1)];
    },
    back: function(default_route, ignored_state) {
      // iterate in reverse order
      var new_state = _.find(_(history).reverse(), function(h) {
        // ignore abstract states
        if (h.state.abstract) {
          return;
        }

        var states = h.state.name.split('.');
        var ignore = _.find(states, function(state) {
          return state == ignored_state;
        });
        if (!ignore) {
          return h;
        }
      });

      if (new_state) {
        $state.go(new_state.state.name, new_state.params);
      } else {
        $state.go(default_route || 'root');
      }
    }
  });
}])


.run(['$history', '$state', '$rootScope', function($history, $state, $rootScope) {
  $rootScope.$on('$stateChangeSuccess', function(event, to, toParams, from, fromParams) {
    if (!from.abstract) {
      $history.push(from, fromParams);
    }
  });

  $history.push($state.current, $state.params);
}]);
