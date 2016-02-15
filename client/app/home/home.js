angular.module('bikeAcrossAmerica.home', ['bikeAcrossAmerica.auth'])

.controller('HomeController', function ($scope, Auth) {
  $scope.data = {};

  $scope.signout = function () {
    Auth.signout();
  }

});
