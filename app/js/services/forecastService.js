'use strict';

angular.module('services').factory('forecast', function($q, $http) {
  return function(lat, lng) {
    // The forecast.io API is not CORS enabled, so we need to proxy the all through
    // the Aerobatic proxy.
    return $http({
      method: 'GET',
      url: '/proxy',
      params: {
        url: 'https://api.forecast.io/forecast/@@FORECAST_IO_API_KEY@@/' + lat + ',' + lng,
        cache: 1,
        ttl: 300 // cache for 5 minutes
      }
    });
  };
});
