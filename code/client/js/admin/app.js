var module = angular.module(
  'smartnest.admin',
  [
    'smartnest.system',

    'smartnest.admin.index',
    'smartnest.admin.users.edit',
    'smartnest.admin.admintools',

    'smartnest.admin.residents',
    'smartnest.admin.resident',
    'smartnest.admin.payments'
  ]);

module.provider('resolve', [function() {
  this.contract = ['$q', '$stateParams', 'contractFacade', function($q, $stateParams, contractFacade) {
    if (!$stateParams.contractId) {
      return $q.reject('admin.residents.list');
    }
    return contractFacade.getContract($stateParams.contractId);
  }];
  this.residents = ['residentFacade', function(residentFacade) {
    return residentFacade.getResidents();
  }];
  this.resident = ['$stateParams', 'residentFacade', function($stateParams, residentFacade) {
    return residentFacade.getResident($stateParams.userId);
  }];
  this.contracts = ['$stateParams', 'residentFacade', function($stateParams, residentFacade) {
    return residentFacade.contracts($stateParams.userId);
  }];
  this.contract = ['$stateParams', 'contractFacade', function($stateParams, contractFacade) {
    return contractFacade.getContract($stateParams.contractId);
  }];
  this.ledger = ['$stateParams', 'residentFacade', function($stateParams, residentFacade) {
    return residentFacade.ledger($stateParams.userId);
  }];
  this.user = ['$stateParams', 'userFacade', function($stateParams, userFacade) {
    return userFacade.getUser($stateParams.userId);
  }];
  this.transactions = ['transactionFacade', function(transactionFacade) {
    return transactionFacade.getTransactions();
  }];

  this.$get = {};
}]);

module.config(['stateHelperProvider', 'resolveProvider', function(stateHelperProvider, resolveProvider) {
  stateHelperProvider.setNestedState({
    name: 'admin',
    url: '/admin',
    resolve: {
      auth: ['$q', 'Global', function($q, Global) {
        // user is not logged in
        if (!Global.getUser().authenticated) {
          return $q.reject('public.error.401');
        }

        // user is not Admin role
        if (Global.getUser().user.role != 'ADMIN') {
          return $q.reject('public.error.401');
        }
      }]
    },
    views: {
      header: {
        templateUrl: 'views/admin/header.html',
        controller: 'HeaderController'
      },
      main: {
        templateUrl: 'views/admin/index.html',
        controller: 'AdminIndexController'
      }
    },
    children: [
      {
        name: 'dashboard',
        url: '',
        templateUrl: 'views/admin/dashboard.html'
      },

      /* Admin's Profile page & User edit */
      {
        name: 'user',
        abstract: true,
        url: '/user/:userId',
        resolve: {
          user: resolveProvider.user
        },
        template: '<ui-view />',
        children: [{
          name: 'edit',
          url: '/edit',
          templateUrl: 'views/admin/users/edit.html',
          controller: 'AdminUserEditController'
        }]
      },


      /* SuperAdmin tools */
      {
        name: 'admintools',
        url: '/admintools',
        templateUrl: 'views/admin/administration/admintools.html',
        controller: 'AdminAdmintoolsController'
      },

      /* Renters */
      {
        name: 'residents',
        url: '/residents',
        abstract: true,
        templateUrl: 'views/admin/residents/index.html',
        controller: 'AdminResidentsController',
        children: [{
            name: 'list',
            url: '',
            resolve: {
              residents: resolveProvider.residents
            },
            templateUrl: 'views/admin/residents/list.html',
            controller: 'AdminResidentListController',
            children: [{
                name: 'detail',
                url: '/:userId/detail',
                resolve: {
                  resident: resolveProvider.resident
                },
                templateUrl: 'views/admin/residents/detail.html',
                controller: 'AdminResidentDetailController'
              }, {
                name: 'edit',
                url: '/:userId/edit',
                resolve: {
                  resident: resolveProvider.resident
                },
                templateUrl: 'views/admin/residents/edit.html',
                controller: 'AdminResidentsEditController'
              }, {
                name: 'add',
                url: '/add',
                templateUrl: 'views/admin/residents/add.html',
                controller: 'AdminResidentAddController'
              }]
            }
        ]
      },

      /* Renter - Full Profile */
      {
        name: 'resident',
        url: '/resident/:userId',
        abstract: true,
        resolve: {
          resident: resolveProvider.resident
        },
        templateUrl: 'views/admin/resident/index.html',
        controller: 'AdminResidentController',
        children: [{
            name: 'personal',
            url: '/personal',
            abstract: true,
            template: '<ui-view />',
            children: [{
              name: 'detail',
              url: '',
              templateUrl: 'views/admin/resident/personal.html',
              controller: 'AdminResidentInfoController'
            }, {
              name: 'edit',
              url: '/edit',
              templateUrl: 'views/admin/resident/edit.html',
              controller: 'AdminResidentEditController'
            }]
          }, {
            name: 'contracts',
            url: '/contracts',
            abstract: true,
            template: '<ui-view />',
            children: [{
              name: 'list',
              url: '',
              resolve: {
                contracts: resolveProvider.contracts
              },
              templateUrl: 'views/admin/resident/contract.html',
              controller: 'AdminResidentContractController'
            }, {
              name: 'edit',
              url: '/:contractId/edit',
              resolve: {
                contract: resolveProvider.contract
              },
              templateUrl: 'views/admin/resident/editContract.html',
              controller: 'AdminResidentEditContractController'
            }]
          }, {
            name: 'ledger',
            url: '/ledger',
            templateUrl: 'views/admin/resident/ledger.html',
            controller: 'AdminResidentLedgerController',
            resolve: {
              transactions: resolveProvider.ledger
            }
          }]
      },


      /* Payments */
      {
        name: 'payments',
        abstract: true,
        url: '/payments',
        resolve: {
          transactions: resolveProvider.transactions
        },
        templateUrl: 'views/admin/payments/index.html',
        controller: 'AdminPaymentsController',
        children: [{
            name: 'list',
            url: '',
            abstract: true,
            templateUrl: 'views/admin/payments/list.html',
            controller: 'AdminPaymentsListController',
            children: [{
                name: 'all',
                url: '',
                templateUrl: 'views/admin/payments/all.html'
              }]
          }]
      }
    ]
  });
}]);
