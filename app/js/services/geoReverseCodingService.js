'use strict';

angular.module('services').factory('geoReverseCoding',
  ['$http', '$q', function($http, $q) {
    return function(lat, lon) {
      var defer = $q.defer();

      $http({
        method: 'GET',
        url: '/proxy',
        params: {
          url: 'http://nominatim.openstreetmap.org/reverse?format=json&lat=' +
            lat + '&lon=' + lon,
          cache: true,
          ttl: 300 // cache for 5 minutes
        }
      }).then(function(resp) {
        defer.resolve(resp.data.address);
      }, function(err) {
        defer.reject(err);
      });

      return defer.promise;
    };
  }]
);
