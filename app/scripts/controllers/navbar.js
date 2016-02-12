'use strict';
/* jshint indent: false */

angular.module('celllogger')
  .controller('NavbarCtrl', function ($scope, AlertService,$rootScope,$state,$stateParams,$modal) {

    
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


  })



