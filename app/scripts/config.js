"use strict";

angular.module('config', [])

var ip = 'SERVERIP'

.constant('ENV', 'production')

.constant('WEBSERVICE', 'http://' + ip + ':3001/v1/cellmeasurements-dev')

.constant('WEBSERVICEWIFI', 'http://' + ip + ':3002/v1/wifimeasurements-dev')

.constant('MAXS2LEVEL', 16)

.constant('MAPSERVER', {mapbox_streets_basics:{url:'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',type:'xyz',name:'Mapbox Streets Basic',options:{tms:false,maxZoom:22,opacity:1}},osm:{url:'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',type:'xyz',name:'OpenStreetMap',options:{tms:false,maxZoom:22,opacity:1}},luchtfoto:{url:'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',type:'xyz',name:'Black',options:{tms:false,maxZoom:20,opacity:0.9}},center:{lat:52.373750,lng:6.647809,zoom:10},osmCache:{url:'http://'+ ip +'/tiles.php?z={z}&x={x}&y={y}&r=mapnik',type:'xyz',name:'OpenStreetMap cache',options:{tms:false,maxZoom:22,opacity:1}}})
;
