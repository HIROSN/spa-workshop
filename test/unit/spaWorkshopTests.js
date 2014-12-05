'use strict';

describe('spaWorkshop', function() {
  var $controllerConstructor;
  var $httpBackend;
  var $scope;

  beforeEach(function() {
    window.__config__ = {};
    module('services');
    module('controllers');

    inject(function($rootScope, $controller, _$httpBackend_) {
      $scope = $rootScope.$new();
      $controllerConstructor = $controller;
      $httpBackend = _$httpBackend_;
    });
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should have a properly working IndexCtrl', function() {
    $controllerConstructor('IndexCtrl', {$scope: $scope});
    expect(Array.isArray($scope.cities)).toBe(true);
    expect($scope.cities.length).toBeTruthy();
  });

  it('should parse geolocation xml correctly', inject(function(geoLocation) {

    var request = '/proxy?cache=true&ttl=300&url=http:%2F%2Fquery.yahooapis.' +
      'com%2Fv1%2Fpublic%2Fyql%3Fq%3DSELECT%2520*%2520FROM%2520geo.' +
      'places%2520WHERE%2520text%253D%2522Seattle%2522%2520and%2520' +
      'placeTypeName%2520%253D%2520%2522Town%2522';

    $httpBackend.when('GET', request).respond(
      '<query>' +
        '<results>' +
          '<place>' +
            '<centroid>' +
              '<latitude>47.603561</latitude>' +
              '<longitude>-122.329437</longitude>' +
            '</centroid>' +
          '</place>' +
        '</results>' +
      '</query>'
    );

    geoLocation('Seattle')
    .then(function(latLong) {
      expect(latLong).toBeTruthy();
      expect(Array.isArray(latLong)).toBe(true);
      expect(latLong.length).toBe(2);
      expect(typeof latLong[0]).toBe('number');
      expect(typeof latLong[1]).toBe('number');
      expect(latLong[0]).toBeTruthy();
      expect(latLong[1]).toBeTruthy();
    })
    .catch(function(err) {
      expect(err).toBe(null);
    });

    $httpBackend.flush();
  }));
});
