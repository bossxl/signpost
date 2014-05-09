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
        var url = "v0/points?lat=%lat&long=%long";
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
        console.log("v0/points");
        console.log(point);
        $http({
          method: 'POST',
          url: "v0/points",
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
  ]).controller('Grid', ['$scope', '$modal','$http',
    function($scope, $modal, $http) {
      $scope.height = 10;
      $scope.width = 10;
      $scope.rows = new Array($scope.height);
      $scope.cols = new Array($scope.width);
      $scope.squareData = function(x, y) {
        $scope.error = false;
        $scope.x = x;
        $scope.y = y;
        $(".paper-current").text("");
        $(".paper-current").removeClass("paper-current");
        $(".paper-row-" + x + " .paper-col-" + y).addClass("paper-complete paper-current");
        $(".paper-row-" + x + " .paper-col-" + y).text("x");
        var url = "v0/points?lat=%lat&long=%long";
        url = url.replace("%lat", x);
        url = url.replace("%long", y);
        $http.get(url).success(function($data) {
          $scope.modalData = $data;
          $modal.open({
            templateUrl: "partials/grid-info.html",
            scope: $scope
          });
        }).error(function() {
          $scope.error = "Finder failed. Sorry";
        })

      }
      $scope.updateGrid = function() {
        var heightDiff = $scope.height - $scope.rows.length;
        if (heightDiff > 0) {
          $scope.rows = $scope.rows.concat(new Array(heightDiff))
        } else if (heightDiff < 0) {
          $scope.rows.splice(0, (heightDiff * -1))
        }
        var widthDiff = $scope.width - $scope.cols.length;
        if (widthDiff > 0) {
          $scope.cols = $scope.cols.concat(new Array(widthDiff))
        } else if (widthDiff < 0) {
          $scope.cols.splice(0, (widthDiff * -1))
        }
      }

    }
  ]);
