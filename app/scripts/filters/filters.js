'use strict';
/* jshint indent: false */

angular.module('celllogger') 
    .filter('state',function($filter){
        return function(input){

            var dtDiff=(new Date()-(new Date(input)))/1000/60/60/24
            var bgClass="bg-success";
            if (dtDiff>=1){
                bgClass="bg-warning";
            }
            if (dtDiff>=7){
                bgClass="bg-danger";
            }



            var d=new Date(input);
            var dString=$filter('date')(d,'dd-MM-yyyy HH:mm:ss');
            var ret='<span class="' + bgClass + '">'+dString+'</span>';
            return ret;
        };
    })
    
    .filter('tdState',function(){
        return function(input){

            var dtDiff=(new Date()-(new Date(input)))/1000/60/60/24
            var bgClass="bg-success";
            if (dtDiff>=1){
                bgClass="bg-warning";
            }
            if (dtDiff>=7){
                bgClass="bg-danger";
            }
            return bgClass;
        };
    })

    .filter('boolGrid', function () {
        return function(input){
            if(input===true){
                return '<div class="ngCellText" ng-class="bg-success"><span class="glyphicon glyphicon-unchecked"></div>';
            }
            return '<div class="ngCellText" ng-class="bg-danger><span class="glyphicon glyphicon-checked"></div>';
        };
    })

    .filter('placeholderEmpty',function($sce){
        return function(input){
            if(!(input===undefined || input === null)){
                return input;
            }else
            {
                return $sce.trustAsHtml('<span class="notset">Not Set</span>');
            }
        };
    })

    .filter('warning',function($sce){
        return function(input){
            if(!(input===undefined || input === null)){
                return input;
            }else
            {
                return '<div class="ngCellText" ng-class="bg-danger>' + input + '</div>';
            }
        };
    })
    .filter('reverse',function(){
        return function(items){
            if(items && items.length>0)
                return items.slice().reverse();
        };
    })
    .filter('isEmpty',function(){
        var item;
        return function(obj){
            for(item in obj){
                if(obj.hasOwnProperty(item)){
                    return false;
                }
            }
            return true;
        };
    });

