angular.module('bikeAcrossAmerica.home', ['bikeAcrossAmerica.auth'])

.controller('HomeController', function ($scope, Home, Auth) {
  $scope.data = {
    addRiderFormShowing: false
  };
  $scope.AMERICA_WIDTH = 2680; // miles

  var getUserInfo = function () {
    Auth.getUser()
    .then(function (user) {
      $scope.user = user;
      $scope.data.progress = $scope.user.totalMiles % $scope.AMERICA_WIDTH;
    });
  };

  $scope.findRidingPartners = function () {
    Home.findRidingPartners($scope.user.weeklyMilageGoal)
    .then(function(potentialPartners) {
      $scope.data.potentialPartners = potentialPartners;
      return true;
    })
    .then(function() {
      $('#potentialPartners').toggle();
    });
  };

  $scope.toggleUsernameForm = function () {
    $('#newPartnerForm').toggle();
  };

  $scope.placeString = function (place) {
    if (place === 0) {
      return '1st';
    } else if (place === 1) {
      return '2nd';
    } else if (place === 2) {
      return '3rd';
    } else {
      return (place+1) + 'th';
    }
  }

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
    $scope.data.newRider = '';
  };

  $scope.signout = function () {
    Auth.signout();
  };

  getUserInfo();
  $('#newPartnerForm').css('display', 'none');
  $('#potentialPartners').css('display', 'none');
});
