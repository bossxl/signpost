'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers',
  'ui.bootstrap'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: 'MyCtrl1'});
  $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: 'MyCtrl2'});
  $routeProvider.when('/finder', {templateUrl: 'partials/finder.html', controller: 'Finder'});
  $routeProvider.when('/digger', {templateUrl: 'partials/digger.html', controller: 'Digger'});
  $routeProvider.when('/grid', {templateUrl: 'partials/grid.html', controller: 'Grid'});
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
