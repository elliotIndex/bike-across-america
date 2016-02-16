angular.module('bikeAcrossAmerica.profile', [
  'bikeAcrossAmerica.auth',
  'bikeAcrossAmerica.home',
  'bikeAcrossAmerica.services'
])

.controller('ProfileController', function ($scope, Auth) {
  $scope.user = {};

  var getUserInfo = function () {
    Auth.getUser()
    .then(function (user) {
      $scope.user = user;
    });
  };


  getUserInfo();
});
