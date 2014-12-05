'use strict';

angular.module('controllers').controller('IndexCtrl', ['$scope', '$log',
  'geoReverseCoding', function($scope, $log, geoReverseCoding) {
    $scope.cities = ['Seattle', 'New York', 'London', 'Tokyo'];
    if (!navigator.geolocation) { return; }

    navigator.geolocation.getCurrentPosition(function(position) {
      geoReverseCoding(position.coords.latitude, position.coords.longitude)
      .then(function(address) {
        if (address.city) { $scope.cities.unshift(address.city); }
      })
      .catch(function(err) {
        $log.error(err);
      });
    });
  }]
);
