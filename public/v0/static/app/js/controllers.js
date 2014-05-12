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
  .controller('Finder', ['$scope', '$http', '$compile',
    function($scope, $http, $compile) {
      var url = 'v0/points';
      $http.get(url).success(function($data) {
        console.log($data);
        var buttons = [{
          ng: ['ng-click="submit(coor)"', 'ng-disabled="finder.$invalid"'],
          class: ['btn', 'btn-default'],
          text: 'Submit'
        }, {
          ng: ['ng-click="reset()"'],
          class: ['btn', 'btn-default'],
          text: 'Reset'
        }]
        $scope.createForm({
          modelName: 'coor',
          cssLocation: '#form'
        }, $data.fields, buttons);
      }).error(function() {
        $scope.error = 'Unable to complete request';
      })
      $scope.createForm = function(opt, elements, buttons) {
        if (!elements.length) {
          throw 'Elements must be an array';
        }
        var modelName = (opt.modelName) ? opt.modelName + "." : ""
        var html = '<form name="finder" class="form-horizontal" novalidate>';
        for (var i = 0; i < elements.length; i++) {
          var element = elements[i];
          var elementHTML = '<div class="form-group">'
          elementHTML += '<label for="' + element.key + '" class="control-label">' + element.label + '</label>'
          elementHTML += '<input type="' + element.type + '" name="' + element.key + '" ng-model="' + modelName + element.key + '" class="form-control" ' + ((element.required) ? 'required' : '') + '>'
          elementHTML += '</div>'
          html += elementHTML
        }
        if (buttons) {
          html += '<div class="form-group">';
          for (var i = 0; i < buttons.length; i++) {
            var button = buttons[i];
            var buttonHTML = '<button';
            if (button.class) {
              buttonHTML += ' class="' + button.class.join(' ') + '" ';
            }
            if (button.ng) {
              buttonHTML += button.ng.join(' ') + ' ';
            }
            buttonHTML += '>' + button.text + '</button>'
            html += buttonHTML;
          }
          html += '</div>'
        }
        html += '</form>'
        var compiledHtml = $compile(html)($scope);
        $(opt.cssLocation).append(compiledHtml);
      }
      $scope.submit = function(coor) {
        $scope.error = null;
        $scope.msg = null;
        if (!(coor && coor.lat && coor.long)) {
          $scope.error = 'Missing Form Elements';
          return
        }
        var fullurl = url + '?lat=%lat&long=%long';
        fullurl = fullurl.replace('%lat', coor.lat);
        fullurl = fullurl.replace('%long', coor.long);
        $http.get(fullurl).success(function($data) {
          $scope.msg = 'Found Data';
          $scope.locations = $data;
        }).error(function() {
          $scope.error = 'Finder failed. Sorry';
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
  ]).controller('Grid', ['$scope', '$modal', '$http',
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
