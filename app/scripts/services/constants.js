//services.js
'use strict';
/* jshint indent: false */

angular.module('celllogger')
.service('Constants',function(){
	var categories={};
	categories.focus={
		glyphicon:'fa-binoculars',
		icon:{
	 		type:'awesomeMarker',
	 		prefix: 'fa',
	 		icon: 'binoculars',
	 		markerColor:'green'
	 	}
	};
	categories.broad={
		glyphicon:'fa-fire',
		icon:{
	 		type:'awesomeMarker',
	 		prefix: 'fa',
	 		icon: 'fire',
	 		markerColor:'orange'
	 	}
	};
	categories.anpr={
		glyphicon:'fa-camera',
		icon:{
	 		type:'awesomeMarker',
	 		prefix: 'fa',
	 		icon: 'camera',
	 		markerColor:'orange'
	 	}
	};
	categories.c2000={
		glyphicon:'fa-microphone',
		icon:{
	 		type:'awesomeMarker',
	 		prefix: 'fa',
	 		icon: 'microphone',
	 		markerColor:'blue'
	 	}
	};
	categories.cosmos={
		glyphicon:"fa-phone",
		icon:{
	 		type:'awesomeMarker',
	 		prefix: 'fa',
	 		icon: 'phone',
	 		markerColor:'red'
	 	}
	};
	categories.vuurvogel={
		glyphicon:"fa-mobile",
		icon:{
	 		type:'awesomeMarker',
	 		prefix: 'fa',
	 		icon: 'mobile',
	 		markerColor:'red'
	 	}
	};
	categories.qelectronics={
		glyphicon:"fa-car",
		icon:{
	 		type:'awesomeMarker',
	 		prefix: 'fa',
	 		icon: 'car',
	 		markerColor:'red'
	 	}
	};
	categories.iridium={
		glyphicon:"fa-phone",
		icon:{
	 		type:'awesomeMarker',
	 		prefix: 'fa',
	 		icon: 'phone',
	 		markerColor:'red'
	 	}
	};
	categories.itaps={
		glyphicon:"fa-globe",
		icon:{
	 		type:'awesomeMarker',
	 		prefix: 'fa',
	 		icon: 'globe',
	 		markerColor:'red'
	 	}
	};
	categories.itaps_http={
		glyphicon:"fa-globe",
		icon:{
	 		type:'awesomeMarker',
	 		icon: 'globe',
	 		prefix: 'fa',
	 		markerColor:'red'
	 	}
	};
	categories.level={
		glyphicon:'fa-road',
		icon:{
	 		type:'awesomeMarker',
	 		prefix: 'fa',
	 		icon: 'road',
	 		markerColor:'blue',
	 	}
	};
	categories.noq={
		glyphicon:"fa-plane",
		icon:{
	 		type:'awesomeMarker',
	 		prefix: 'fa',
	 		icon: 'plane',
	 		markerColor:'orange'
	 	}
	};
	categories.Reliant_cri={
		glyphicon:"fa-phone",
		icon:{
	 		type:'awesomeMarker',
	 		prefix: 'fa',
	 		icon: 'phone',
	 		markerColor:'red'
	 	}
	 };
	categories.reliant=categories.Reliant_cri;
	categories.reliant_cri=categories.Reliant_cri;
	categories.ttaps={
		glyphicon:"fa-phone",
		icon:{
	 		type:'awesomeMarker',
	 		prefix: 'fa',
	 		icon: 'phone',
	 		markerColor:'red'
	 	}
	};
	categories.tvg={
		glyphicon:"fa-phone-square",
		icon:{
	 		type:'awesomeMarker',
	 		prefix: 'fa',
	 		icon: 'phone-square',
	 		markerColor:'red'
	 	}
	};
	categories.wifi={
		glyphicon:"fa-wifi",
		icon:{
	 		type:'awesomeMarker',
	 		prefix: 'fa',
	 		icon: 'wifi',
	 		markerColor:'red'
	 	}
	};
	categories.wwts={
		glyphicon:"fa-car",
		icon:{
	 		type:'awesomeMarker',
	 		prefix: 'fa',
	 		icon: 'car',
	 		markerColor:'red'
	 	}
	};
	categories.default={
		glyphicon:'da-diamond',
		icon:{
	 		type:'awesomeMarker',
	 		prefix: 'fa',
	 		icon: 'diamond',
	 		markerColor:'red'
	 	}
	}

	var _directions={
		'N':[337.5,22.5],
		'NE':[22.5,67.5],
		'E':[67.5,112.5],
		'SE':[112.5,157.5],
		'S':[157.5,202.5],
		'SW':[202.5,247.5],
		'W':[247.5,292.5],
		'NW':[292.5,337.5]
	}



	this.categories=function(){
		return categories;
	}
	this.directions=function(){
		return _directions;
	}
	this.getDirection=function(heading){
		var direction='None';
		heading=parseInt(heading);
		angular.forEach(_directions,function(value,key){
			if(heading<22.5)
				direction='N';
			if(heading>=value[0] && heading<=value[1])
				direction=key;
		})
		return direction;
	};

});