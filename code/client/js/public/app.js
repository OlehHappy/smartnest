//Setting up route
var module = angular.module(
  'smartnest.public',
  [
    'smartnest.system',
    'smartnest.public.index',
    'smartnest.public.generalModal'
  ]);

module.run(['$rootScope', '$state', function($rootScope, $state) {
  $rootScope.$state = $state;
}]);

module.provider('resolve', [function() {
  this.$get = {};
}]);

module.config(['stateHelperProvider', 'resolveProvider', function(stateHelperProvider, resolveProvider) {
  stateHelperProvider.setNestedState({
    name: 'public',
    abstract: true,
    views: {
      header: {
        templateUrl: 'views/public/header.html',
        controller: 'HeaderController'
      },
      main: { template: '<ui-view/>' }
    },
    children: [
      {
        name: 'index',
        url: '/home',
        templateUrl: 'views/public/index.html',
        controller: 'IndexController'
      }, {
        name: 'landing',
        url: '/landing',
        templateUrl: 'views/public/landing.html',
        controller: 'IndexController'
      }, {
        name: 'signup',
        abstract: true,
        url: '/signup',
        params: {
          defaults: {}
        },
        templateUrl: 'views/public/signup.html',
        controller: 'SignupController',
        children: [
          {
            name: 'personal',
            url: '',
            templateUrl: 'views/public/signup/personal.html',
            controller: 'SignupPersonalController'
          },
          {
            name: 'rent',
            url: '/rent',
            templateUrl: 'views/public/signup/rent.html',
            controller: 'SignupRentController'
          },
          {
            name: 'done',
            url: '/done',
            templateUrl: 'views/public/signup/done.html',
            controller: 'SignupDoneController'
          }
        ]
      }, {
        name: 'signin',
        url: '/signin',
        params: {
          email: null
        },
        templateUrl: 'views/public/signin.html',
        controller: 'IndexController',
        children: [{
          name: 'email',
          url: '/:email',
          resolve: {
            email: ['$q', '$stateParams', function($q, $stateParams) {
              return $q.reject({state: 'public.signin', params: {email: $stateParams.email}});
            }]
          }
        }]
      }, {
        name: 'send_reset',
        url: '/send_reset',
        templateUrl: 'views/public/send_reset.html',
        controller: 'IndexController'
      }, {
        name: 'reset',
        url: '/reset/:reset_token',
        templateUrl: 'views/public/reset.html',
        controller: 'IndexController'
      }, {
        name: 'termsofservice',
        url: '/termsofservice',
        templateUrl: 'views/public/termsofservice.html'
      },

      /* Error pages */
      {
        name: 'error',
        abstract: true,
        template: '<ui-view/>',
        children: [
          {
            name: '401',
            templateUrl: 'views/401.html'
          },
          {
            name: '404',
            templateUrl: 'views/404.html'
          }
        ]
      }
    ]
  });
}]);
