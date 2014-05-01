'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
  .controller('MyCtrl1', [
    function() {

    }
  ])
  .controller('MyCtrl2', [
    function() {

    }
  ])
  .controller('Finder', ['$scope', '$http',
    function($scope, $http) {
      $scope.reset = function() {
        $scope.coor = {};
      }
      $scope.submit = function(coor) {
        var url = "http://localhost/v0/points?lat=%lat&long=%long";
        url = url.replace("%lat", coor.lat);
        url = url.replace("%long", coor.long);
        $http.get(url).success(function($data) {
          $scope.locations = $data;
        }).error(function() {
          $scope.error = "Finder failed. Sorry";
        })
      }
    }
  ])
  .controller('Digger', ['$scope', '$http',
    function($scope, $http) {
      $scope.submit = function(point) {
        console.log("http://localhost/v0/points");
        console.log(point);
        $http({
          method: 'POST',
          url: "http://localhost/v0/points",
          data: point,
          headers: {
            'Content-Type': 'application/json'
          }
        }).success(function($data) {
          $scope.msg = "Point posted!";
          $scope.locations = $data;
        }).error(function() {
          $scope.error = "Digger failed. Sorry";
        })
      }
    }
  ]);
