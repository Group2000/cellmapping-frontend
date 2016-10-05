"use strict";

angular.module('config', [])

.constant('ENV', 'production')

.constant('WEBSERVICE', 'https://192.168.202.201:3001/v1/cellmeasurements-dev')

.constant('WEBSERVICEWIFI', 'https://192.168.202.201:3002/v1/wifimeasurements-dev')

.constant('MAXS2LEVEL', 16)

.constant('MAPSERVER', {mapbox_streets_basics:{url:'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',type:'xyz',name:'Mapbox Streets Basic',options:{tms:false,maxZoom:22,opacity:1}},osm:{url:'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',type:'xyz',name:'OpenStreetMap',options:{tms:false,maxZoom:22,opacity:1}},luchtfoto:{url:'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',type:'xyz',name:'Satellite photo',options:{tms:false,maxZoom:20,opacity:0.9}},center:{lat:52.373750,lng:6.647809,zoom:10}})
;
