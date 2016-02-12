//graph.js
//D3 stufff

'use strict';
/* jshint indent: false */

angular.module('celllogger')

.service('Graph',function(){
	 this.xAxisTickValueFunction = function(filter) {

            if(filter.dateType==='quarter' || filter.dateType==='year'){
           
                return function(d){
                    var ticks=[];
                    for(var i=0;i<d[0].values.length;i++){
                        ticks.push(new Date(d[0].values[i][0]))
                    }
                    
                    return(ticks);
                }
            }
            else
            {
                
                return function(d){
                    if(d[0].values.length>20){//only display first,last
                        return(new Date(d[0].values[0][0]));
                    }
                    else
                    {
                        var ticks=[];
                        for(var i=0;i<d[0].values.length;i++){
                            ticks.push(new Date(d[0].values[i][0]))
                        }
                        
                        return(ticks);
                    }
                        
                }
            }
        }



        this.xAxisTickFormatFunction = function(filter){
            if(filter.dateType==='month'){
                return function(d){
                    return d3.time.format('%Y-%m')(new Date(d)); //uncomment for date format
                }   
            }
            if(filter.dateType==='year'){
                return function(d){
                    return d3.time.format('%Y')(new Date(d)); //uncomment for date format
                }   
            }
            if(filter.dateType==='quarter'){
                return function(d){
                     return d3.time.format('%Y-%m-%d')(new Date(d));  //uncomment for date format
                }   
            }
            return function(d){
                return d3.time.format('%x')(new Date(d)); //uncomment for date format
            }
        }
});
