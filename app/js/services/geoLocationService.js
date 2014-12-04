'use strict';

angular.module('services').factory('geoLocation',
  ['$q', '$timeout', function($q, $timeout) {
    return function(city) {
      var deferred = $q.defer();

      $timeout(function() {
        switch (city.toLowerCase()) {
          case "seattle":
            deferred.resolve([47.6062,-122.3321]);
            break;
          case "london":
            deferred.resolve([51.5171,-0.1062]);
            break;
          case "tokyo":
            deferred.resolve([35.6832,139.8089]);
            break;
          case "new york":
            deferred.resolve([40.7142,-74.0064]);
            break;
          default:
            deferred.reject("Invalid city");
        }
      }, 20);
      return deferred.promise;
    };
  }]
);
