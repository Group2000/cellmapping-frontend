// //wifimeasurement.js
// //Mongoose Schema for celllogger wifi measurements
// 'use strict';
// var db=require('../config/mongodb');
// var mongoose = require('mongoose'),
//     Schema = mongoose.Schema;
    

// var WifiSchema = new Schema({
// 	device: {type:String, required:true,trim:true},
// 	timestamp: {type:Date, required:true},
// 	location:{type:[Number],index:'2dsphere'},

// 	wifiToken:{type:String},
// 	type:{type:String},
// 	encryption:{type:Boolean, default:false},
// 	encryptiontype:{type:String},
// 	encryptionmode:{type:String},
// 	bssid:{type:String},
// 	ssid:{type:String},
// 	signal:{type:Number},
// 	channel:{type:Number},
// 	frequency:{type:Number}

// });
// WifiSchema.index({timestamp:1,device:1,location:1,ssid:1,signal:1},{unique:true});


// module.exports=mongoose.model('Wifi', WifiSchema);
