'use strict';

angular.module('services').factory('news',
  ['$http', '$q', function($http, $q) {
    return function(city) {
      var defer = $q.defer();

      $http({
        method: 'GET',
        url: '/proxy',
        params: {
          url: 'https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&q=' +
            'http://news.google.com/news/feeds?geo=' + encodeURIComponent(city),
          cache: true,
          ttl: 300 // cache for 5 minutes
        }
      }).then(function(resp) {
        defer.resolve(resp.data);
      }, function(err) {
        defer.reject(err);
      });

      return defer.promise;
    };
  }]
);
