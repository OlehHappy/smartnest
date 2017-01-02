angular.module('smartnest.services')


.service('transform', function() {
  return {
    calculateAge: function (birthDate, otherDate) {
      birthDate = new Date(birthDate);

      if (otherDate) {
        otherDate = new Date(otherDate);
      } else {
        otherDate = new Date();
      }

      var years = (otherDate.getFullYear() - birthDate.getFullYear());

      if (otherDate.getMonth() < birthDate.getMonth() ||
        otherDate.getMonth() == birthDate.getMonth() && otherDate.getDate() < birthDate.getDate()) {
        years--;
      }

      return years;
    }
  };
});
