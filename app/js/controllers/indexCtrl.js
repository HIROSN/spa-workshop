'use strict';

angular.module('controllers').controller('IndexCtrl', ['$scope', '$log',
  'geoReverseCoding', function($scope, $log, geoReverseCoding) {
    $scope.cities = ['Seattle', 'Delhi', 'Dublin', 'Tokyo'];
    if (!navigator.geolocation) { return; }

    navigator.geolocation.getCurrentPosition(function(position) {
      geoReverseCoding(position.coords.latitude, position.coords.longitude)
      .then(function(address) {
        if (!address.city) { return; }
        var exists = false;

        angular.forEach($scope.cities, function(city) {
          exists = exists || city === address.city;
        });

        if (!exists) { $scope.cities.unshift(address.city); }
      })
      .catch(function(err) {
        $log.error(err);
      });
    });
  }]
);
