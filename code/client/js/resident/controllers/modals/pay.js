angular.module('smartnest.resident.modals', ['angularPayments'])


.service('payModal', ['$modal', '$q', function($modal, $q) {
  return {
    get: function(contract, amount, fees, pay_date, recurring) {
      var $modalInstance = $modal.open({
        controller: 'ResidentPayModalController',
        templateUrl: './views/resident/modals/pay.html',
        windowTemplateUrl: 'views/template/modal.html',
        resolve: {
          options: function() {
            return {
              contract: contract,
              amount: amount,
              fees: fees,
              pay_date: pay_date,
              recurring: recurring
            };
          }
        }
      });

      return $modalInstance.result.catch( function(err) {
        return $modalInstance.processed === true ? true : $q.reject(err);
      });
    }
  };
}])


.controller('ResidentPayModalController', ['$scope', '$modalInstance', 'dialogMessage', 'options', function($scope, $modalInstance, dialogMessage, options) {

  function init() {
    $scope.contract = options.contract;
    $scope.amount = options.amount;
    $scope.fees = options.fees;
    $scope.pay_date = options.pay_date;
    $scope.recurring = options.recurring;

    $scope.setPaymentStatus(false);
  }

  $scope.setPaymentStatus = function(status) {
    $scope.processed = $modalInstance.processed = status;
  };

  $scope.dismissModal = function() {
    $modalInstance.dismiss('cancel');
  };

  $scope.successModal = function() {
    $modalInstance.close('Transaction successful.');
  };

  init();
}]);
