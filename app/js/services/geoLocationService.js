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
      var latitude = node.getElementsByTagName('latitude')[0];
      var longitude = node.getElementsByTagName('longitude')[0];
      latLong.push(+(latitude.innerHTML || latitude.textContent));
      latLong.push(+(longitude.innerHTML || longitude.textContent));
      return latLong;
    }
  }]
);
