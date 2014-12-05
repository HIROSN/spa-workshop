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

  var mockGeoLocationResponse = function() {
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
  };

  var mockForecastResponse = function() {
    var request = '/proxy?cache=1&ttl=300&url=https:%2F%2Fapi.forecast.' +
      'io%2Fforecast%2F@@FORECAST_IO_API_KEY@@%2F47.603561,-122.329437';

    $httpBackend.when('GET', request).respond({
      currently: {},
      hourly: {data: []},
      daily: {data: []}
    });
  };

  var mockNewsResponse = function() {
    var request = '/proxy?cache=true&ttl=300&url=https:%2F%2Fajax.' +
      'googleapis.com%2Fajax%2Fservices%2Ffeed%2Fload%3Fv%3D1.0%26q%3D' +
      'http:%2F%2Fnews.google.com%2Fnews%2Ffeeds%3Fgeo%3DSeattle';

    $httpBackend.when('GET', request).respond({
      responseData: {
        feed: {
          entries: [{
            title: 'Seattle news',
            link: 'http://news.google.com/',
            author: '',
            publishedDate: 'Thu, 04 Dec 2014 21:51:32 -0800',
            contentSnippet: '...',
            content: '<table><tr><td></td></tr></table>',
            categories: []
          }]
        }
      }
    });
  };

  it('should have a properly working IndexCtrl', function() {
    $controllerConstructor('IndexCtrl', {$scope: $scope});
    expect(Array.isArray($scope.cities)).toBe(true);
    expect($scope.cities.length).toBeTruthy();
  });

  it('should parse geolocation xml correctly', inject(function(geoLocation) {
    mockGeoLocationResponse();

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

  it('should update publishedDate to a number', inject(function(news) {
    mockNewsResponse();

    news('Seattle')
    .then(function(news) {
      expect(news).toBeTruthy();
      expect(Array.isArray(news)).toBe(true);
      expect(news.length).toBe(1);
      expect(news[0].publishedDate).toBeTruthy();
      expect(typeof news[0].publishedDate).toBe('number');
    })
    .catch(function(err) {
      expect(err).toBe(null);
    });

    $httpBackend.flush();
  }));

  it('should have a properly working CityCtrl', function() {
    mockGeoLocationResponse();
    mockForecastResponse();
    mockNewsResponse();

    $controllerConstructor('CityCtrl', {
      $scope: $scope,
      $routeParams: {city: 'Seattle'}
    });

    $httpBackend.flush();
    expect($scope.forecast).toBeTruthy();
    expect($scope.forecast.currently).toBeTruthy();
    expect($scope.forecast.hourly).toBeTruthy();
    expect($scope.forecast.hourly.data).toBeTruthy();
    expect(Array.isArray($scope.forecast.hourly.data)).toBe(true);
    expect($scope.forecast.daily).toBeTruthy();
    expect($scope.forecast.daily.data).toBeTruthy();
    expect(Array.isArray($scope.forecast.daily.data)).toBe(true);
    expect($scope.news).toBeTruthy();
    expect(typeof $scope.news[0].publishedDate).toBe('number');
  });
});
