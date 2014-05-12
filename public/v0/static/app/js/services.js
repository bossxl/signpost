'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
value('version', '0.1');
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
