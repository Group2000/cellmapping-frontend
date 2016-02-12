//cells.js
'use strict';
/* jshint indent: false */


angular.module('celllogger')
	
  	.controller('DevicesCtrl', function ($scope,$http,leafletData,$filter,AlertService,WEBSERVICE,$interval) {
  		$scope.devices={}
  		$scope.selectedDevice;
      $scope.editDevice={};
      $http.get(WEBSERVICE + '/devices',{})
  		
		.error(function(err){
        	console.log(err);
        })
  		.success(function(results) {
  			
  			results.cells.buckets.forEach(function(result){
          
  				var device={};
  			
  				device.deviceid=result.key;
                
                
  				device.count=result.doc_count;
  				$scope.devices[device.deviceid]=device;
          getDeviceStats(device);
  			});
  			
  		});
  		

    function updateMeasurements(){
      $http.get('/api/updateMeasurements',{})
       .error(function(err){
            console.log(err)
          })
          .success(function(res){
           console.log(res);
        })
    }

    updateMeasurements();
    function getDeviceStats(device){
      
        $http.get(WEBSERVICE + '/device/'+device.deviceid,{})
          
          .error(function(err){
            console.log(err)
          })
          .success(function(res){
            var dt=new Date();
            var dtOld=new Date(res.lastseen)
            var dtDiff=(new Date()-(new Date(res.lastseen)))/1000/60/60/24
            device.state='green';
            if (dtDiff>=1){
             device.state='yellow';
            }
            if (dtDiff>=7){
             device.state='red';
            }
            device.firstseen=res.firstseen;
            device.lastseen=res.lastseen;
            device.count=res.count;
        })

    }


    $scope.stopUpdate=function(){
      if(angular.isDefined(stop)){
        $interval.cancel(stop);
        stop=undefined;
      }
    }
    
    var stop=$interval(function(){
     angular.forEach($scope.devices,function(value,key){
        getDeviceStats(value);  
      })
      
      // getTotalinScope();
    },3000);


    $scope.$on("$destroy",function(){
      $scope.stopUpdate();
    });




  	$scope.getTemplate=function(device){
        
        if(device.deviceid===$scope.editDevice.deviceid) return 'edit';
        else return 'display';
    }	
  	
    $scope.closeDetails=function(){
            $scope.selectedDevice=null;
            $scope.deviceStats=null;
    }

	$scope.getStats=function(deviceid){
        if(deviceid===$scope.selectedDevice){
            $scope.selectedDevice=null;
            $scope.deviceStats=null;
        }
        else{
            $scope.selectedDevice=$scope.devices[deviceid];
            var params={deviceid:deviceid}
            $http.get('/api/devicestats',{params:params})
            .error(function(err){
                console.log(err);
            })
    		.success(function(results) {
    			$scope.deviceStats=results;
    		});
        }
	}

    $scope.edit=function(device){
        $scope.editDevice=angular.copy(device);
    }

    $scope.save=function(idx){
        console.log(idx);
        var eDevice={}
        eDevice.name=$scope.editDevice.name;
        eDevice.remark=$scope.editDevice.remark;
        eDevice.id=$scope.editDevice.deviceid;
        if($scope.editDevice._id){
            //Update
            $http.put('/api/device/'+$scope.editDevice._id,eDevice)
            .success(function(){
                AlertService.setAlert({msg:'Successfully updated Device ' + $scope.editDevice.newid  ,type:'success',persist:true},true);
                $scope.devices[$scope.editDevice.deviceid]=angular.copy($scope.editDevice);
                $scope.reset();
            })
            .error(function(data){
                AlertService.setAlert({msg:data.err ,type:'danger'});
            });
        }
        else    //INSERT
        {
            console.log(eDevice);
            $http.post('/api/device',eDevice)
            .success(function(){
                AlertService.setAlert({msg:'Successfully inserted Device ' + $scope.editDevice.newid  ,type:'success',persist:true},true);
                $scope.devices[$scope.editDevice.deviceid]=angular.copy($scope.editDevice);
                $scope.reset();
            })
            .error(function(data){
                AlertService.setAlert({msg:data.err ,type:'danger'});
            });
        }
        
    }
    $scope.reset=function(){
        $scope.editDevice={};
    }

})