//services.js
'use strict';
/* jshint indent: false */

angular.module('celllogger')

.directive('loginDialog', function (AUTH_EVENTS) {
	
	return {

		restrict: 'A',
		template: '<div ng-if="visible"	ng-include="\'index.html\'">',
		link: function (scope) {
			var showDialog = function () {
				console.log('should be visible');
				scope.visible = true;
			};

			scope.visible = false;
			scope.$on(AUTH_EVENTS.loginFailed, showDialog);
			scope.$on(AUTH_EVENTS.notAuthenticated, showDialog);
			scope.$on(AUTH_EVENTS.sessionTimeout, showDialog);
		}
	};
})
.directive('download',function($compile){
	return {
		restrict:'E',
		scope:{getUrlData:'&getData'},
		link:function(scope,elm,attrs){
			var url=URL.createObjectURL(scope.getUrlData());
			elm.append($compile(
				'<a class="btn" download="cells.json"' +
				'href="' +url +'">' +
				'Download' +
				'</a>'
			)(scope));
		}
	};
})


