'use strict';

angular.module('controllers').controller('CityCtrl',
  ['$scope', '$routeParams', '$log', 'geoLocation', 'forecast', 'news',
  function($scope, $routeParams, $log, geoLocation, forecast, news) {
    $scope.cityName = $routeParams.city;

    geoLocation($scope.cityName)
    .then(function(latLong) {
      return forecast(latLong[0], latLong[1]);
    })
    .then(function(forecast) {
      $scope.forecast = forecast.data;
      return news($scope.cityName);
    })
    .then(function(news) {
      $scope.news = news;
    })
    .catch(function(err) {
      $log.error(err);
    });
  }]
);
