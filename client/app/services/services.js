angular.module('bikeAcrossAmerica.services', [])

.factory('Profile', function ($http) {

  var updateUser = function (newInfo, previousUsername) {
    return $http({
      method: 'PUT',
      url: '/api/users/profile',
      data: {
        newInfo: newInfo,
        user: {
          username: previousUsername
        }
      }
    }).then(function (user) {
      return user;
    });
  };

  return {
    updateUser: updateUser
  };
})
.factory('Home', function ($http) {

  var findRidingPartners = function (weeklyMilageGoal) {
    return $http({
      method: 'POST',
      url: '/api/users/find/partners',
      data: {
        weeklyMilageGoal: weeklyMilageGoal
       }
    }).then(function (res) {
      return res.data;
    });
  };

  var addMiles = function (miles, user) {
    return $http({
      method: 'POST',
      url: '/api/users/miles',
      data: {
        miles: miles,
        user: user
      }
    }).then(function (user) {
      return user;
    });
  };

  var addRider = function (newRider, user) {
    return $http({
      method: 'PUT',
      url: '/api/users/ridingGroup',
      data: {
        newRider: newRider,
        user: user
      }
    }).then(function (user) {
      return user;
    });
  };

  return {
    addRider: addRider,
    addMiles: addMiles,
    findRidingPartners: findRidingPartners
  };
})
.factory('Auth', function ($http, $location, $window) {

  var getUser = function() {
    return $http({
      method: 'GET',
      url: '/api/users/getUser'
    })
    .then(function (resp) {
      return resp.data; // check to see what resp.data is
    });
  }
  var signin = function (user) {
    return $http({
      method: 'POST',
      url: '/api/users/signin',
      data: user
    })
    .then(function (resp) {
      return resp.data.token;
    });
  };

  var signup = function (user) {
    return $http({
      method: 'POST',
      url: '/api/users/signup',
      data: user
    })
    .then(function (resp) {
      return resp.data.token;
    });
  };

  var isAuth = function () {
    return !!$window.localStorage.getItem('com.bikeAcrossAmerica');
  };

  var signout = function () {
    $window.localStorage.removeItem('com.bikeAcrossAmerica');
    $location.path('/signin');
  };


  return {
    signin: signin,
    signup: signup,
    isAuth: isAuth,
    signout: signout,
    getUser: getUser
  };
});
