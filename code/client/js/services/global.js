angular.module('smartnest.services').factory("Global", [function() {
  //NOTE: User object is in generated window
  var user = window.user;
  var authenticated = !! window.user;

  var methods = {
    setUser: function(new_user) {
      //console.log("Setting User:", user, authenticated);
      user = new_user;
      authenticated = !! new_user;
      window.user = user;
      //console.log("New User:", user, authenticated);
    },
    getUser: function() {
      //console.log("Getting User:", user, authenticated);
      return {
        user: user,
        authenticated: !! user
      };
    }
  };

  return methods;
}]);
