//rootcontroller
'use strict';
/* jshint indent: false */
angular.module('celllogger')




.controller('ApplicationCtrl', function($scope, $http,AlertService,ENV,$rootScope,$state){


	
	$scope.stg="Production";
	
	
	if(ENV==='development'){
		$scope.stg=ENV;
	}

	

	$scope.$on('$locationChangeStart',function(){
		AlertService.resetAlerts();
	});


	$scope.getNavBar=function(){
		// if($state.current.name==='dev')
			return 'partials/navbar'
		// return 'partials/navbar';

	}
	$scope.includeBottomBar=function(){
		if($state.current.name==='dev')
			return false
		return true
	}

})



