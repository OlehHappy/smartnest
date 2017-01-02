angular.module('smartnest.resident.modals')


.service('RecurringCancelModal', ['$modal', 'braintreeService',  function($modal, braintreeService) {
  return {
    get: function(contract) {
      var config = {
        controller: 'GenericModalCtrl',
        templateUrl: 'views/generic_modal.html',
        windowTemplateUrl: 'views/template/modal.html',
        resolve: {
          modalConfig: function() {
            return {
              message: 'Do you really want to cancel Recurring Payment?',
              ok: 'Cancel Recurring Payment',
              cancel: 'Dismiss',
              style: {
                ok: 'bad'
              }
            };
          }
        }
      };

      return $modal.open(config).result.then( function() {
        return braintreeService.cancelRecurring(contract._id);
      });
    }
  };
}]);
