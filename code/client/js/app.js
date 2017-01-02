var app = angular.module(
  'smartnest',
  [
    'smartnest.public',
    'smartnest.admin',
    'smartnest.resident',
    'smartnest.header',
    'angular-google-analytics'
  ]);


// missing $location prefix fix
if (window.location.hash && window.location.hash.indexOf('#!') == -1) {
  window.location.hash = '#!' + window.location.hash.slice(1);
}


window.app = app;

// our $location requires '#!'
app.config(['$locationProvider', function($locationProvider) {
  $locationProvider.hashPrefix('!');
}]);


// 401 error handling
app.factory('sessionInterceptor', ['$q', '$rootScope', '$injector', 'Global', function($q, $rootScope, $injector, Global) {
  // check if version number of Client and Server matches
  function checkVersionUpdate(response) {
    var headers = response.headers();
    if (headers['app-version']) {
      //console.log('App version:', window.appConfig.version);
      //console.log('Server version:', headers['app-version']);
      if (window.appConfig && window.appConfig.version != headers['app-version']) {
        // force reload of entire App
        var $window = $injector.get('$window');
        $window.location.reload();
      }
    }
  }


  return {
    // success
    response: function(response) {
      checkVersionUpdate(response);
      return response;
    },

    // error
    responseError: function(response) {
      checkVersionUpdate(response);
      var status = response.status;

      // TODO: Change status 401 to 400 on login request (url: users/session) on BE and delete this condition
      if (status == 401 && !response.headers('x-auth-type') && response.config.url !== 'users/session') {
        var $state = $injector.get('$state');

        // User is not logged or session has expired
        if (response.data == 'You have to be logged for this action.') {
          Global.setUser(null); // SignOut the User
          $rootScope._error = 'We are sorry. Your session expired!';
          $state.go('public.signin');
        }

        // display 401 error message
        $state.go('public.error.401');
      }
      return $q.reject(response);
    }
  };
}]);

app.config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push('sessionInterceptor');
}]);


app.config(['stateHelperProvider', '$urlRouterProvider', function(stateHelperProvider, $urlRouterProvider) {
  stateHelperProvider.setNestedState({
    name: 'root',
    url: '/',
    views: {
      main: {
        controller: ['$state', 'Global', function ($state, Global) {
          var global = Global.getUser();

          if (!global.authenticated) {
            return $state.go('public.index');
          }

          switch (global.user.role) {
            case 'RESIDENT':
              return $state.go('resident.paymyrent');
            default:
              return $state.go('admin.dashboard');
          }
        }]
      }
    }
  });

  $urlRouterProvider.otherwise( function($injector, $location) {
    var state = $injector.get('$state');
    state.go('public.error.404');
    return $location.path();
  });
}]);


app.config(['$routeProvider', function($routeProvider) {}]).run(['$rootScope', '$location', 'Global', '$state', function($rootScope, $location, Global, $state) {
  // initial redirect to the Angular App
  if (!$location.path() && window.location.pathname == '/') {
    $location.path('/');
  }

  // We have to set document.body.id in right time. If it is too early
  // we have flashes of old state with wrong css. If it is too late we
  // can see new state with wrong css ;( wt.. of css design.
  var newToState, loading = false;

  function updateRootScope() {
    if (newToState) {
      $rootScope.state = newToState.name;
      $rootScope.bodyId = newToState.bodyId;
    }
  }

  $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, rejection) {
    if (angular.isString(rejection) && $state.get(rejection, toParams)) {
      return $state.go(rejection, toParams, {reload: true});
    } else if (angular.isObject(rejection) && angular.isString(rejection.state) && $state.get(rejection.state, rejection.params || {})) {
      return $state.go(rejection.state, rejection.params || {}, {reload: true});
    }

    //TODO
    console.log('rejection', rejection);

    return $state.go('public.error.404');
  });

  // page changed
  $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    var bodyClass = [];
    var states = toState.name.split('.');
    states.unshift('state');
    for (var i = 1; i < states.length; i++) {
      bodyClass.push(states.slice(0, i+1).join('-'));
    }
    $rootScope.bodyClass = bodyClass;

    newToState = toState;
    if (loading) {
      updateRootScope();
    }
  });

  //TODO is this required?
  $rootScope.$on('$viewContentLoading', function(event) {
    loading = true;
    updateRootScope();
  });

  $rootScope.$on('$viewContentLoaded', function(event) {
    updateRootScope();
    loading = false;
  });
  //---
}]);


app.config(['$provide', function($provide) {
  return $provide.decorator('$state', ['$delegate', '$rootScope', function($delegate, $rootScope) {
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
      $delegate.toState = toState;
      $delegate.toParams = toParams;
    });
    return $delegate;
  }]);
}]);

/*
 * Google Analytics
 */
app.config(function(AnalyticsProvider) {
  // initial configuration
  AnalyticsProvider.setAccount('UA-68771993-1');

  if (window.location.hash === '#!/landing') {
    // enable analytics.js experiments
    AnalyticsProvider.setExperimentId('I2YUYAXxTaSmf8hguVaxvg');
  }
});
