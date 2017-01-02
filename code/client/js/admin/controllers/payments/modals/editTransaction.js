angular.module('smartnest.admin.payments')


.service('editTransactionModal', ['$modal', function($modal) {
  return {
    get: function(transaction) {
      var config = {
        controller: 'TransactionEditController',
        templateUrl: 'views/admin/payments/modals/edit.html',
        windowTemplateUrl: 'views/template/modal.html',
        resolve: {
          transaction: function() {
            return transaction;
          }
        }
      };

      return $modal.open(config).result;
    }
  };
}])


.controller('TransactionEditController', ['$scope', '$modalInstance', '_', 'dialogMessage', 'transactionFacade', 'transaction', function($scope, $modalInstance, _, dialogMessage, transactionFacade, transaction) {

  function init() {
    $scope.statuses = {
      CREATED: 'Check Created',
      PENDING: 'Waiting for delivery',
      COMPLETED: 'Completed'
    };
    $scope.transaction = transaction;
    $scope.data = {
      check: _.pick(transaction.check || {}, 'status', 'expected_delivery_date', 'tracking'),
      sendCheck: transaction.sendCheck
    };
  }

  $scope.update = function(transaction, data) {
    dialogMessage.progress();
    transactionFacade.updateTransaction(transaction._id, data).then( function() {
      dialogMessage.success('Transaction has been updated.', 'toast');
      $modalInstance.close();
    }).catch(dialogMessage.danger);
  };

  $scope.dismissModal = function() {
    $modalInstance.dismiss('cancel');
  };

  init();

}]);
