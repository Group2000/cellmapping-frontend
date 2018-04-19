//cells.js
'use strict';
/* jshint indent: false */


angular.module('celllogger')
	
  	.controller('LacCtrl', function ($scope,$http,leafletData,$filter,AlertService,MAPSERVER, MAXS2LEVEL) {
		

  		$scope.controller='LacCtrl';
  		$scope.search={range:30,serving:"all",network:"all"};
  		$scope.providers=[];
  		$scope.s2zoom=MAPSERVER.center.zoom;
  		$scope.mouseclass='';

  		function getProviders(){
			$http.get('/api/providers',{})
			.error(function(err){
	        	console.log(err);
	        })
	  		.success(function(result) {	

	  			result.forEach(function(provider){
	  				$scope.providers.push({name:provider.name,mccmnc:{mcc:provider.mcc,mnc:provider.mnc}});
	  			})
	  			
	  		})
  		}
  		getProviders();


		$scope.dateOptions = {
			formatYear: 'yy',
			startingDay: 1
		};

		$scope.formats = ['dd-MM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
		$scope.format = $scope.formats[0];

		
		
		
		$scope.$watch('search',function(value){
			getCount();
		})

		$scope.refresh=function(){
			getCount();
		}

		$scope.today = function() {
			$scope.dt = new Date();
		};
		$scope.today();

		$scope.clear = function () {
			$scope.search.dt = null;
		};

		// Disable weekend selection
		$scope.disabled = function(date, mode) {
			return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
		};


		$scope.openCalendar = function($event) {
			
			$event.preventDefault();
			$event.stopPropagation();

			$scope.opened = true;
		};
		
		$scope.$watch('center.zoom',function(newVal,oldVal){
			$scope.s2zoom=$scope.center.zoom+1;
			if($scope.s2zoom>=MAXS2LEVEL){$scope.s2zoom=MAXS2LEVEL.toString()+" (max)";}
			
  			
  		 })
  		
  		 $scope.$watch('bounds',function(newVal,oldVal){
  		 	if($scope.center.zoom>=10){
				getCount();
			}
				
  			
  		 })
  		 $scope.$watch('search',function(newVal,oldVal){
  			if($scope.center.zoom>=10){
				getCount();
			}	
  		 },true)

  		function countstyle(feature){
  			var _style={
		  			weight:2,
		  			opacity:1,
		  			color:'orange',
		  			dashArray:'3',
		  			fillOpacity:0.0
  			}
  			
  			var llstyle=angular.copy(_style);
  			
  			if(feature.count!==0){
  				llstyle.color='blue';
  				llstyle.fillOpacity=feature.count*0.0001;
	  			if(llstyle.fillOpacity<=0.1)
	  				llstyle.fillOpacity=0.1;
	  			if(llstyle.fillOpacity>=0.8)
	  				llstyle.fillOpacity=0.8;
  			}
  			return llstyle
  		}


		function onEachFeature(feature,layer){
				var popup='<strong> Metingen: </strong> ' + feature.count+ "<br>"
				 // + '<strong> Eerste meting: </strong> ' + $filter('date')(feature.firstseen,'dd-MM-yyyy hh:mm:ss')+ "<br>" 
				 + '<strong> Laatste meting: </strong> ' + $filter('date')(feature.lastseen,'dd-MM-yyyy hh:mm:ss')+ "<br>" 

				layer.bindPopup(popup);
		}

		function getCount(){

			if($scope.bounds){
				console.log('here');
				$scope.mouseclass="wait";
				var params={};
	  			params.sw=[$scope.bounds.southWest.lng,$scope.bounds.southWest.lat];
	  			params.ne=[$scope.bounds.northEast.lng,$scope.bounds.northEast.lat];
	  			params.center=$scope.center;
	  			
				if($scope.search.mccmnc){
					params.mnc=$scope.search.mccmnc.mnc;
					params.mcc=$scope.search.mccmnc.mcc;
				}

	  			if($scope.search.dt){
	  				params.dt=new Date($scope.search.dt).getTime();
	  				params.range=$scope.search.range;
	  			}

	  			if($scope.search.network!=='all')
	  				params.network=$scope.search.network

				//GET DISTINCT LAC COUNT
				$http.get('/api/lacdistinctlist',{
					params:params
	  			})
	  			.error(function(err){
	  				console.log(err);
	  			})
	  			.success(function(lacs){
	  				

					// angular.forEach(lacs,function(value,key){
					// 	console.log(key);
					// });

	  				lacs.forEach(function(lac){
	  					
	  					var p={mnc:lac._id.mnc,mcc:lac._id.mcc};

	  					$http.get('/api/getprovidername',{
	  						params:p
	  					})
	  					.error(function(err){
	  						console.log(err);
	  					})
	  					.success(function(name){
	  						lac.name=name;
	  					})
	  				});
	  				$scope.lacs=lacs;
	  				$scope.mouseclass=null;
	  			})

	  			$http.get('/api/lacdistinctcount',{
	  				params:params
	  			})
	  			.error(function(err){
	  				console.log(err);
	  			})
	  			.success(function(cnt){

	  				$scope.distinctcount=cnt;
	  			})
	  			//END
	  		}
		}

		$scope.paintLac=function(hit){
			console.log(hit);
			if(hit.selected===true){
				hit.selected=false;
				console.log($scope.geojson.data.features[0]);
				for(var i=$scope.geojson.data.features.length-1; i>=0;i--){
					var feature=$scope.geojson.data.features[i];
					if(feature.properties.lac===hit._id.lac && feature.properties.mnc===hit._id.mnc && feature.properties.mcc===hit._id.mcc){
						$scope.geojson.data.features.splice(i);
					}
				}
				
			}
			else{
				hit.selected=true;
				var params={}
		  		if(hit._id.mnc)
		  			params.mnc=hit._id.mnc;
		  		if(hit._id.mnc)
		  			params.mcc=hit._id.mcc;
		  		if(hit._id.lac)
		  			params.lac=hit._id.lac;
		  		params.s2level=14;//$scope.search.s2level;

				
				$http.get('/api/findlaccoverage',{
	        		params:params
	        	})
	        	.error(function(err){
	        		console.log(err);
	        	})
	        	.success(function(result) {
	        		if($scope.geojson){
	        			result.features.forEach(function(feature){
	        				$scope.geojson.data.features.push(feature);
	        			});
	        		}
	        		else{
	        			angular.extend($scope,{
		        			geojson:{
		        				data:result,
		        				style:countstyle,
		        				onEachFeature:onEachFeature
		        			}
	        			})
	        		}
	        		if($scope.selectedWifi){
	        			$scope.selectedWifi.selected=false;
	        		}
	        		
	        	});	
	        }
		}

		$scope.clearMarkers=function(){
			angular.forEach(markers,function(value,key){
				delete markers[key];
			});
			angular.forEach(paths,function(value,key){
				delete paths[key];
			});
			$scope.lacs.forEach(function(lac){
				lac.selected=false;
			})
			$scope.geojson=null;
			
		}





//MAP STUFF  		
  		var center={
  			lat:-69,
  			lng:-69,
  			zoom:7
  		};
  		
  		var markers={};
  		var paths={

  		};
  		

		

		angular.extend($scope, {


	   		defaults: {
	   			scrollWheelZoom:false
	   		},
	   	
	        tiles: MAPSERVER.tiles,

	        controls: {
				fullscreen: {},
	        },
	        paths:paths,
	        markers:markers,
	        center:MAPSERVER.center,
	        bounds:$scope.bounds,
	        layers:{
				baselayers:{
					osm:MAPSERVER.osm
				},
			},
	        events: {
	        	map: {
	        		enable: ['click'],
	        		logic:'emit'
	        	}
	        }
		});
		
		leafletData.getMap().then(function(map) {
	        map.restoreView();	      
		});

//END MAP STUFF

  	})