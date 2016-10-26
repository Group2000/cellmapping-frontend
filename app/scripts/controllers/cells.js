//cells.js
'use strict';
/* jshint indent: false */

angular
		.module('celllogger')

		.controller(
				'CellsCtrl',
				function($scope, $http, leafletData, $filter, AlertService,
						MAPSERVER, $q, WEBSERVICE, geohash) {

					$scope.desaturate = true;
					var markers = {};
					var cache = {};
					$scope.cells = [];
					$scope.search = {
						geohashPrecision : 7,
						serving : null,
						range : 365
					};
					
					$scope.dateOptions = {
							formatYear : 'yy',
							startingDay : 1
						};
					
					$scope.formats = [ 'dd-MM-yyyy', 'yyyy/MM/dd',
										'dd.MM.yyyy', 'shortDate' ];
					$scope.format = $scope.formats[0];

					$scope.today = function() {
						$scope.dt = new Date();
					};
					$scope.today();

					$scope.clear = function() {
						$scope.search.dt = null;
					};
					
					$scope.openCalendar = function($event) {

						$event.preventDefault();
						$event.stopPropagation();

						$scope.opened = true;
					};
					
					var icons = {};
					icons.vodafone = {
						type : 'awesomeMarker',
						prefix : 'fa',
						icon : 'signal',
						markerColor : 'red'
					};
					icons.kpn = {
						type : 'awesomeMarker',
						prefix : 'fa',
						icon : 'signal',
						markerColor : 'green'
					};
					icons.tmobile = {
						type : 'awesomeMarker',
						prefix : 'fa',
						icon : 'signal',
						markerColor : 'purple'
					}
					icons.other = {
						type : 'awesomeMarker',
						prefix : 'fa',
						icon : 'signal',
						markerColor : 'orange'
					}

					// var colorFunction = new L.HSLHueFunction(new
					// L.Point(1,130), new L.Point(500,0), {outputSaturation:
					// '100%', outputLuminosity: '0%'});
					// var fillColorFunction = new L.HSLHueFunction(new
					// L.Point(1,130), new L.Point(500,0), {outputSaturation:
					// '100%', outputLuminosity: '50%'});

					function geoHashOptions() {
						var options = {
							recordsField : 'geohashes',
							geohashField : 'key',
							displayOptions : {},
							layerOptions : {
								fillOpacity : 0.5,
								opacity : 1,
								weight : 1,
								gradient : false
							}
						};
						return options;
					}

					function cellGeoHashOptions() {
						var options = {
							recordsField : 'buckets',
							geohashField : 'key',
							displayOptions : {
								maxSignal : {
									displayName: 'Max Signal dBm',
									color : cellColorFunction,
									fillColor : cellFillColorFunction,
									gradient : false
								}
							},
							layerOptions : {
								fillOpacity : 0.5,
								opacity : 1,
								weight : 1,
								gradient : true
							},
							tooltipOptions: {
			                    iconSize: new L.Point(80,55),
			                    iconAnchor: new L.Point(-5,55)
			                }
						};
						return options;
					}

					var cellColorFunction = new L.HSLHueFunction(new L.Point(
							-110, 130), new L.Point(-45, 0), {
						outputSaturation : '100%',
						outputLuminosity : '50%'
					});
					var cellFillColorFunction = new L.HSLHueFunction(
							new L.Point(-110, 130), new L.Point(-45, 0), {
								outputSaturation : '100%',
								outputLuminosity : '50%'
							});

					function centerOnMarker(marker, zoom) {
						var _center = L.latLng(marker.lat, marker.lng);
						leafletData.getMap().then(function(map) {
							if (angular.isDefined(zoom)) {
								map.setZoom(zoom);
							}
							map.panTo(_center);
						});
					}

					function centerOnHash() {
						leafletData.getMap().then(function(map) {
							var latlngs = [];
							if ($scope.cellgeohash.data){
								for (var i in $scope.cellgeohash.data.buckets) {
	                                var coord = geohash.decode( $scope.cellgeohash.data.buckets[i].key);
	                                var center = L.latLng(coord.latitude, coord.longitude);
	                                latlngs.push(center);
	                                }
	                            map.fitBounds(latlngs);
							}
						});
					}

					$scope.$watch('search', function(newVal, oldVal) {
						if (newVal.geohashPrecision !== oldVal.geohashPrecision
								|| newVal.serving !== oldVal.serving) {
							$scope.cells.forEach(function(cell) {
								if (cell.selected) {
									cell.selected = false;
									$scope.addToMap(cell);
								}
							})
						} else {
							if ($scope.search.cid || $scope.search.mnc
									|| $scope.search.lac || $scope.search.mnc) {
								getCell();
							}
						}

					}, true)

					function getCell() {
						$scope.cells = [];
						$scope.clearMarkers(true);
						var params = {};
						if ($scope.search.cid) {
							params.cell = $scope.search.cid;
						}
						if ($scope.search.mnc) {
							params.net = $scope.search.mnc;
						}
						if ($scope.search.mcc) {
							params.mcc = $scope.search.mcc;
						}
						if ($scope.search.lac) {
							params.area = $scope.search.lac;
						}

						if ($scope.search.dt) {
							params.timestamp = new Date($scope.search.dt)
									.getTime();
						}
						if ($scope.search.range) {
							params.datePrecision = $scope.search.range;
						}
						// $http.defaults.useXDomain=true;

						$http.get(WEBSERVICE, {
							params : params
						}).error(function(error) {
							console.log(error);
						}).success(function(result) {
							$scope.cells = result;
							$scope.cells.forEach(function(cell) {
								lookupMNC(cell);
							})
						})
					}

					// 10870
					$scope.paintCellCoverage = function(hit) {
						var params = {}
						params.uuid = hit.uuid;
						params.cell = hit.cell;
						params.net = hit.net;
						params.mcc = hit.mcc;
						params.area = hit.area;
						params.geohashPrecision = $scope.search.geohashPrecision;
						params.serving = $scope.search.serving;
						if ($scope.search.range) {
							params.datePrecision = $scope.search.range;
						} else {
							params.datePrecision = 730;
						}
						if ($scope.search.dt) {
							params.timestamp = new Date($scope.search.dt).getTime();
						}
						$http
								.get(WEBSERVICE + '/cellcoverage', {
									params : params
								})
								.error(function(err) {
									console.log(err);
								})
								.success(
										function(result) {
											console.log(result);
											if (result.aggregations.cellgrid.buckets.length > 0) {
												angular
														.extend(
																$scope,
																{
																	cellgeohash : {
																		data : result.aggregations.cellgrid,
																		options : cellGeoHashOptions()
																	}
																})
												centerOnHash();
											} else {
												$scope.detail = {
													message : 'No data available, check serving/neigbour settings'
												}
											}

										});

					}

					function createMarker(hit) {

						var marker = {
							// layer:'cells',
							lat : hit.location[1],
							lng : hit.location[0],
							iconAngle : hit.azimuth,
							riseOnHover : true,
							draggable : false,
							label : hit.mcc + "-" + hit.net + "-" + hit.area
									+ "-" + hit.cell,
							title : hit.mcc + "-" + hit.net + "-" + hit.area
									+ "-" + hit.cell,
							source : hit.source,
							// signal:hit.signal,
							message : '<strong>Provider: </strong>'
									+ hit.net
									+ ' ('
									+ hit.provider
									+ ')<br>'
									+ '<strong>Network: </strong>'
									+ hit.radio
									+ '<br>'
									+ '<strong>Source: </strong>'
									+ hit.source
									+ '<br>'
									+ '<strong>Date: </strong>'
									+ $filter('date')(hit.timestamp,
											'dd-MM-yyyy') + '<br>'
									+ '<strong>Azimuth: </strong>'
									+ hit.azimuth + '<br>'
									+ '<strong>Beam Width: </strong>'
									+ hit.beamwidth + '<br>'

						}
						switch (hit.net) {
						case 4:
							marker.icon = icons.vodafone;
							break;
						case 8:
							marker.icon = icons.kpn;
							break;
						case 16:
							marker.icon = icons.tmobile;
							break;
						default:
							marker.icon = icons.other;
						}
						markers[hit._id] = marker;
						centerOnMarker(marker);
					}

					$scope.paintCellMarker = function(hit) {

						if (!hit.location) {
							var params = {}

							params.uuid = hit.uuid;
							
							$http.defaults.useXDomain = true;

							$http.get(WEBSERVICE, {
								params : params
							}).error(function(error) {
								console.log(error);
							}).success(function(result) {

								result.forEach(function(res) {

									if (res.location) {
										createMarker(res);
									}
								})

							})
						} else {
							createMarker(hit);
						}
					}

					$scope.getCell = function() {

						getCell();
					}

					function lookupMNC(cell) {
						var params = {
							net : cell.net,
							mcc : cell.mcc
						}

						if (cache[mcc + "-" + mnc]) {
							cell.provider = cache[mcc + "-" + mnc];
						} else {
							$http
									.get(WEBSERVICE + '/provider', {
										params : params
									})
									.error(function(error) {
										console.log(error);
										cell.provider = 'unknown'
									})
									.success(
											function(result) {
												if (result.hits.hits[0] != undefined) {
													cell.provider = result.hits.hits[0]._source.brand
															+ ', '
															+ result.hits.hits[0]._source.name;
													cache[mcc + "-" + mnc] = cell.provider;
												} else {
													cell.provider = "-";
													cache[mcc + "-" + mnc] = cell.provider;
												}

											});
						}
					}

										
					function fillProviderCache() {
						$http
								.get(WEBSERVICE + '/provider', {})
								.error(function(error) {
									console.log(error);
								})
								.success(
										function(result) {
											if (result.hits.hits[0] != undefined) {
												result.hits.hits
														.forEach(function(
																provider) {
															console
																	.log(provider._id);
															cache[provider._id] = provider._source.brand
																	+ ', '
																	+ provider._source.name;
														})
											}
										});

					}

					fillProviderCache();

					$scope.addToMap = function(hit) {
						clearMap(false);

						if (hit) {
							if (hit.selected) {
								hit.selected = false;
							} else {
								$scope.cells.forEach(function(hit) {
									hit.selected = false;
								})
								hit.selected = true;
							}

							$scope.paintCellMarker(hit);
							$scope.paintCellCoverage(hit);

							var params = {};

							params.uuid = hit.uuid || hit.key

							$http.get(WEBSERVICE + '/details', {
								params : params
							}).error(function(err) {
								console.log(err);
							}).success(function(result) {

								$scope.details = result;

							});
						}
					}

					$scope.clearMarkers = function(includeGeohash) {
						clearMap(includeGeohash)
					}

					function clearMap(includeLocation) {
						if (includeLocation)
							$scope.geohash = null;

						$scope.cellgeohash = null;
						$scope.details = null;
						angular.forEach(markers, function(value, key) {
							delete markers[key];
						});
						$scope.cells.forEach(function(cell) {
							cell.selected = false;
						})
					}

					// $scope.exportCellsJSON=function(){

					// getExportData()
					// .then(function(data){
					// var ret=[];
					// data.data.forEach(function(res){
					// ret.push({mcc:res._id.mcc,mnc:res._id.mnc,lac:res._id.lac,cid:res._id.cid,signal:res.signal,network:res.network,lat:res.location[1],lon:res.location[0]});
					// });
					// var ret=JSON.stringify(ret);
					// var blob= new Blob([ret],{type:"application/json"});
					// var downloadLink=angular.element('<a></a>');
					// downloadLink.attr('href',window.URL.createObjectURL(blob));
					// downloadLink.attr('download','cells.json');
					// downloadLink[0].click();
					// },function(errorData){
					// console.log(errorData);
					// });

					// }

					// $scope.exportCellsCSV=function(){

					// var deferred=$q.defer();
					// getExportData()
					// .then(function(data){
					// console.log(data);
					// var ret=[]
					// data.data.forEach(function(res){

					// ret.push({mcc:res._id.mcc,mnc:res._id.mnc,lac:res._id.lac,cid:res._id.cid,signal:res.signal,network:res.network,lat:res.location[1],lon:res.location[0]});
					// // if(res.location){
					// // console.log(res);
					// // var
					// key=res._id.mcc.toString()+res._id.mnc.toString()+res._id.cid.toString()+res._id.lac.toString();
					// // res.key=key;
					// // var marker={
					// // lat:res.location[1],
					// // lng:res.location[0],
					// // draggable:false,
					// // label:res._id.mcc + "-" + res._id.mnc + "-" +
					// res._id.lac+ "-" + res._id.cid + " " + res.network,
					// // title:res._id.mcc + "-" + res._id.mnc + "-" +
					// res._id.lac+ "-" + res._id.cid + " " + res.network,
					// // signal:res.signal,
					// // message:'<strong>Cell-id: </strong>'+res._id.cid
					// +'<br>'+
					// // '<strong>Provider: </strong>'+res._id.mnc +' (' +
					// lookupMNC(res._id.mcc,res._id.mnc) +')<br>'+
					// // '<strong>Network: </strong>'+res.network +'<br>'+
					// // '<strong>Country: </strong>'+res._id.mcc +'<br>' +
					// // '<strong>Lac: </strong>'+res._id.lac +'<br>' +
					// // '<strong>Signal: </strong>'+res.signal +'<br>'
					// // }

					// // switch(res._id.mnc){
					// // case 4:
					// // marker.icon=icons.vodafone;
					// // break;
					// // case 8:
					// // marker.icon=icons.kpn;
					// // break;
					// // case 16:
					// // marker.icon=icons.tmobile;
					// // break;
					// // default:
					// // marker.icon=icons.other;

					// // }
					// // markers[key]=marker;
					// // }
					// });

					// deferred.resolve(ret);
					// },function(errorData){
					// deferred.reject(errorData);
					// });
					// return deferred.promise;

					// }
					// function getExportData(){
					// var params={};
					// params.sw=[$scope.bounds.southWest.lng,$scope.bounds.southWest.lat];
					// params.ne=[$scope.bounds.northEast.lng,$scope.bounds.northEast.lat];
					// params.center=$scope.center;

					// return $http.get('/api/exportcells',{
					// params:params
					// });

					// }

					// function removeFromMap(hit){
					// console.log(hit);
					// hit.marker=false;
					// //var
					// key=hit.network+hit.cid.toString()+hit.lac.toString()+hit.timestamp.toString();
					// var
					// key=hit.mcc.toString()+hit.mnc.toString()+hit.lac.toString()+hit.cid.toString();
					// var
					// markerKey=hit.mcc.toString()+hit.mnc.toString()+hit.cid.toString()+hit.lac.toString()+hit.timestamp.toString();
					// delete(markers[markerKey]);
					// delete(paths[markerKey]);
					// for(var i=0;i<$scope.clickedCells.length;i++){

					// $scope.clickedCells[i].key=$scope.clickedCells[i].mcc.toString()+$scope.clickedCells[i].mnc.toString()+$scope.clickedCells[i].lac.toString()+$scope.clickedCells[i].cid.toString();
					// if($scope.clickedCells[i].key==key){
					// $scope.clickedCells[i].marker=false;
					// }
					// }
					// for(var i=0;i<$scope.selectedCells.length;i++){
					// if($scope.selectedCells[i].key==markerKey){
					// $scope.selectedCells.splice(i,1);
					// }
					// }
					// var len=$scope.geojson.data.features.length;
					// while(len--){
					// if($scope.geojson.data.features[len].properties.cid===hit.cid
					// &&
					// $scope.geojson.data.features[len].properties.lac===hit.lac
					// &&
					// $scope.geojson.data.features[len].properties.mcc===hit.mcc
					// &&
					// $scope.geojson.data.features[len].properties.mnc===hit.mnc){
					// $scope.geojson.data.features.splice(len,1);
					// }
					// }

					// }

					// MAP STUFF

					angular.extend($scope, {

						defaults : {
							scrollWheelZoom : false
						},

						// tiles: MAPSERVER.tiles,

						controls : {
							fullscreen : {},
						},
						markers : markers,
						center : MAPSERVER.center,
						layers : {
							baselayers : {
								osm : MAPSERVER.osm,
								basic : MAPSERVER.mapbox_streets_basics,
								luchtfoto : MAPSERVER.luchtfoto
							},
						},
						bounds : $scope.bounds,
						events : {
						// map: {
						// enable: ['click'],
						// logic:'emit'
						// }
						}
					});

					$scope.$on('leafletDirectiveMap.baselayerchange', function(
							event, args) {
						if (args.leafletEvent.name === 'OSM' || args.leafletEvent.name === 'OpenStreetMap') {
							$scope.desaturate = true;
						} else {
							$scope.desaturate = false;
						}
						;
					});

					$scope.$on('leafletDirectiveMap.click', function(event,
							args) {

						var params = {
							lat : args.leafletEvent.latlng.lat,
							lng : args.leafletEvent.latlng.lng,
							geohashPrecision : 7,
							serving : true
						}
						$scope.cells = [];
						if ($scope.search.dt) {
							params.timestamp = new Date($scope.search.dt)
									.getTime();
						}
						if ($scope.search.range) {
							params.datePrecision = $scope.search.range;
						}
						clearMap(true);
						$http.get(WEBSERVICE + '/cells', {
							params : params
						}).error(function(err) {
							console.log(err);
						}).success(function(result) {
							angular.extend($scope, {
								geohash : {
									data : result,
									options : geoHashOptions()
								}
							})
							$scope.cells = result.results;
							var cache = [];
							$scope.cells.forEach(function(cell) {
								lookupMNC(cell);
							})
						})
					});

				});