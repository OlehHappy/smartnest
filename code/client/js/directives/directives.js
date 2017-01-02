angular.module('smartnest.directives', ['angular-md5'])

/*
 * NOTE: Hotfix of broken initial date format in Datepicker element.
 * https://github.com/angular-ui/bootstrap/issues/2659
 */
.directive('datepickerPopup', function (){
  return {
    restrict: 'EAC',
    require: 'ngModel',
    link: function(scope, element, attr, controller) {
      //remove the default formatter from the input directive to prevent conflict
      controller.$formatters.shift();
    }
  };
})

/*
 * NOTE: Hotfix of broken bootstap modal touch event
 * https://github.com/angular-ui/bootstrap/issues/2017#issuecomment-39515923
 */
.directive('stopEvent', function () {
  return {
    restrict: 'A',
    link: function (scope, element, attr) {
      element.on(attr.stopEvent, function (e) {
        e.stopPropagation();
      });
    }
  };
})


//use this instead of ng-required on file inputs. You need both "required" and "valid-file"
.directive('validFile',function(){
  return {
    require: 'ngModel',
    link: function(scope,el,attrs,ngModel) {
      //change event is fired when file is selected
      el.bind('change',function() {
        scope.$apply(function() {
          ngModel.$setViewValue(el.val());
          ngModel.$render();
        });
      });
    }
  };
})


.directive('selectCountry', ['countryFacade', function(countryFacade) {
  return {
    restrict: 'AE',
    replace: true,
    require: 'ngModel',
    template: '<select class="countries" ng-options="country.alpha2 as country.name for country in countries"></select>',
    link: function(scope, element, attr) {
      countryFacade.getCountries().then( function(countries) {
        scope.countries = countries;
      });
    }
  };
}])


.directive('selectState', ['countryFacade', function(countryFacade) {
  return {
    restrict: 'AE',
    replace: true,
    require: 'ngModel',
    template: '<select class="states" ng-options="state.alpha2 as state.name for state in states"></select>',
    link: function(scope, element, attr) {
      countryFacade.getStates(attr.selectState || attr.country).then( function(states) {
        scope.states = states;
      });
    }
  };
}])


.directive('selectFloorPlan', ['propertyFacade', function(propertyFacade) {
  return {
    restrict: 'AE',
    replace: true,
    require: 'ngModel',
    scope: {
      propertyId: '=',
      model: '=ngModel',
      type: '@' // "select" or "radios"
    },
    templateUrl: 'views/floorPlan.html',
    link: function(scope, element, attr, ctrl) {
      if (['select', 'radios'].indexOf(scope.type) === -1) {
        scope.type = 'select';
      }
      propertyFacade.getFloorPlans(scope.propertyId).then( function(floorPlans) {
        scope.floorPlans = floorPlans;
      });

      ctrl.$formatters.push(function(modelValue) {
        return modelValue ? modelValue._id : undefined;
      });

      ctrl.$parsers.push(function(viewValue) {
        return _.find(scope.floorPlans, function(floorPlan) {
          return floorPlan._id == viewValue;
        });
      });

      scope.$watch('value', function() {
        ctrl.$setViewValue(scope.value);
      });

      ctrl.$render = function() {
        scope.value = ctrl.$viewValue;
      };
    }
  };
}])


.directive('errorMessages', ['$compile', function($compile) {
  return {
    restrict: 'A',
    require: 'form',
    link: function(scope, elem, attrs, ctrl) {
      elem.children('input, select, textarea').attr('error-message', '');
      $compile(elem.contents())(scope);
    }
  };
}])


.directive('errorMessage', ['$compile', '$timeout', function($compile, $timeout) {
  return {
    restrict: 'AE',
    require: '^form',
    link: function(scope, elem, attrs, ctrl) {
      $timeout( function() {
        var name = elem.attr('name');

        // Check if attribute `name` is on element.
        if (!name) {
          throw new Error('Missing attribute `name` on Form field insite Form element `'+ctrl.$name+'`.');
        }
        if (!ctrl[name]) {
          throw new Error('Form field `'+name+'` is not inside Form element `'+ctrl.$name+'`.');
        }

        // Build Custom Error messages if set attribute `messages`.
        var messages = '';
        var tmp = attrs.errorMessage || attrs.messages;
        if (tmp && tmp.length !== 0) {
          angular.forEach(scope.$eval(tmp), function(value, key) {
            messages += '<small ng-message="'+key+'">'+value+'</small>';
          });
        }

        // Add Error messages after Form field element.
        var field = ctrl.$name + "['" + name + "']";
        elem.after($compile('<p class="error-message" ng-show="('+ctrl.$name+'.$submitted || '+field+'.$dirty) && '+field+'.$invalid" ng-messages="'+field+'.$error">'+messages+'<ng-messages-include src="/views/validation-messages.html"></ng-messages-include></p>')(scope));

        // Set class `has-error` on Form field element if Form field is invalid.
        scope.$watch( function() {
          return (ctrl.$submitted || ctrl[name].$dirty) && ctrl[name].$invalid;
        }, function(invalid) {
          elem.toggleClass('has-error', invalid);
        });
      });
    }
  };
}])


// Set $submitted on nested form.
.directive('ngForm', function() {
  return {
    restrict: 'AE',
    require: 'form',
    link: function(scope, elem, attrs, ctrl) {
      var parentForm = elem.parent().controller('form');
      scope.$watch(function() {
        return parentForm.$submitted;
      }, function() {
        if (parentForm.$submitted === true) {
          ctrl.$setSubmitted();
        }
      });
    }
  };
})


.directive('equals', function() {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, elem, attrs, ctrl) {
      attrs.$observe('equals', function() {
        ctrl.$validate();
      });
      ctrl.$validators.equals = function(modelValue, viewValue) {
        var value = modelValue !== undefined ? modelValue : '';
        return value === attrs.equals;
      };
    }
  };
})


.directive('phone', ['validate', function(validate) {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, elem, attrs, ctrl) {
      ctrl.$validators.phone = function(modelValue, viewValue) {
        if (ctrl.$isEmpty(modelValue)) {
          return true;
        }
        return validate.isPhone(modelValue);
      };
    }
  };
}])


.directive('uniqueEmail', ['$q', 'userFacade', function($q, userFacade) {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, elem, attrs, ctrl) {
      // Extract exclude email address from `unique-email` attribute
      var exclude = [];
      if (attrs.uniqueEmail && attrs.uniqueEmail.length !== 0) {
        var values = scope.$eval(attrs.uniqueEmail);
        exclude = angular.isArray(values) ? values : [values];
      }

      // Add async Unique Email validation
      ctrl.$asyncValidators.uniqueEmail = function(modelValue, viewValue) {
        if (ctrl.$isEmpty(modelValue) || exclude.indexOf(modelValue) !== -1) {
          return $q.when();
        }
        return userFacade.checkUnique(modelValue);
      };
    }
  };
}])


.directive('propertyUnit', ['_', 'propertyFacade', function(_, propertyFacade) {
  return {
    restrict: 'AE',
    replace: true,
    require: 'ngModel',
    scope: {
      propertyId: '=',
      unit: '=ngModel'
    },
    templateUrl: 'views/propertyUnit.html',
    link: function(scope, elem, attrs, ctrl) {
      propertyFacade.getPropertyUnits(scope.propertyId).then( function(units) {
        scope.units = units;
        scope.buildingFiled = scope.isBuildingFilled(units);
        scope.checkValidity();
      });

      scope.getUnitName = function(unit) {
        if (!angular.isObject(unit)) {
          return;
        }
        var name = unit.unit_number;
        if (unit.apartment && unit.apartment.building_number) {
          name += ', ' + unit.apartment.building_number;
        }
        return name;
      };

      scope.checkValidity = function() {
        var valid = _.find(scope.units, function(u) {
          return angular.isObject(scope.unit) && (u.unit_number === scope.unit.unit_number && u.apartment.building_number === scope.unit.apartment.building_number);
        }) !== undefined;
        ctrl.$setValidity('unit', valid);
      };

      scope.isBuildingFilled = function(units) {
        return _.find(units, function(u) {
          return u.apartment.building_number && u.apartment.building_number !== '';
        }) !== undefined;
      };

      scope.isRequired = function() {
        return !!attrs.required;
      };

      scope.$watch('unit', scope.checkValidity);
    }
  };
}])


.directive('minAge', ['transform', function(transform) {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, elem, attrs, ctrl) {
      var age;
      attrs.$observe('minAge', function() {
        age = scope.$eval(attrs.minAge);
        ctrl.$validate();
      });
      ctrl.$validators.minAge = function(modelValue, viewValue) {
        if (ctrl.$isEmpty(modelValue)) {
          return true;
        }
        return transform.calculateAge(modelValue) >= age;
      };
    }
  };
}])


.directive('maxAge', ['transform', function(transform) {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, elem, attrs, ctrl) {
      var age;
      attrs.$observe('maxAge', function() {
        age = scope.$eval(attrs.maxAge);
        ctrl.$validate();
      });
      ctrl.$validators.maxAge = function(modelValue, viewValue) {
        if (ctrl.$isEmpty(modelValue)) {
          return true;
        }
        return transform.calculateAge(modelValue) <= age;
      };
    }
  };
}])


.directive('dateGreaterThan', function() {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, elem, attrs, ctrl) {
      var date;
      attrs.$observe('dateGreaterThan', function() {
        try {
          date = scope.$eval(attrs.dateGreaterThan);
        } catch (e) {
          date = attrs.dateGreaterThan;
        }
        ctrl.$validate();
      });
      ctrl.$validators.dateGreaterThan = function(modelValue, viewValue) {
        if (ctrl.$isEmpty(modelValue) || ctrl.$isEmpty(date)) {
          return true;
        }
        return (Date.parse(modelValue) > Date.parse(date));
      };
    }
  };
})


.directive('tagInput', function() {
  return {
    restrict: 'E',
    scope: {
      inputTags: '=taglist'
    },
    templateUrl: 'views/tagInput.html',
    link: function ($scope, element, attrs) {

      $scope.defaultWidth = 200;
      $scope.tagText = '';
      $scope.placeholder = attrs.placeholder;

      if (!$scope.inputTags) {
        $scope.inputTags = [];
      }

      $scope.addTag = function () {
        if ($scope.tagText.length === 0 || $scope.inputTags.indexOf($scope.tagText) !== -1) {
          $scope.tagText = "";
          return;
        }

        $scope.inputTags.push($scope.tagText);
        $scope.tagText = "";
      };

      $scope.deleteTag = function (key) {
        if ($scope.inputTags.length > 0 && $scope.tagText.length === 0 && key === undefined) {
          $scope.inputTags.pop();
        } else if (key !== undefined) {
          $scope.inputTags.splice(key, 1);
        }
      };

      element.bind('keydown', function (e) {
        key = e.which;
        if (key === 9 || key === 13) {
          e.preventDefault();
        }
        if (key == 8) {
          $scope.$apply('deleteTag()');
        }
      });

      element.bind('keyup', function (e) {
        key = e.which;
        if (key === 9 || key === 13 || key === 188) {
          e.preventDefault();
          $scope.$apply('addTag()');
        }
      });
    }
  };
})


.directive('unitCollision', ['$q', '_', 'unitFacade', function($q, _, unitFacade) {
  return {
    restrict: 'AE',
    require: '^?form',
    scope: {
      unit: '=',
      dateFrom: '=',
      dateTo: '='
    },
    templateUrl: 'views/unitCollision.html',
    link: function(scope, elem, attrs, ctrl) {
      var exclude = [];

      scope.checkValidity = function() {
        if (!angular.isObject(scope.unit) || !scope.unit._id || !scope.dateFrom || !scope.dateTo) {
          scope.collisions = [];
          if (scope.isField()) {
            ctrl[attrs.name].$setValidity('unitCollision', true, ctrl);
          }
          return $q.when();
        }
        return unitFacade
          .checkCollision(scope.unit._id, scope.dateFrom, scope.dateTo)
          .then( function(collisions) {
            return _.filter(collisions, function(collision) {
              return exclude.indexOf(collision._id) === -1;
            });

          }).then( function(collisions) {
            scope.collisions = collisions;
            if (scope.isField()) {
              ctrl[attrs.name].$setValidity('unitCollision', !collisions.length, ctrl);
            }
          });
      };

      scope.isField = function() {
        return ctrl && attrs.name && ctrl[attrs.name];
      };

      attrs.$observe('contractExclude', function(values) {
        values = scope.$eval(values);
        exclude = angular.isArray(values) ? values : [values];
      });

      scope.$watch('unit + dateFrom + dateTo', function() {
        scope.checkValidity();
      });
    }
  };
}])


// Replace default Angular input[type=email] validator
.directive('input', function () {
  var EMAIL_REGEXP = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

  return {
    restrict: 'E',
    require: '?ngModel',
    link: function(scope, elem, attrs, ctrl) {
      if (attrs.type === 'email' && ctrl && ctrl.$validators.email) {
        ctrl.$validators.email = function(modelValue) {
          return ctrl.$isEmpty(modelValue) || EMAIL_REGEXP.test(modelValue);
        };
      }
    }
  };
})


.directive('fileModel', ['$parse', function ($parse) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var model = $parse(attrs.fileModel);
      var modelSetter = model.assign;

      element.bind('change', function(){
        scope.$apply(function(){
          modelSetter(scope, element[0].files[0]);
        });
      });
    }
  };
}])


.directive('scrollOnTop', ['$window', function ($window) {
  var $win = angular.element($window);

  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var topClass = attrs.scrollOnTop;
      var offsetTop = element.offset().top;

      checkPosition();
      $win.on('scroll', function (e) {
        checkPosition();
      });

      function checkPosition() {
        element[($win.scrollTop() >= offsetTop) ? 'addClass' : 'removeClass'](topClass);
      }
    }
  };
}])


.directive('gravatar', ['$location', function($location) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      email: '=',
      size: '@'
    },
    template: '<img ng-src="https://www.gravatar.com/avatar/{{ email | gravatar }}?s={{ size || 80 }}&d={{ baseurl }}/img/renter/renter-placeholder.png" ng-attr-width="{{ size }}" ng-attr-height="{{ size }}" />',
    link: function(scope) {
      scope.baseurl = $location.protocol() + '://' + $location.host() + ':' + $location.port();
      if ($location.host() === 'localhost') {
        scope.baseurl = 'https://smartnest-pay.herokuapp.com';
      }
    }
  };
}])


/* Datepicker with calendar icon on side */
.directive('datePicker', ['$compile', function($compile) {
  return {
    restrict: 'A',
    require: '?ngModel',
    replace: false,
    terminal: true,
    priority: 1000,
    compile: function(element, attrs) {
      var name = element.attr('name');
      var format = element.attr('date-format') || 'MM/dd/yyyy';
      var align = element.attr('date-align') || 'left';

      // Check if attribute `name` is on element.
      if (!name) {
        throw new Error('Missing attribute `name` on Form date-picker field.');
      }

      element.removeAttr('date-picker');
      element.removeAttr('data-date-picker');
      element.addClass('date-picker');

      var elem = element.clone();
      elem.attr('datepicker-popup', attrs['datepicker-popup'] || format);
      elem.attr('show-button-bar', attrs['show-button-bar'] || 'false');
      elem.attr('close-text', attrs['close-text'] || 'Close');
      elem.attr('datepicker-options', attrs['datepicker-options'] || "{formatYear: 'yy', startingDay: 1, showWeeks: false}");
      elem.attr('is-open', "opened['" + name + "']");
      elem.attr('placeholder', attrs.placeholder || format.toUpperCase());

      var wrap = angular.element('<div class="input-group date-picker align-' + align + '"></div>');
      var calendar = '<span class="input-group-btn"><button type="button" class="btn btn-default" ng-click="toggleDatePicker($event, \'' + name + '\')"><i class="fa fa-calendar"></i></button></span>';

      element.replaceWith(align === 'right' ? wrap.append(elem, calendar) : wrap.append(calendar, elem));

      return {
        pre: function(scope, element, attrs, ctrl) {
          scope.opened = {};

          scope.toggleDatePicker = function($event, name) {
            $event.preventDefault();
            $event.stopPropagation();

            var same = scope.opened[name] === true;
            scope.opened = {};
            scope.opened[name] = same ? false : true;
          };

          $compile(element)(scope);
        }
      };
    }
  };
}])


/* Removes local timezone from ng-model value */
.directive('dateUtc', ['timeService', function(timeService) {
  return {
    restrict: 'A',
    require: '?ngModel',
    link: function(scope, elem, attrs, ctrl) {
      if (ctrl) {
        ctrl.$parsers.push( function(value) {
          if (!value) {
            return value;
          }

          return timeService.UTC(value);
        });

        ctrl.$formatters.push( function(value) {
          if (!value) {
            return value;
          }

          return timeService.addUTC(value);
        });
      }
    }
  };
}]);
