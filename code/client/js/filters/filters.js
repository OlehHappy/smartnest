angular.module('smartnest.filters', [])

// Fixed length of number digitals
.filter('numberFixedLen', function() {
  return function(a, b) {
    return(1e8+a+"").slice(-b);
  };
})

// Phone format
.filter('phone', function() {
  return function(phone) {
    if (!phone) {
      return '';
    }

    // remove optional plus sign
    phone = phone.replace(/\+/g, '');

    return '(' + phone.substr(0,3) + ') ' +
      phone.substr(3,3) + '-' +
      phone.substr(6,4);
  };
})

// for client side pagination
.filter('startFrom', function() {
  return function(input, start) {
    start = +start; //parse to int
    if (input) {
      return input.slice(start);
    }
    return;
  };
})

// for fulltext search (words separate spaces)
.filter('search', ['$filter', function($filter) {
  return function(items, text){
    if (!text || text.length === 0) {
      return items;
    }

    var searchTerms = text.split(' ');
    searchTerms.forEach( function(term) {
      if (term && term.length) {
        items = $filter('filter')(items, term);
      }
    });

    return items;
  };
}])

// for search startWith string in object properties
.filter('objectSearch', function() {
  return function(items, text, properties) {
    if (!text || text.length === 0) {
      return items;
    }

    _.each(properties, function(property) {
      items = _.filter(items, function(item) {
        return item[property].indexOf(text) === 0;
      });
    });

    return items;
  };
})

// filter unit list, can by use `,` separator in search text
.filter('unitsFilter', function() {
  return function(items, text){
    if (!angular.isArray(items) || !text || text.length === 0) {
      return items;
    }

    var search = text.split(',').map( function(str) { return str.trim().toUpperCase(); });
    return _.filter(items, function(item) {
      var unit_number = angular.isString(item.unit_number) ? item.unit_number.toUpperCase() : '';
      var building_number = item.apartment && angular.isString(item.apartment.building_number) ? item.apartment.building_number.toUpperCase() : '';
      return (!search[1] && (~unit_number.indexOf(search[0]) || ~building_number.indexOf(search[0]))) || (~unit_number.indexOf(search[0]) && ~building_number.indexOf(search[1]));
    });
  };
})

//TODO add description
.filter('synapseBankAccounts', function($filter) {
  return function(items) {
    if (!Array.isArray(items)) {
      return items;
    }
    return items.filter( function(item) {
      return item.type === 'ACH-US';
    });
  };
});

