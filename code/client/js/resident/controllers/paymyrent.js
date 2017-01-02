angular.module('smartnest.resident.index')


.controller('ResidentPaymyrentController', ['$scope', 'toastMessage', 'braintreeService', 'timeService', 'payFacade', 'transactionFacade', 'payModal', 'RecurringCancelModal', 'transactions', function($scope, toastMessage, braintreeService, timeService, payFacade, transactionFacade, payModal, RecurringCancelModal, transactions) {

  function init() {
    $scope.now = new Date();
    $scope.min_date = timeService.endDay();
    $scope.options = {
      min_amount: 0,
      max_amount: 10000
    };

    $scope.recurring_payment = payFacade.findRecurring($scope.contract, $scope.global.user._id);
    $scope.recurring = !!$scope.recurring_payment;

    if ($scope.recurring_payment) {
      $scope.pay_date = new Date($scope.recurring_payment.pay_date);
      $scope.amount = $scope.recurring_payment.amount;
    } else {
      $scope.pay_date = timeService.startDay(timeService.addDay());
      $scope.amount = $scope.contract.rent_amount;
    }

    $scope.setTransactionsStep(transactions);
    if (transactions.length) {
      $scope.transaction = transactions[0];
    }

    // default zero
    if (!$scope.amount) {
      $scope.amount = 0;
    }

    $scope.updateFees();
  }

  // update fee amount for all Paygates
  $scope.updateFees = function(contract) {
    // prevent requesting of server with invalid values
    if (!$scope.amount || $scope.amount < $scope.options.min_amount || $scope.amount > $scope.options.max_amount) {
      $scope.fees_status = 'invalid';
      return;
    }
    $scope.fees_status = 'computing';

    payFacade.computeFee($scope.amount).then( function(result) {
      $scope.fees_status = 'done';
      $scope.fees = result;
      $scope.onChangeRecurringValues();
    }).catch( function(err) {
      $scope.fees_status = 'error';
    });
  };

  $scope.openPayModal = function() {
    payModal.get($scope.contract, $scope.amount, $scope.fees, $scope.pay_date, $scope.recurring).then( function() {
      $scope.$state.reload();
    });
  };

  $scope.cancelRecurring = function(contract) {
    RecurringCancelModal.get(contract).then( function() {
      $scope.$state.reload();
    }).catch( function(err) {
      $scope.recurring = !!$scope.recurring_payment;
      toastMessage.danger(err);
    });
  };

  $scope.updateRecurring = function(contract, amount) {
    braintreeService.updateRecurring(contract._id, amount).then( function() {
      toastMessage.success('Amount successfully updated.');

      $scope.$state.reload();
    }, toastMessage.danger);
  };

  $scope.increase = function() {
    if ($scope.amount < $scope.options.max_amount){
      $scope.amount++;
    } else {
      $scope.amount = $scope.options.max_amount;
    }
    $scope.updateFees();
  };
  $scope.decrease = function() {
    if ($scope.amount > $scope.options.min_amount){
      $scope.amount--;
    } else {
      $scope.amount = $scope.options.min_amount;
    }
    $scope.updateFees();
  };

  $scope.showDetail = function(id) {
    $scope.showDetailId = id;
  };

  $scope.getLog = function(logs, status) {
    return transactionFacade.getLog(logs, status);
  };

  $scope.getLatestLog = function(logs) {
    return logs[logs.length - 1];
  };

  $scope.setTransactionsStep = function(transactions) {
    _.each(transactions, function(transaction) {
      transaction.step = transactionFacade.getTransactionStep(transaction);
    });
  };

  $scope.getLandlordDate = function(pay_date, recurring) {
    var date = recurring ? pay_date : new Date();
    return date instanceof Date ? timeService.addBusinessDay(date, 5) : undefined;
  };

  $scope.onChangeRecurring = function(recurring, recurring_payment, contract) {
    if (recurring_payment && !recurring) {
      $scope.cancelRecurring(contract);
    }
  };

  $scope.isRecurringChanged = function() {
    return $scope.recurring_payment && ($scope.recurring_payment.amount != $scope.amount);
  };

  $scope.onChangeRecurringValues = function() {
    $scope.recurringChanged = $scope.isRecurringChanged();
  };

  init();
}]);
