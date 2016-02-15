angular.module('bikeAcrossAmerica.services', [])

.factory('Home', function ($http) {

  var getMiles = function () {
    return $http({
      method: 'GET',
      url: '/api/miles'
    })
    .then(function (resp) {
      return resp.data;
    });
  };

  var addMiles = function (miles) {
    return $http({
      method: 'POST',
      url: '/api/miles',
      data: miles
    });
  };

  return {
    getMiles: getMiles,
    addMiles: addMiles
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
