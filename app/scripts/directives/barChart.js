'use strict';
/* jshint indent: false */


angular.module('celllogger')

.directive('barChart',function(){

    return {
        restrict: 'E',
        replace: true,
        template: '<div class="barchart"></div>',
        scope:{
        	width: '=width',
            height: '=height',
            data: '=data',
            hovered: '&hovered',
            options: '=options'
        },
        link: function(scope, element, attrs) {

            var chart = d3.custom.barChart();
            var chartEl = d3.select(element[0]);
            
            chart.on('customHover', function(d, i){
                scope.hovered({args:d});
            });

            scope.$watch('data', function (newVal, oldVal) {
                chartEl.datum(newVal).call(chart);
            });

            scope.$watch('height', function(d, i){
                chartEl.call(chart.height(scope.height));
            })
            scope.$watch('width', function(d, i){
                chartEl.call(chart.width(scope.width));
            })
             scope.$watch('options', function(d, i){
                chartEl.call(chart.options(scope.options));
            })
        }
	}
	
})

.directive('timeGraph',function(){

    return {
        restrict: 'E',
        replace: true,
        template: '<div class="timegraph"></div>',
        scope:{
            width: '=width',
            height: '=height',
            data: '=data',
            hovered: '&hovered',
            options: '=options'
        },
        link: function(scope, element, attrs) {

            var chart = d3.custom.timeGraph();
            var chartEl = d3.select(element[0]);

            chart.on('customHover', function(d, i){
                scope.hovered({args:d});
            });

            scope.$watch('data', function (newVal, oldVal) {
                chartEl.datum(newVal).call(chart);
            });

            scope.$watch('height', function(d, i){
                chartEl.call(chart.height(scope.height));
            })
            scope.$watch('width', function(d, i){
                chartEl.call(chart.width(scope.width));
            })
             scope.$watch('options', function(d, i){
                chartEl.call(chart.options(scope.options));
            })
        }
    }
    
})