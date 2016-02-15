angular.module('bikeAcrossAmerica.home', ['bikeAcrossAmerica.auth'])

.controller('HomeController', function ($scope, Home, Auth) {
  $scope.data = {};

  Auth.getUser()
  .then(function (user) {
    console.log('User: ', user);
    $scope.user = user;
  });

  $scope.signout = function () {
    Auth.signout();
  }

});
