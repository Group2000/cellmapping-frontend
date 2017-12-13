//cells.js
'use strict';
/* jshint indent: false */


angular.module('celllogger')
	
  	.controller('WifiCoverageCtrl', function ($scope,$http,leafletData,$filter,AlertService,MAPSERVER,WEBSERVICEWIFI) {

  		$scope.search={range:365,encryptiontype:'all'};
  		$scope.providers=[];
		$scope.desaturate=false;

		$scope.dateOptions = {
			formatYear: 'yy',
			startingDay: 1
		};

		$scope.formats = ['dd-MM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
		$scope.format = $scope.formats[0];
		
		function getGeoHashes(){
			$http.defaults.useXDomain=true;
			
			if($scope.bounds){
	  			$scope.mouseclass="wait";
				var gp=6;
				switch(true){
					case ($scope.s2zoom<5):
						gp=2;
						break;
					case ($scope.s2zoom>4 && $scope.s2zoom<7):
						gp=3;
						break;
					case ($scope.s2zoom>6 && $scope.s2zoom<9):
						gp=4;
						break;
					case ($scope.s2zoom>8 && $scope.s2zoom<12):
						gp=5;
						break;
					case ($scope.s2zoom>11&& $scope.s2zoom<14):
						gp=6;
						break;
					case ($scope.s2zoom>14):
						gp=7;
						break;
				}


				var params={
					datePrecision:730,
					geohashPrecision:(gp),
					bottom_left:[$scope.bounds.southWest.lat,$scope.bounds.southWest.lng],
					top_right:[$scope.bounds.northEast.lat,$scope.bounds.northEast.lng]
				};

				if ($scope.search.range) {
					params.datePrecision = $scope.search.range;
				}
				
				if($scope.search.encryptiontype!=='all')
	  				params.encryptiontype=$scope.search.encryptiontype;

	  			if($scope.search.dt){
	  				params.timestamp=new Date($scope.search.dt).getTime();
	  			}

		  		$http.get(WEBSERVICEWIFI + '/measurementwificount',{
		            params: params
		        })
	  			.error(function(err){
		        	console.log(err);
		        })
		        .success(function(result){
		        	$scope.distinctcount=result.wifis.value;
		        })

		  		$http.get(WEBSERVICEWIFI + '/coverage',{
		            params: params
		        })
		        .error(function(err){
		        	console.log(err);
		        })
		        .success(function(result){
		        	$scope.measurementcount=result.hits.total;
		        	var maxValue=0;
		        	
		        	if(result.hits.total>0)
			        	maxValue=result.aggregations.cellgrid.buckets[0].doc_count;
		        	
					var colorFunction = new L.HSLHueFunction(new L.Point(1,120), new L.Point(maxValue,0), {outputSaturation: '100%', outputLuminosity: '50%'});
					var fillColorFunction = new L.HSLHueFunction(new L.Point(1,120), new L.Point(maxValue,0), {outputSaturation: '100%', outputLuminosity: '50%'});
					function geoHashOptions(){
						var options = {
							recordsField: 'buckets',
							geohashField: 'key',
							displayOptions: {
								doc_count: {
									displayName: 'Nr meas.:',
									color: colorFunction,
									fillColor: fillColorFunction,
									gradient: false
								}
							},
							layerOptions: {
								fillOpacity: 0.5,
								opacity: 1,
								weight: 1,
								gradient: true
							},
			                tooltipOptions: {
			                    iconSize: new L.Point(80,55),
			                    iconAnchor: new L.Point(-5,55)
			                }
						};
						return options;
					}

		        	angular.extend($scope,{
	        			geohash:{
	        				data:result.aggregations.cellgrid,
	        				options:geoHashOptions()
		        		}
	        		})
		        })
		        $scope.mouseclass=null;
		    }
		}

		function getTotal(){
			var params={
				datePrecision:7000
			}

			$http.get(WEBSERVICEWIFI+'/measurementcount',{
				params: params
		  		})
				.error(function(err){
		        	console.log(err);
		        })
		  		.success(function(result) {	
		  			$scope.total=result.total;
		  		})
		}

		getTotal();

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
			//if($scope.s2zoom>=MAXS2LEVEL){$scope.s2zoom=MAXS2LEVEL.toString()+" (max)";}
			
  			
  		 })
  		
  		 $scope.$watch('bounds',function(newVal,oldVal){
  	// 	 	if($scope.center.zoom>=10){
			 	getGeoHashes();
			// }
				
  			
  		 })
  		 $scope.$watch('search',function(newVal,oldVal){
  			// if($scope.center.zoom>=10){
				getGeoHashes();
			// }	
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
  				llstyle.color='green';
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
		  		var params={};
	  			params.sw=[$scope.bounds.southWest.lng,$scope.bounds.southWest.lat];
	  			params.ne=[$scope.bounds.northEast.lng,$scope.bounds.northEast.lat];
	  			params.center=$scope.center;
	  			
  				if($scope.search.encryptiontype && $scope.search.encryptiontype!=='all'){
  					console.log($scope.search.encryptiontype);
  					params.encryptiontype=$scope.search.encryptiontype;
  				}
	  			if($scope.search.dt){
	  				params.dt=new Date($scope.search.dt).getTime();
	  			}
	  			if ($scope.search.range){
	  				params.range=$scope.search.range;
	  			}
	  			
	  			$http.get('/api/wifiMeasurements',{
		  			params:params
		  		})
				.error(function(err){
		        	console.log(err);
		        })
		  		.success(function(results) {
		  			
		  			//GET DISTINCT SSID COUNT
		  			$http.get('/api/wifidistinctcount',{
		  				params:params
		  			})
		  			.error(function(err){
		  				console.log(err);
		  			})
		  			.success(function(cnt){

		  				$scope.distinctcount=cnt;
		  			})
		  			//END

		  			$scope.measurementcount=results.resultsLength;
		  			var features=[]
		  			angular.forEach(results.covers,function(item,key){
		  				var feature={}
						feature.type="Feature";
						feature.id=key;
						feature.count=item.count;
						feature.lastseen=item.lastSeen;
						feature.geometry=item.geometry;		  				
		  				features.push(feature);
		  			})
		  			angular.extend($scope,{
        			geojson:{
        				data:features,
        				style:countstyle,
        				onEachFeature:onEachFeature
	        			}
        			})
		  		});
		  	}
	  	};



//MAP STUFF  		
   		var markers={};
  		var paths={

  		};
 		angular.extend($scope, {
	   		defaults: {
	   			scrollWheelZoom:false
	   		},
	   	
	        // tiles: MAPSERVER.tiles,

	        controls: {
				fullscreen: {},
	        },
	        paths:paths,
	        markers:markers,
	        center:MAPSERVER.center,
	        bounds:$scope.bounds,
	        layers:{
				baselayers:{
					osm:MAPSERVER.osm,
					osmCache : MAPSERVER.osmCache,
					luchtfoto: MAPSERVER.luchtfoto
				},
			},
	        events: {
	        }
		});
 		
 		$scope.$on('leafletDirectiveMap.baselayerchange', function(
 				event, args) {
			if (args.leafletEvent.name === 'OSM' || args.leafletEvent.name === 'OpenStreetMap' || args.leafletEvent.name === 'OpenStreetMap cache') {
 				$scope.desaturate = true;
 			} else {
 				$scope.desaturate = false;
 			}
 			;
 		});
//END MAP STUFF

  	})