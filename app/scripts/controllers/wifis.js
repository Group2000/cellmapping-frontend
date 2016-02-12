//cells.js
'use strict';
/* jshint indent: false */


angular.module('celllogger')
	
  	.controller('WifiCtrl', function ($scope,$http,leafletData,$filter,AlertService,MAPSERVER,WEBSERVICEWIFI,geohash) {

  		$scope.desaturate=false;
  		$scope.search={};


		function cellGeoHashOptions(){
			var options = {
				recordsField: 'buckets',
				geohashField: 'key',
				displayOptions: {
					maxSignal:{
						color: cellColorFunction,
						fillColor: cellFillColorFunction,
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

		var cellColorFunction = new L.HSLHueFunction(new L.Point(-110,130), new L.Point(-45,0), {outputSaturation: '100%', outputLuminosity: '50%'});
		var cellFillColorFunction = new L.HSLHueFunction(new L.Point(-110,130), new L.Point(-45,0), {outputSaturation: '100%', outputLuminosity: '50%'});

		
		function geoHashOptions(){
			var options = {
				recordsField: 'geohashes',
				geohashField: 'key',

				layerOptions: {
					fillOpacity: 0.5,
					opacity: 1,
					weight: 1,
					gradient: false
				}
			};
			return options;
		}
		

		function centerOnHash(geoHash,zoom){
			
			var marker=(geohash.decode(geoHash));
			var _center=L.latLng(marker.latitude,marker.longitude);
			leafletData.getMap().then(function(map){
				if(angular.isDefined(zoom)){
	       			map.setZoom(zoom);
				}
	       		map.panTo(_center);
	       	});
		}

	  	$scope.getWifi=function(){
	  		clearMap(true);
	  		var params={}
	  		if($scope.search.ssid)
	  			params.ssid=$scope.search.ssid;
	  		if($scope.search.bssid)
	  			params.bssid=$scope.search.bssid;
	  		params.datePrecision=365;
	  		$http.get(WEBSERVICEWIFI,{
	  			params:params
	  		})
	  		.error(function(error){
	  			console.log(error);
	  		})
	  		.success(function(result){
		        //reformat results
		        console.log(result);
	        	result.aggregations.distinctwifi.buckets.forEach(function(cell){
	        		cell.ssid=cell.top_wifi_hits.hits.hits[0]._source.ssid;
	        		cell.doc_count=cell.top_wifi_hits.hits.total;
	        		cell.maxSignal=cell.top_wifi_hits.hits.hits[0]._source.signal;
	        	})
	        	$scope.wifis=result.aggregations.distinctwifi.buckets
	  		})

	  	}

		$scope.addToMap=function(hit){
			if(!hit.selected){
				$scope.wifis.forEach(function(wifi){
					wifi.selected=false;
				})
				hit.selected=true
				var params={};
				params.bssid=hit.key;
				$http.get(WEBSERVICEWIFI + '/bssidcoverage',{
		        	params:params
		        })
		        .error(function(err){
					console.log(err);
		        })
		        .success(function(result){
		        	$scope.selectedWifi=result;
		        	centerOnHash(result.aggregations.wifigrid.buckets[0].key);
		        	angular.extend($scope,{	
		    			cellgeohash:{
		    				data:result.aggregations.wifigrid,
		    				options:cellGeoHashOptions()
		        		}
		    		})
		    		
		        });
		    }
			else{
				hit.selected=false;
			}
		}

		function clearMap(includeLocation){
			if(includeLocation)
				$scope.geohash=null;
			$scope.cellgeohash=null;
		}

//MAP STUFF

		angular.extend($scope, {
	   		defaults: {
	   			scrollWheelZoom:false
	   		},
	        

	        controls: {
				fullscreen: {},
	        },
	        center:MAPSERVER.center,
	        layers:{
				baselayers:{
					osm:MAPSERVER.osm,
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
			var params={
				lat:args.leafletEvent.latlng.lat,
				lng:args.leafletEvent.latlng.lng,
				geohashPrecision:7,
			}
			$scope.wifis=[];
			clearMap(true);

			$http.get(WEBSERVICEWIFI + '/wifis',{
	        	params:params
	        })
	        .error(function(err){
				console.log(err);
	        })
	        .success(function(result){
		        centerOnHash(result.geohashes[0].key);
	        	angular.extend($scope,{
	    			geohash:{
	    				data:result,
	    				options:geoHashOptions()
	        		}
	    		})
	    		$scope.wifis=result.results;

	        })

		});

  	});