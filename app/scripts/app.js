'use strict';
/* jshint indent: false */

angular.module('celllogger', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ui.router',
    'ui.bootstrap',
    'ngGrid',
    'ngCookies',
    'config',
    'leaflet-directive',
    'ui.bootstrap.datetimepicker',
    'ngCsv',
    'angular-geohash',
])

.config(
     // ['$stateProvider', '$urlRouterProvider', 'APPLICATION_ROLES',
     function($stateProvider, $urlRouterProvider) {
  //

        // For any unmatched url, redirect to /state1
        $urlRouterProvider.otherwise('/');
      
        $stateProvider.state('/',{
            url:'/',
            templateUrl:'/partials/cells/cells.html',
            controller: 'CellsCtrl',
            data: {
            }
        })
         

        //END LAYERS
        $stateProvider.state('cells',{
            url:'/cells',
            templateUrl:'/partials/cells/cells.html',
            controller: 'CellsCtrl',
            data: {
            }
        });
        $stateProvider.state('provider',{
            url:'/provider',
            templateUrl:'/partials/cells/provider.html',
            controller: 'ProviderCtrl',
            data: {
            }
        });
        $stateProvider.state('celllogger',{
            url:'/celllogger',
            templateUrl:'/partials/cells/celllogger.html',
            controller: 'CellloggerCtrl',
            data: {
            }
        });
        $stateProvider.state('cellplot',{
            url:'/cellplot',
            templateUrl:'/partials/cells/cellplot.html',
            controller: 'CellPlotCtrl',
            data: {
            }
        });
         $stateProvider.state('devices',{
            url:'/devices',
            templateUrl:'/partials/cells/devices.html',
            controller: 'DevicesCtrl',
            data: {
            }
        });
        $stateProvider.state('lacs',{
            url:'/lacs',
            templateUrl:'/partials/cells/lac.html',
            controller: 'LacCtrl',
            data: {
            }
        });
         $stateProvider.state('wifis',{
            url:'/wifis',
            templateUrl:'/partials/wifi/wifis.html',
            controller: 'WifiCtrl',
            data: {
            }
        });
        $stateProvider.state('wificoverage',{
            url:'/wificoverage',
            templateUrl:'/partials/wifi/wificoverage.html',
            controller: 'WifiCoverageCtrl',
            data: {
            }
        });
       
    }
// ]
)


.run(function ($rootScope,$stateParams, $state,$location,AlertService) {
        
    // $rootScope.$state = $state;
    // $rootScope.$stateParams = $stateParams;

    


})


.config(function ($httpProvider) {
    
});
