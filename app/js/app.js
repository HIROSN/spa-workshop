'use strict';

angular.module('services', []);
angular.module('controllers', []);

(function() {
  angular.module('spaWorkshop',
    ['ngRoute', 'Aerobatic', 'services', 'controllers', 'templates'])
  .config(function ($routeProvider, $locationProvider, aerobaticProvider) {
    $locationProvider.html5Mode(true);

    function templateUrl(path) {
      if (aerobaticProvider.config.buildType !== 'debug') { return path; }
      return aerobaticProvider.config.cdnUrl + '/' + path;
    }

    $routeProvider
    .when('/', {
      controller: 'IndexCtrl',
      templateUrl: templateUrl('partials/index.html')
    })
    .when('/cities/:city', {
      controller: 'CityCtrl',
      templateUrl: templateUrl('partials/city.html')
    })
    .otherwise({redirectTo: '/'});
  });
})();
