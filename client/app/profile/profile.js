angular.module('bikeAcrossAmerica.profile', ['bikeAcrossAmerica.auth'])

.controller('ProfileController', function ($scope, Auth, Profile) {
  $scope.user = {};
  $scope.newInfo = {};

  var getUserInfo = function () {
    Auth.getUser()
    .then(function (user) {
      $scope.user = user;
    });
  };

  $scope.update = function () {
    var newProperties = {};
    for (var property in $scope.newInfo) {
      if( $scope.newInfo[property].length ) {
        newProperties[property] = $scope.newInfo[property];
      }
    }

    Profile.updateUser(newProperties, $scope.user.username)
      .then( function(user) {
        $scope.user = user;
      });
  };

  getUserInfo();
});
