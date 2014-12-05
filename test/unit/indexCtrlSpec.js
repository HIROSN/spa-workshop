'use strict';

describe('indexCtrl', function() {
  var $controllerConstructor;
  var $scope;

  beforeEach(function() {
    window.__config__ = {};
    module('services');
    module('controllers');

    inject(function($rootScope, $controller) {
      $scope = $rootScope.$new();
      $controllerConstructor = $controller;
    });
  });

  it('should have a properly working IndexCtrl', function() {
    $controllerConstructor('IndexCtrl', {$scope: $scope});
    expect(Array.isArray($scope.cities)).toBe(true);
    expect($scope.cities.length).toBeTruthy();
  });
});
