//cells.js
'use strict';
/* jshint indent: false */


angular.module('celllogger')
	
  	.controller('CellloggerCtrl', function ($scope,$http,,leafletData,$filter,AlertService,MAPSERVER, MAXS2LEVEL,leafletEvents,WEBSERVICE,$interval) {
		
		$scope.desaturate=true;
  		$scope.controller='CellloggerCtrl';
  		$scope.search={range:30,serving:"all",network:"all"};
  		$scope.providers=[];
  		$scope.s2zoom=MAPSERVER.center.zoom;
  		$scope.mouseclass=null;

  		function getProviders(){
			$http.get(WEBSERVICE + '/measurementproviders',{})
			.error(function(err){
	        	console.log(err);
	        })
	  		.success(function(result) {	
	  			//console.log(result);
	  			angular.forEach(result.providers.buckets,function(provider){
//	  				var arr = provider.key.split("-");
//	  				var mcc = arr[0];
//	  				var net = arr[1];
	  				$scope.providers.push({name:result.provider.key,mccmnc:provider.key});
//	  				$http.get(WEBSERVICE + '/provider',{mcc:parseInt(mcc), net:parseInt(net)})
//	  				.error(function(err){
//	  		        	console.log(err);
//	  		        })
//	  		  		.success(function(result) {	
//	  		  			$scope.providers.push({name:result.provider.name,mccmnc:provider.key});
//	  		  		})
	  				
	  				
	  			})
	  			// result.forEach(function(provider){
	  			// 	$scope.providers.push({name:provider.name,mccmnc:{mcc:provider.mcc,mnc:provider.mnc}});
	  			// })
	  			
	  		})
  		}
  		getProviders();


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
					datePrecision:365,
					geohashPrecision:(gp),
					bottom_left:[$scope.bounds.southWest.lat,$scope.bounds.southWest.lng],
					top_right:[$scope.bounds.northEast.lat,$scope.bounds.northEast.lng]
				};

				if($scope.search.mccmnc){
					params.net=$scope.search.mccmnc.split('-')[1];
                    params.mcc=$scope.search.mccmnc.split('-')[0];
  				}
	  			if($scope.search.dt){
	  				params.timestamp=new Date($scope.search.dt).getTime();
	  			}
	  			if($scope.search.serving!=='all')
	  				params.serving=$scope.search.serving==="true"
	  			if($scope.search.network!=='all')
	  				params.radio=$scope.search.network
		  		
		  		$http.get(WEBSERVICE + '/measurementcellcount',{
		            params: params
		        })
	  			.error(function(err){
		        	console.log(err);
		        })
		        .success(function(result){
		        	
		        	$scope.distinctcount=result.cells.value;
		        	
		        })



		  		$http.get(WEBSERVICE + '/coverage',{
		            params: params
		        })
		        .error(function(err){
		        	console.log(err);
		        })
		        .success(function(result){
		        	

		        	$scope.measurementcount=result.hits.total;

		        	var maxValue=result.aggregations.cellgrid.buckets[0].doc_count;
		        	
					var colorFunction = new L.HSLHueFunction(new L.Point(1,120), new L.Point(maxValue,0), {outputSaturation: '100%', outputLuminosity: '50%'});
					var fillColorFunction = new L.HSLHueFunction(new L.Point(1,120), new L.Point(maxValue,0), {outputSaturation: '100%', outputLuminosity: '50%'});
					function geoHashOptions(){
						var options = {
							recordsField: 'buckets',
							geohashField: 'key',
							displayOptions: {
								doc_count: {
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

		
		// function getTotalinScope(){
		// 	var gp=6;
		// 	switch(true){
		// 		case ($scope.s2zoom<5):
		// 			gp=2;
		// 			break;
		// 		case ($scope.s2zoom>4 && $scope.s2zoom<7):
		// 			gp=3;
		// 			break;
		// 		case ($scope.s2zoom>6 && $scope.s2zoom<9):
		// 			gp=4;
		// 			break;
		// 		case ($scope.s2zoom>8 && $scope.s2zoom<12):
		// 			gp=5;
		// 			break;
		// 		case ($scope.s2zoom>11&& $scope.s2zoom<14):
		// 			gp=6;
		// 			break;
		// 		case ($scope.s2zoom>14):
		// 			gp=7;
		// 			break;
		// 	}
			

		// 	var params={
		// 		datePrecision:365,
		// 		geohashPrecision:(gp),
		// 		bottom_left:[$scope.bounds.southWest.lat,$scope.bounds.southWest.lng],
		// 		top_right:[$scope.bounds.northEast.lat,$scope.bounds.northEast.lng]
		// 	};

		// 	if($scope.search.mccmnc){
		// 			params.net=$scope.search.mccmnc.mnc;
		// 			params.mcc=$scope.search.mccmnc.mcc;
		// 		}
  // 			if($scope.search.dt){
  // 				params.timestamp=new Date($scope.search.dt).getTime();
  // 			}
  // 			if($scope.search.serving!=='all')
  // 				params.serving=$scope.search.serving==="true"
  // 			if($scope.search.network!=='all')
  // 				params.radio=$scope.search.network
	 //  		console.log(params);
	 //  		$http.get(WEBSERVICE + '/measurementcellcount',{
	 //            params: params
	 //        })
  // 			.error(function(err){
	 //        	console.log(err);
	 //        })
	 //        .success(function(result){
	 //        	console.log(result);
	 //        	$scope.distinctcount=result.cells.value;
	        	
	 //        })
		// }

		function getTotal(){
			var params={
				datePrecision:365
			}

			$http.get(WEBSERVICE+'/measurementcount',{
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
		getGeoHashes();


//Regular updates
		$scope.stopUpdate=function(){
			if(angular.isDefined(stop)){
				$interval.cancel(stop);
				stop=undefined;
			}
		}
		
		var stop=$interval(function(){
			getTotal();
			// getTotalinScope();
		},3000);


		$scope.$on("$destroy",function(){
			$scope.stopUpdate();
		});



		$scope.$watch('search',function(value){
			getGeoHashes();
		})

		$scope.refresh=function(){
			getGeoHashes();
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

  		// function getCount(){
  		// 	getGeoHashes();
	  	// // 	if($scope.bounds){
	  	// // 		$scope.mouseclass="wait";
	  			
		  // // 		var params={};
	  	// // 		params.sw=[$scope.bounds.southWest.lng,$scope.bounds.southWest.lat];
	  	// // 		params.ne=[$scope.bounds.northEast.lng,$scope.bounds.northEast.lat];
	  	// // 		params.center=$scope.center;
	  			
  		// // 		if($scope.search.mccmnc){
  		// // 			console.log($scope.search.mccmnc)
  		// // 			params.mnc=$scope.search.mccmnc.mnc;
  		// // 			params.mcc=$scope.search.mccmnc.mcc;
  		// // 		}
	  	// // 		if($scope.search.dt){
	  	// // 			params.dt=new Date($scope.search.dt).getTime();
	  	// // 			params.range=$scope.search.range;
	  	// // 		}
	  	// // 		if($scope.search.serving!=='all')
	  	// // 			params.serving=$scope.search.serving==="true"
	  	// // 		if($scope.search.network!=='all')
	  	// // 			params.network=$scope.search.network
	  	// // 		$http.get('/api/measurements',{
		  // // 			params:params
		  // // 		})
				// // .error(function(err){
		  // //       	console.log(err);
		  // //       })
		  // // 		.success(function(results) {
		  			
		  // // 			//GET DISTINCT CELL COUNT
		  // // 			$http.get('/api/measurementdistinctcount',{
		  // // 				params:params
		  // // 			})
		  // // 			.error(function(err){
		  // // 				console.log(err);
		  // // 			})
		  // // 			.success(function(cnt){
		  // // 				$scope.distinctcount=cnt;
		  // // 			})
		  // // 			//END

		  // // 			$scope.measurementcount=results.resultsLength;
		  // // 			var features=[]
		  // // 			angular.forEach(results.covers,function(item,key){
		  // // 				var feature={}
				// // 		feature.type="Feature";
				// // 		feature.id=key;
				// // 		feature.count=item.count;
				// // 		feature.lastseen=item.lastSeen;
				// // 		feature.geometry=item.geometry;		  				
		  // // 				features.push(feature);
		  // // 			})

		  // // 			angular.extend($scope,{
    // //     			geojson:{
    // //     				data:features,
    // //     				style:countstyle,
    // //     				onEachFeature:onEachFeature
	   // //      			}
    // //     			})
    // //     			$scope.mouseclass=null;
		  // // 		});
		  // // 	}
	  	// };



//MAP STUFF  		

  		
  		var markers={};
  		var paths={};

		angular.extend($scope, {
	   		defaults: {
	   			scrollWheelZoom:false
	   		},
	   	
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
					// basic:MAPSERVER.mapbox_streets_basics,
					luchtfoto: MAPSERVER.luchtfoto
				},
			},
	        events: {
	        	// map: {
	        	// 	enable: ['click'],
	        	// 	logic:'emit'
	        	// },
	        	marker:{disable:leafletEvents.getAvailableMarkerEvents()},
	        	path:{disable:leafletEvents.getAvailablePathEvents()}
	        }
		});

		$scope.$on('leafletDirectiveMap.baselayerchange',function(event,args){
       		if(args.leafletEvent.name==='OSM'){
       			$scope.desaturate=true;
       		}else{
       			$scope.desaturate=false;
       		};
       	});

//END MAP STUFF

  	})