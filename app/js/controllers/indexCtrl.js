'use strict';

angular.module('controllers').controller('IndexCtrl',
  ['$scope', function($scope) {
    $scope.cities = ['Seattle', 'New York', 'London', 'Tokyo', 'Boston'];
  }]
);
