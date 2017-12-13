//cells.js
'use strict';
/* jshint indent: false */


angular.module('celllogger')
	
  	.controller('CellPlotCtrl', function ($scope,$http,leafletData,$filter,AlertService,MAPSERVER) {

		$scope.desaturate=true;
  		var center={
  			lat:-69,
  			lng:-69,
  			zoom:7
  		};
  		
  		var markers={};
  		var paths={};
  		
  		$scope.searchDisabled=true;
  		$scope.cells=[];
  		$scope.selectedCells=[];

  		$scope.mncs=[
  			{provider:'Vodafone',mnc:4,mcc:204},
  			{provider:'KPN',mnc:8,mcc:204},
  			{provider:'T-Mobile',mnc:16,mcc:204}]




  		function style(feature){
  			var _style={
		  			weight:2,
		  			opacity:1,
		  			color:'red',
		  			dashArray:'3',
		  			fillOpacity:0.5
  			}
  			var llstyle=angular.copy(_style);
			if(feature.id==='clicked'){
				llstyle.color='lightgreen';
	  			return llstyle;
		  	}

  			if(feature.properties.serving){
  				llstyle.color='orange';
  				return llstyle;
	  			
		  	}
		  	else{
		  		llstyle.color='yellow';
  				return llstyle;
		  	}
  		}



	  	function getCell(){
	  		var params={}
	  		if($scope.search.cid)
	  			params.cid=$scope.search.cid;
	  		if($scope.search.mnc)
	  			params.mnc=$scope.search.mnc;
	  		if($scope.search.mcc)
	  			params.mcc=$scope.search.mcc;
	  		if($scope.search.lac)
	  			params.lac=$scope.search.lac;
	  		console.log(params);
	  		$http.defaults.useXDomain=true;
	  		$http.get('http://lidl.te5.net/services/cells',{
	            params: params
	        })
	        .error(function(err){
	        	console.log(err);
	        })
	        .success(function(result) {
	        	console.log(result);
	        	var len=result.length;
	        	var resTemp={};
	        	var newResult=[];
	        	while(len--){
	        		var key=result[len].cid+"-"+result[len].mnc+"-"+result[len].mcc+"-"+result[len].lac+result[len].timestamp;
	        		
	        		
	        		resTemp[key]=result[len];
	        	}
	        	for(var item in resTemp){
	        		
	        		newResult.push(resTemp[item]);
	        	}
	        	$scope.cells=newResult

				
	        });
	  	}


	  	$scope.paintCell=function(hit){
	  		var params={}
	  			params.cid=hit.cid;
	  			params.mnc=hit.mnc;
	  			params.mcc=hit.mcc;
	  			params.lac=hit.lac;
	  		
	  		$http.get('http://lidl.te5.net/services/cells',{
	            params: params
	        })
	        .error(function(err){
	        	console.log(err);
	        })
	        .success(function(result) {
	        	
	        	//last is newest
	        	
	        	if(result.length>0){
					hit.marker=true;
	        		$scope.addToMap(result[result.length-1]);
	        	}else
	        	{
	        		//raise error: Cell not found
	        		var key=hit.mcc+"-"+hit.mnc +"-"+hit.cid +", lac:" + hit.lac;
	        		AlertService.setAlert({msg:'Unable to find cell in provider cell database for '+ key,type:'warning',persist:false},true);
	        	}
				
	        });
	  	}

		$scope.getCells=function(){
			$scope.cells=[];
			var params={};
			console.log($scope.bounds);
			params.bottom_right=[$scope.bounds.northEast.lng,$scope.bounds.southWest.lat];
	  		params.top_left=[$scope.bounds.southWest.lng,$scope.bounds.northEast.lat];
	  		
	  		params.center=$scope.center;
	  		console.log(params);
	  		//$http.get('http://lidl.te5.net/services/cells',{
	  		//$http.get('http://localhost:8080/cells',{
	  		$http.get('/api/findcell',{
	            params: params
	        })
	        .error(function(err){
	        	console.log(err);
	        })
			 .success(function(result) {
	        	var buckets=result.aggregations.dedup.buckets;
	        	console.log(buckets);
				for(var i = 0; i < buckets.length; i ++){
					$scope.addToMap(buckets[i].dedup_docs.hits.hits[0]._source);
				}
	        });
		}

		$scope.$watch('center.zoom',function(zoom){
			console.log(zoom);
			if(zoom>=15){
				$scope.searchDisabled=false;
			}
			if(zoom<15){
				$scope.searchDisabled=true;
			}
		})

		function lookupMNC(mcc,mnc){
			var ret='unknown';
			$scope.mncs.forEach(function(prov){
				if(prov.mcc===mcc & prov.mnc===mnc){
					ret=prov.provider;
				}
			})
			return ret;
		}


		
		$scope.addToMap=function(hit){

			if (hit.mnc && hit.mcc && hit.timestamp){
				var key;
				if(hit.cid){
					key=hit.mcc.toString()+hit.mnc.toString()+hit.cid.toString()+hit.lac.toString()+hit.timestamp.toString();	
				}
				else
				{
					console.log('LTE');
					key=hit.mcc.toString()+hit.mnc.toString()+hit.eci.toString()+hit.timestamp.toString();	
				}

				var fillcolor;
				if(hit.point && key){
					
					var marker={
						//layer:'cells',
						lat:hit.point[1],
						lng:hit.point[0],
						draggable:false,
						label:hit.cid + "-" + hit.mnc + "-" + hit.mcc + " " + hit.network,
						title:hit.cid + "-" + hit.mnc + "-" + hit.mcc + " " + hit.network,
						source:hit.source,
						message:'<strong>Cell-id: </strong>'+hit.cid +'<br>'+
							'<strong>Provider: </strong>'+hit.mnc +' (' + lookupMNC(hit.mcc,hit.mnc) +')<br>'+
							'<strong>Network: </strong>'+hit.network +'<br>'+
							'<strong>Country: </strong>'+hit.mcc +'<br>' +
							'<strong>Lac: </strong>'+hit.lac +'<br>' +
							'<strong>Source: </strong>'+hit.source +'<br>'+
							'<strong>Date: </strong>'+$filter('date')(hit.timestamp,'dd-MM-yyyy') +'<br>',
					}
					switch(hit.mnc){
						case 4:
							marker.icon=icons.vodafone;
							break;
						case 8:
							marker.icon=icons.kpn;
							break;
						case 16:
							marker.icon=icons.tmobile;
							break;
						default: 
							marker.icon=icons.other;

					}
					markers[key]=marker;
					

					var coords=[]
					// if(hit.shape){
					// 	hit.shape.coordinates[0].forEach(function(point){
					// 		coords.push({lat:point[1],lng:point[0]});
					// 	});

						
						
					// 	paths[key]={
					// 		type:'polygon',
					// 		//layer:'coverage',
					// 		color:marker.icon.markerColor,
					// 		fillColor:marker.icon.markerColor,
					// 		fillOpacity:0.2,
					// 		weight:1,
					// 		latlngs:coords
					// 	}
					// }

					// var params={}
			  // 		if(hit.cid)
			  // 			params.cid=hit.cid;
			  // 		if(hit.mnc)
			  // 			params.mnc=hit.mnc;
			  // 		if(hit.mnc)
			  // 			params.mcc=hit.mcc;
			  // 		if(hit.lac)
			  // 			params.lac=hit.lac;
			  // 		params.serving=false;
					// $http.get('/api/findcoverage',{
		   //      		params:params
		   //      	})

		   //      	.error(function(err){
		   //      		console.log(err);
		   //      	})
		   //      	.success(function(result) {
		        		
		   //      		if($scope.geojson){
		   //      			result.features.forEach(function(feature){
		   //      				$scope.geojson.data.features.push(feature);
		   //      			});
		   //      		}
		   //      		else{
		   //      			angular.extend($scope,{
			  //       			geojson:{
			  //       				data:result,
			  //       				style:style,
			  //       				onEachFeature:onEachFeature
			  //       			}
		   //      			})
		   //      		}
		   //      	});



				}

				
				hit.marker=true;
			}else
			{
				console.log("MISSING DATA");
				console.log(hit);
			}
		}

		function onEachFeature(feature,layer){
			if(feature.properties){
				var popup='<strong> Cell: </strong>' + feature.properties.mcc +"-"+ feature.properties.mnc +"-"+ feature.properties.lac +"-"+ feature.properties.cid + "<br>"
				popup+='<strong> Signal: </strong>' + feature.properties.signal + "db <br>"
				layer.bindPopup(popup);
			}
		}

		$scope.clearMarkers=function(){
			angular.forEach(markers,function(value,key){
				delete markers[key];
			});
			
			$scope.selectedCells=[];
			if($scope.clickedCells){
				for(var i=0;i<$scope.clickedCells.length;i++){
					$scope.clickedCells[i].marker=null;
				}
			}
			if($scope.cells){
				for(var i=0;i<$scope.cells.length;i++){
					$scope.cells[i].marker=null;
				}
			}
			
			$scope.geojson=null;
			
		}

		$scope.removeFromMap=function(hit){
			console.log(hit);
			hit.marker=false;
			//var key=hit.network+hit.cid.toString()+hit.lac.toString()+hit.timestamp.toString();
			var key=hit.mcc.toString()+hit.mnc.toString()+hit.cid.toString()+hit.lac.toString()+hit.timestamp.toString();
			delete(markers[key]);
			delete(paths[key]);
			for(var i=0;i<$scope.clickedCells.length;i++){
				$scope.clickedCells[i].key=$scope.clickedCells[i].mcc.toString()+$scope.clickedCells[i].mnc.toString()+$scope.clickedCells[i].cid.toString()+$scope.clickedCells[i].lac.toString();
				if($scope.clickedCells[i].key==key){
					$scope.clickedCells[i].marker=false;
				}
			}
			for(var i=0;i<$scope.selectedCells.length;i++){
				if($scope.selectedCells[i].key==key){
					$scope.selectedCells.splice(i,1);
				}
			}
			var len=$scope.geojson.data.features.length;
			while(len--){
				if($scope.geojson.data.features[len].properties.cid===hit.cid && $scope.geojson.data.features[len].properties.lac===hit.lac && $scope.geojson.data.features[len].properties.mcc===hit.mcc && $scope.geojson.data.features[len].properties.mnc===hit.mnc){
					$scope.geojson.data.features.splice(len,1);
				}
			}

		}


		var icons={};
		icons.vodafone={
	 		type:'awesomeMarker',
	 		prefix:'fa',
	 		icon: 'signal',
	 		markerColor:'red'
		};
		icons.kpn={
	 		type:'awesomeMarker',
	 		prefix:'fa',
	 		icon: 'signal',
	 		markerColor:'green'
		};
		icons.tmobile={
	 		type:'awesomeMarker',
	 		prefix:'fa',
	 		icon: 'signal',
	 		markerColor:'purple'
		}
		icons.other={
	 		type:'awesomeMarker',
	 		prefix:'fa',
	 		icon: 'signal',
	 		markerColor:'orange'
		}



//MAP STUFF

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
					
					osm:MAPSERVER.osm,
					osmCache : MAPSERVER.osmCache,
					basic:MAPSERVER.mapbox_streets_basics,
					luchtfoto: MAPSERVER.luchtfoto
				},
			},
	        events: {
	        	map: {
	        		enable: ['click'],
	        		logic:'emit'
	        	}
	        }
		});





		$scope.$on('leafletDirectiveMap.click',function(event,args){
			// // console.log(args.leafletEvent.latlng);
			// var params={lat:args.leafletEvent.latlng.lat,lng:args.leafletEvent.latlng.lng}
			// $http.get('/api/findservingcells',{
	  //       		params:params
	  //       	})

	  //       	.error(function(err){
	  //       		console.log(err);
	  //       	})
	  //       	.success(function(result) {
			// 		$scope.cells=[];
	  //       		// console.log(result);
	  //       		$scope.clickedCells=result.cells;
			// 		if($scope.geojson){

			// 			var len=$scope.geojson.data.features.length;
			// 			while(len--){
			// 				if($scope.geojson.data.features[len].id==='clicked'){
			// 					$scope.geojson.data.features.splice(len,1);
			// 				}
			// 			}

	  //       			result.coverage.features.forEach(function(feature){
	  //       				$scope.geojson.data.features.push(feature);
	  //       			});
	  //       		}
	  //       		else{
	  //       			angular.extend($scope,{
		 //        			geojson:{
		 //        				data:result.coverage,
		 //        				style:style,
			// 					onEachFeature:onEachFeature
		 //        			}
	  //       			})
	  //       		}


	  //       	})

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


  	});