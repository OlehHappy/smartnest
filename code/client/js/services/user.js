angular.module('smartnest.services')


.factory("User", ['$resource', function($resource) {
  return $resource('users/:userId', {
    userId: '@_id'
  }, {
    update: {
      method: 'PUT'
    },
    find: {
      method: 'POST',
      url: 'users/find',
      isArray: true
    },
    login: {
      method: 'POST',
      url: 'users/session'
    },
    logout: {
      method: 'POST',
      url: 'users/signout'
    },
    resetPassword: {
      method: 'POST',
      url: 'users/reset_password'
    },
    changePassword: {
      method: 'POST',
      url: 'users/change_password'
    },
    updatePassword: {
      method: 'POST',
      url: 'users/update_password'
    },
    checkUnique: {
      method: 'GET',
      url: 'users/checkUnique/:email'
    },
    forceUserLogin: {
      method: 'POST',
      url: 'users/:userId/forceLogin'
    }
  });
}])


.service('userFacade', ['$window', 'User', 'Global', function($window, User, Global) {
  return {
    getUsers: function(usersId) {
      return User.find({}, {users: usersId}).$promise;
    },

    getUser: function(userId) {
      return User.get({userId: userId}).$promise;
    },

    reloadUser: function() {
      return this
        .getUser('me')
        .then( function(user) {
          Global.setUser(user);
          return user;
        });
    },

    updateUser: function(userId, data) {
      return User.update({userId: userId}, data).$promise;
    },

    deleteUser: function(userId) {
      return User.delete({userId: userId}).$promise;
    },

    login: function(email, password) {
      return User
        .login({email: email, password: password})
        .$promise
        .then( function(response) {
          Global.setUser(response.user);
          return response.user;
        });
    },

    forceUserLogin: function(userId) {
      return User.forceUserLogin({userId: userId}, {}).$promise.then( function() {
        $window.location = '/';
      });
    },

    logout: function() {
      return User
        .logout()
        .$promise
        .then( function(response) {
          Global.setUser(null);
          return response;
        });
    },

    resetPassword: function(email) {
      return User.resetPassword({email: email}).$promise;
    },

    register: function(account) {
      return User.save(account).$promise;
    },

    changePassword: function(token, password) {
      return User
        .changePassword({token: token, password: password})
        .$promise
        .then( function(response) {
          Global.setUser(response.user);
          return response.user;
        });
    },

    updatePassword: function(userId, oldPassword, password) {
      return User
        .updatePassword({userId: userId, oldPassword: oldPassword, password: password})
        .$promise
        .then( function(response) {
          Global.setUser(response.user);
          return response.user;
        });
    },

    checkUnique: function(email) {
      return User.checkUnique({email: email}).$promise;
    }
  };
}]);
