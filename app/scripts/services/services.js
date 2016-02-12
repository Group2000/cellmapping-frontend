//services.js
'use strict';
/* jshint indent: false */

angular.module('celllogger')
.service('AlertService',function(){

	 this.alerts=[];

	this.setAlert=function(newAlert, clear){
		if(clear===true){
			this.resetAlerts();
		}
		this.alerts.push(newAlert);
		// console.log(newAlert);
	};
	
	this.getAlerts=function(){
		return this.alerts;
	};
	this.resetAlerts=function(){
		//loop through alerts and see if they need to persist
		var newAlerts=[];
		for(var i = 0; i<this.alerts.length; i++) {
			if(this.alerts[i].persist){
				this.alerts[i].persist=false;
				newAlerts.push(this.alerts[i]);
			}
		}
		this.alerts=newAlerts;
	};
})





