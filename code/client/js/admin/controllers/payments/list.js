angular.module('smartnest.admin.payments')


.controller('AdminPaymentsListController', ['$scope', 'flashMessage', 'filterStorage', 'transactionFacade', 'editTransactionModal', function($scope, flashMessage, filterStorage, transactionFacade, editTransactionModal) {

  function init() {
    $scope.filter = filterStorage.get('filter');
    $scope.filter.gateway_filter = 'all';
    // pagination - records per page
    $scope.page_chunk = 20;
    $scope.current_page = 0;
  }

  $scope.resetPagination = function() {
    $scope.current_page = 0;
  };

  // Reversed Transactions only
  $scope.reversedFilter = function(record) {
    return record.status === 'REVERSED';
  };

  // filter by Transaction Gateway
  $scope.gatewayFilter = function(record) {
    if ($scope.filter.gateway_filter === 'all') {
      return true;
    }
    return $scope.filter.gateway_filter === record.payment.gateway;
  };


  // ------- Export markers -------
  // assigning of color logic
  $scope.known_colors = [];

  $scope.getMarkerColor = function(mark) {
    // convert into string
    mark = '' + mark;

    // NOBATCH
    if (mark == -1) {
      return 'transparent';
    }

    if ( $scope.known_colors.indexOf(mark) == -1 ) {
      $scope.known_colors.push(mark);
    }
    return transactionService.color_wheel[ $scope.known_colors.indexOf(mark) % transactionService.color_wheel.length ][1];
  };


  // mark transactions modal after export
  $scope.markTransactions = function(transactions_id_list) {
    // 'successfully transfered' -> mark transactions as exported
    transactionExportModal.open().then( function(response) {
      if (response) {
        var exported_mark = new Date().getTime();

        $http({
          method: 'POST',
          url: 'transaction/markExportedTransactions',
          data: {
            exported_mark: exported_mark,
            transactions: transactions_id_list
          }
        }).success( function(data) {
          // update list of batches
          $scope.$state.reload();
        }).error( function(error) {
          console.error(error);
        });
      }
    });
  };


  // ------- CSV export -------
  $scope.CSVexport = function() {
    // filename construction
    var property_name = $scope.property.name.replace(/ /g, "");
    var date = moment().format('MMDDYYYY');
    var filename = property_name + date;

    // list of requested transactions
    var transactions_id_list = [];
    _.each($scope.parentScope.filteredData, function(t) {
      // filter for only_new
      if (t.exported_mark) {
        return;
      }
      transactions_id_list.push(t._id);
    });

    // error catch
    if (!transactions_id_list.length) {
      $scope.export_error = true;
      $timeout( function() {
        $scope.export_error = false;
      }, 1200);
      return;
    }

    /*
      NOTE: Based on new clientside only CSV export strategy there is no longer need to ask serverside for list of transactions. Possible refactorization in future.
    */
    $http({
      method: 'POST',
      url: 'transaction/exportCSV',
      data: {
        transactions: transactions_id_list
      }
    }).success( function(data) {
      // prepare csv content
      var csvContentArray = [];
      _.each(data, function(data_string) {
        csvContentArray.push(data_string);
      });
      // trigger CSV download
      CSVdownloader.download(filename, csvContentArray);

      //NOTE: don't create batches for various paymentgates
      if ($scope.filter.gateway_filter != 'all') {
        // fire modal window for marking transactions
        $scope.markTransactions(transactions_id_list);
      }
    }).error( function(error) {
      console.error('Error:', error);
    });
  };


  // ------- advanced CSV export -------
  $scope.advancedCSVexport = function() {
    // open modal
    transactionAdvancedExportModal.open($scope.property, 'PAYMENT').then( function(result) {
      // success
    }, function() {
      // modal dismiss
    });
  };


  // ------- re-batch Modal -------
  $scope.openBatchModal = function(transaction) {
    // open modal
    transactionRebatchModal.open(transaction, $scope.batches).then( function(updated_transaction) {
      // success; refresh list of Transactions
      $scope.$state.reload();
    }, function() {
      // modal dismiss
    });
  };


  // ------- Money Withdraw -------
  $scope.openWithdrawModal = function() {
    // open modal
    transactionWithdrawModal.open($scope.property, $scope.batches, $scope.getMarkerColor, 'PAYMENT').then( function(result) {
      // success
      $scope.$state.reload();
    }, function() {
      // modal dismiss
      $scope.$state.reload();
    });
  };


  $scope.onSendCheckChanged = function(transaction, sendCheck) {
    transactionFacade.updateTransaction(transaction._id, {sendCheck: sendCheck}).then( function() {
      flashMessage.success('Transaction has been updated.', 'toast');
    }, flashMessage.danger);
  };


  $scope.openEditTransactionModal = function(transaction) {
    editTransactionModal.get(transaction).then( function() {
      $scope.$state.reload();
    });
  };


  init();
}]);
