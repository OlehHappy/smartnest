angular.module('smartnest.services')


.service('timeService', ['$window', function($window) {
  // Bank of America Holidays (format MM-DD)
  var holidays = ['01-01', '01-19', '02-16', '04-05', '05-25', '07-04',
    '09-07', '10-12', '11-11', '11-26', '12-24', '12-25', '12-31'];

  return {
    // to convert backend date into local time, used only in Datepicker directive
    addUTC: function(value) {
      var date = $window.moment(value);
      return date.clone().utcOffset(0).subtract(date.utcOffset(), 'minutes').toISOString();
    },

    UTC: function(value) {
      var date = $window.moment(value);
      return date.clone().utcOffset(0).add(date.utcOffset(), 'minutes').toDate();
    },

    zeroUTC: function(value) {
      value.setHours(0, 0, 0, 0);
      return this.UTC(value);
    },
    endDayUTC: function(value) {
      value.setHours(23, 59, 59, 999);
      return this.UTC(value);
    },

    withoutTimezone: function(date) {
      var _date = $window.moment(date);
      return _date.clone().utcOffset(0).add(_date.utcOffset(), 'minutes').toDate();
    },

    startDay: function(date) {
      var _date = date instanceof Date ? new Date(date.getTime()) : new Date();
      _date.setHours(0, 0, 0, 0);
      return _date;
    },

    endDay: function(date) {
      var _date = date instanceof Date ? new Date(date.getTime()) : new Date();
      _date.setHours(23, 59, 59, 999);
      return _date;
    },

    startMonth: function(date) {
      var _date = date instanceof Date ? new Date(date.getTime()) : new Date();
      _date.setDate(1);
      _date.setHours(0, 0, 0, 0);
      return _date;
    },

    endMonth: function(date) {
      var _date = date instanceof Date ? new Date(date.getTime()) : new Date();
      _date.setMonth(_date.getMonth() + 1, 0);
      _date.setHours(23, 59, 59, 999);
      return _date;
    },

    addDay: function(date, count) {
      var _date = date instanceof Date ? new Date(date.getTime()) : new Date();
      _date.setDate(_date.getDate() + (count !== undefined ? count : 1));
      return _date;
    },

    addMonth: function(date, count) {
      var _date = date instanceof Date ? new Date(date.getTime()) : new Date();
      _date.setMonth(_date.getMonth() + (count !== undefined ? count : 1));
      return _date;
    },

    isHoliday: function (date) {
      if (holidays && holidays.length) {
        if (holidays.indexOf(date.format('MM-DD')) >= 0) return true;
      }
      return false;
    },

    isBusinessDay: function(date) {
      if (date.day() === 0 || date.day() === 6) return false;
      if (this.isHoliday(date)) return false;
      return true;
    },

    addBusinessDay: function(date, days) {
      var signal = days < 0 ? -1 : 1;
      var _date = $window.moment(date);
      days = Math.abs(days);
      while (days) {
        _date.add(signal, 'd');
        if (this.isBusinessDay(_date)) {
          days--;
        }
      }
      return _date.toDate();
    }

  };
}]);
