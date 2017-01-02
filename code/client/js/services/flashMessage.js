angular.module('smartnest.services')

.service('flashMessageStorage', function() {
    var messages = [];

    return messages;
})

.factory('flashMessage', ['$rootScope', '$timeout', '_', 'ngToast', 'flashMessageStorage', function($rootScope, $timeout, _, ngToast, flashMessageStorage) {
  var factory = {};

  factory._type = 'page';

  factory.create = function(message, type) {
    var msg = {
      type: type || factory._type,
      content: factory._getMessage(message),
      className: message.className || 'success'
    };
    msg.timeout = message.timeout || (msg.type === 'toast' ? 4000 : 0);

    if (msg.timeout) {
      msg.promise = $timeout(function () {
        factory.remove(msg);
      }, msg.timeout);
    }

    flashMessageStorage.push(msg);
    if (msg.type === 'toast' && msg.className !== 'progress') {
      ngToast.create(msg);
    }

    $rootScope.$broadcast('flashmessage:change', msg);
    return msg;
  };

  factory.isProgress = function() {
    return !!_.find(flashMessageStorage, function(message) {
      return message.className === 'progress';
    });
  };

  factory.get = function(type) {
    return _.filter(flashMessageStorage, function(message) {
      return message.type === type;
    });
  };

  factory.remove = function(message) {
    flashMessageStorage.splice(flashMessageStorage.indexOf(message), 1);
    $rootScope.$broadcast('flashmessage:change');
  };

  factory.removeAll = function(type) {
    _.each(factory.get(type || factory._type), function(message) {
      factory.remove(message);
    });
    factory.removeClassName('progress');
    $rootScope.$broadcast('flashmessage:change');
  };

  factory.removeClassName = function(className) {
    _.each(flashMessageStorage, function(message) {
      if (message.className === className) {
        factory.remove(message);
      }
    });
    $rootScope.$broadcast('flashmessage:change');
  };

  factory.success = function(message, type) {
    factory.removeClassName('progress');
    return factory.create(factory._setClassName(message, 'success'), type);
  };

  factory.info = function(message, type) {
    factory.removeClassName('progress');
    return factory.create(factory._setClassName(message, 'info'), type);
  };

  factory.warning = function(message, type) {
    factory.removeClassName('progress');
    return factory.create(factory._setClassName(message, 'warning'), type);
  };

  factory.danger = function(message, type) {
    factory.removeClassName('progress');
    return factory.create(factory._setClassName(message, 'danger'), type);
  };

  factory.progress = function(message, type) {
    factory.removeAll();
    return factory.create(factory._setClassName(message, 'progress'), type);
  };

  factory.setType = function(type) {
    factory._type = type;
    return factory;
  };

  factory._getMessage = function(message) {
    if (angular.isObject(message)) {
      return message.content || message.data || message.message;
    }
    return message;
  };

  factory._setClassName = function(message, className) {
    if (angular.isObject(message)) {
      message.className = className;
    } else {
      message = {
        content: message,
        className: className
      };
    }
    return message;
  };

  return factory;
}])


.factory('toastMessage', ['flashMessage', function(flashMessage) {
  return flashMessage.setType('toast');
}])


.factory('pageMessage', ['flashMessage', function(flashMessage) {
  return flashMessage.setType('page');
}])


.factory('dialogMessage', ['flashMessage', function(flashMessage) {
  return flashMessage.setType('dialog');
}])


.run(['flashMessage', '$state', '$rootScope', function(flashMessage, $state, $rootScope) {
  $rootScope.$on('$stateChangeSuccess', function(event, to, toParams, from, fromParams) {
    if (to.name !== from.name) {
      flashMessage.removeAll('page');
    }
  });
}])


.config(['$provide', function($provide) {
  $provide.decorator('$modal', ['$delegate', 'flashMessage', function($delegate, flashMessage) {
    var open = $delegate.open;
    $delegate.open = function() {
      var r = open.apply(this, arguments);
      r.opened.then(function() {
        flashMessage.removeAll('dialog');
      });
      return r;
    };
    return $delegate;
  }]);
}])


.directive('flashMessages', ['flashMessage', function(flashMessage) {
  return {
    restrict: 'EA',
    replace: true,
    scope: true,
    templateUrl: 'views/flashMessages.html',
    link: function(scope, elem, attrs, ctrl) {
      scope.type = attrs.type || 'page';
      scope.$on('flashmessage:change', function() {
        scope.messages = flashMessage.get(scope.type);
      });
      scope.remove = function(message) {
        flashMessage.remove(message);
      };
      scope.messages = flashMessage.get(scope.type);
    }
  };
}])


.directive('disableIfProgress', ['$compile', 'flashMessage', function($compile, flashMessage) {
  return {
    restrict: 'A',
    replace: false,
    terminal: true,
    priority: 1000,
    compile: function compile(elem, attrs) {
      elem.attr('ng-disabled', 'isProgress === true');
      elem.addClass('disable-if-progress');
      elem.removeAttr('disable-if-progress');
      elem.removeAttr('data-disable-if-progress');
      return {
        pre: function preLink(scope, iElement, iAttrs, controller) {  },
        post: function postLink(scope, iElement, iAttrs, controller) {
          scope.$on('flashmessage:change', function() {
            scope.isProgress = flashMessage.isProgress();
          });
          $compile(iElement)(scope);
        }
      };
    }
  };
}]);
