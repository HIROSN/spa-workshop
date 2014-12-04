'use strict';

angular.module('services').factory('geoLocation',
  ['$http', '$q', function($http, $q) {
    return function(city) {
      var defer = $q.defer();

      $http({
        method: 'GET',
        url: '/proxy',
        params: {
          url: 'http://query.yahooapis.com/v1/public/yql?q=' +
            encodeURIComponent('SELECT * FROM geo.places WHERE text="' +
            city + '" and placeTypeName = "Town"'),
          cache: true,
          ttl: 300 // cache for 5 minutes
        },
        headers: {
          accept: 'application/xml'
        }
      }).then(function(resp) {
        defer.resolve(parseGeoLocationXml(resp.data));
      }, function(err) {
        defer.reject(err);
      });

      return defer.promise;
    };

    function parseGeoLocationXml(xmlString) {
      var parser = new DOMParser();
      var xmlDoc = parser.parseFromString(xmlString, 'text/xml');
      var latLong = [];
      var node = xmlDoc.getElementsByTagName('centroid')[0];
      latLong.push(+node.getElementsByTagName('latitude')[0].innerHTML);
      latLong.push(+node.getElementsByTagName('longitude')[0].innerHTML);
      return latLong;
    }
  }]
);
