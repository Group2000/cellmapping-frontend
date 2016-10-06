'use strict';
/* jshint indent: false */

angular.module('celllogger')
  .controller('ProviderCtrl', function ($scope,$http, AlertService,$rootScope,$state,$stateParams,WEBSERVICE,$modal) {

    
    $rootScope.$state=$state;
    $rootScope.$stateParams=$stateParams;

    $scope.activateView=function(key){
      $scope.user().activateView(key);
    }
   
    $scope.$watch(function(){
    	return AlertService.getAlerts();
      },
      function(newVal,oldVal){
     		$scope.alerts=newVal;
      },true
    );

    $scope.prov = {
	};
    
    function addProvider() {
		var params = {};
		if ($scope.prov.mnc) {
			params.net = $scope.prov.mnc;
		}
		if ($scope.prov.mcc) {
			params.mcc = $scope.prov.mcc;
		}
		if ($scope.prov.country) {
			params.country = $scope.prov.country;
		}
		if ($scope.prov.iso) {
			params.iso = $scope.prov.iso;
		}
		if ($scope.prov.brand) {
			params.brand = $scope.prov.brand;
		}
		if ($scope.prov.name) {
			params.name = $scope.prov.name;
		}
		// $http.defaults.useXDomain=true;

		$http.post(WEBSERVICE + '/provider',params).error(function(error) {
			console.log(error);
			AlertService.setAlert({msg:error ,type:'danger'});
		}).success(function(result) {
			AlertService.setAlert({msg:'Successfully added Provider ' + $scope.prov.name  ,type:'success',persist:true},true);
			$scope.reset();
		})
    }

    
    
    $scope.addProvider = function() {

    	addProvider();
	}

  })



