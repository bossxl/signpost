'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
  .controller('MyCtrl1', [function() {

  }])
  .controller('MyCtrl2', [function() {

  }])
  .controller('Finder', ['$scope', '$http', function($scope, $http) {
  	$scope.reset = function(){
  		$scope.coor = {};
  	}
    $scope.submit = function(coor){
      var url = "http://localhost/v0/points?lat=%lat&long=%long";
      url = url.replace("%lat", coor.lat);
      url = url.replace("%long", coor.long);
      $http.get(url).success(function($data){
        $scope.locations = $data;
      }).error(function(){
        $scope.error = "Finder failed. Sorry";
      })
    }
  }])
  .controller('Digger', [function() {

  }]);
