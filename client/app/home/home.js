angular.module('bikeAcrossAmerica.home', ['bikeAcrossAmerica.auth'])

.controller('HomeController', function ($scope, Home, Auth) {
  $scope.data = {};

  var updateUserInfo = function () {
    Auth.getUser()
    .then(function (user) {
      $scope.user = user;
    });
  };

  $scope.addMiles = function () {
    Home.addMiles($scope.data.addedMiles, { username: $scope.user.username });
    $scope.data.addedMiles = '';
    updateUserInfo();
  }

  $scope.signout = function () {
    Auth.signout();
  }

  updateUserInfo();
});
