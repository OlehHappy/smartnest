var module = angular.module(
  'smartnest.resident',
  [
    'smartnest.system',
    'smartnest.header',

    'smartnest.resident.index',
    'smartnest.resident.settings',

    'smartnest.resident.modals'
  ]);


module.provider('resolve', [function() {
  this.user = ['userFacade', function(userFacade) {
    return userFacade.getUser('me');
  }];
  this.contracts = ['contractFacade', function(contractFacade) {
    return contractFacade.getResidentContracts();
  }];
  this.transactions = ['transactionFacade', 'contracts', function(transactionFacade, contracts) {
    return transactionFacade.getResidentTransactions(contracts[0]._id);
  }];

  this.$get = {};
}]);


module.config(['stateHelperProvider', 'resolveProvider', '$urlRouterProvider', function(stateHelperProvider, resolveProvider, $urlRouterProvider) {
  stateHelperProvider.setNestedState({
    name: 'resident',
    url: '/resident',
    abstract: true,
    resolve: {
      auth: ['$q', 'Global', function($q, Global) {
        // user is not logged in
        if (!Global.getUser().authenticated) {
          return $q.reject('public.error.401');
        }

        // user is not Resident role
        if (Global.getUser().user.role !== 'RESIDENT') {
          return $q.reject('public.error.401');
        }
      }],
      contracts: resolveProvider.contracts
    },
    views: {
      header: {
        templateUrl: 'views/resident/header.html',
        controller: 'HeaderController'
      },
      main: {
        templateUrl: 'views/resident/index.html',
        controller: 'ResidentController'
      }
    },
    children: [
      {
        name: 'paymyrent',
        url: '/paymyrent',
        templateUrl: 'views/resident/paymyrent.html',
        controller: 'ResidentPaymyrentController',
        resolve: {
          transactions: resolveProvider.transactions
        }
      }, {
        name: 'history',
        url: '/history',
        abstract: true,
        template: '<div ui-view />',
        controller: 'ResidentHistoryController',
        resolve: {
          transactions: resolveProvider.transactions
        },
        children: [
          {
            name: 'list',
            url: '',
            templateUrl: 'views/resident/history.html'
          }
        ]
      }, {
        name: 'settings',
        url: '/settings',
        abstract: true,
        resolve: {
          user: resolveProvider.user
        },
        templateUrl: 'views/resident/settings.html',
        controller: 'ResidentSettingsController',
        children: [{
          name: 'personal',
          url: '',
          templateUrl: 'views/resident/settings/personal.html'
        }, {
          name: 'billing',
          url: '/billing',
          templateUrl: 'views/resident/settings/billing.html'
        }, {
        name: 'password',
        url: '/password',
        templateUrl: 'views/resident/settings/changepassword.html',
        controller: 'ResidentChangePasswordController'
      }]
      }
    ]
  });
}]);
