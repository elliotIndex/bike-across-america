angular.module('bikeAcrossAmerica.home', ['bikeAcrossAmerica.auth'])

.controller('HomeController', function ($scope, Home, Auth) {
  $scope.data = {};
  $scope.AMERICA_WIDTH = 2680; // miles

  var updateUserInfo = function () {
    Auth.getUser()
    .then(function (user) {
      $scope.user = user;
      $scope.data.progress = $scope.user.totalMiles % $scope.AMERICA_WIDTH;
    });
  };

  $scope.addMiles = function () {
    Home.addMiles($scope.data.addedMiles, { username: $scope.user.username })
    .then(function(user) {
      updateUserInfo();
    });
    $scope.data.addedMiles = '';
  }

  $scope.signout = function () {
    Auth.signout();
  }

  updateUserInfo();
});
