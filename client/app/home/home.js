angular.module('bikeAcrossAmerica.home', ['bikeAcrossAmerica.auth'])

.controller('HomeController', function ($scope, Home, Auth) {
  $scope.data = {};
  $scope.AMERICA_WIDTH = 2680; // miles

  var getUserInfo = function () {
    Auth.getUser()
    .then(function (user) {
      $scope.user = user;
      $scope.data.progress = $scope.user.totalMiles % $scope.AMERICA_WIDTH;
    });
  };

  $scope.addMiles = function () {
    Home.addMiles($scope.data.addedMiles, { username: $scope.user.username })
    .then(function(user) {
      getUserInfo();
    });
    $scope.data.addedMiles = '';
  };

  $scope.addRider = function () {
    Home.addRider($scope.data.newRider, { username: $scope.user.username })
    .then(function(user) {
      getUserInfo();
    });
    $scope.data.addedMiles = '';
  };

  $scope.signout = function () {
    Auth.signout();
  };

  getUserInfo();
});
