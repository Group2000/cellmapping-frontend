//monitoring.js

angular.module('celllogger')
  	.controller('MonitorCtrl', function ($scope,$http,$interval) {

    $scope.running=undefined;
    $scope.hourlyRunning=undefined;

    $scope.graphOptions={
      width:400,
      height:77,
      colorscheme:'white',
      options:{showxAxis:false,colorscheme:'white',transitionDuration:500}
    };
    $scope.hourGraphOptions={
      width:1200,
      height:150,
      colorscheme:'black',
      options:{showxAxis:true,colorscheme:'black',transitionDuration:0}
    };
    $scope.hourChartOptions={
      width:1200,
      height:150,
      colorscheme:'black',
      options:{showxAxis:true,showyAxis:true,colorscheme:'black',transitionDuration:0}
    };
    
    $scope.graphs=[];
    
    $http.get('/api/categories',{}).then(function(data){
      console.log(data.data);
      var categories=['no-q','wifi','anpr'];
      for(var i=0;i<data.data.length;i++){
        categories.push(data.data[i].category);
      }
        
      
      

      categories.map(function(item){
        getSourceActivity(item,null,'day',14).then(function(response){
          var state="green";
          if(response.data[response.data.length-1].value===0){
            var state="yellow";
            if(response.data[response.data.length-2].value===0)
              var state="red";
          }
          
          $scope.graphs.push({category:item,data:response.data,state:state});
        }) 

        //hourly updates
        $scope.hourlyRunning=$interval(function(){
          getSourceActivity(item,null,'day',14).then(function(response){
          
          var state="green";
          if(response.data[response.data.length-1].value===0){
            var state="yellow";
            if(response.data[response.data.length-2].value===0)
              var state="red";
          }

            for(graph in $scope.graphs){
              console.log(graph);
              if($scope.graphs[graph].category===item){
                $scope.graphs[graph].data=response.data;
                $scope.graphs[graph].state=state;
              }
            }
          })
        },(60*60*1000))

        //end updates

      })
  	});


    $scope.getHourlyData=function(category){
      if($scope.running){$interval.cancel($scope.running)};
      //get initial valie
      getSourceActivity(category,null,'minute',120).then(function(response){
          $scope.hourGraph={data:response.data,category:category};
      })
      // getSourceActivity(category,null,'second',120).then(function(response){
      //     $scope.chart={data:response.data,category:category};
      // })
      //start interval
      $scope.running=$interval(function(){
        getSourceActivity(category,null,'minute',120).then(function(response){
          $scope.hourGraph={data:response.data,category:category};
          
        })
      },2000)

    //  $scope.running2=$interval(function(){
    //   getSourceActivity(category,null,'second',120).then(function(response){
        
    //     $scope.chart={data:response.data,category:category};
    //   })
    // },2000)
      
    };
   
  	function getSourceActivity(category,id,interval,count){
		var params={
                category:category,
                id:id,
                interval:interval,
                count:count
            };

		return $http.get('/api/sourceactivity',{
            params: params
        })
    }

  	});
