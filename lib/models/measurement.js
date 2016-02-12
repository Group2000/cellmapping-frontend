// //measurement.js
// //Mongoose Schema for celllogger measurements
// 'use strict';
// var db=require('../config/mongodb');
// var mongoose = require('mongoose'),
//     Schema = mongoose.Schema;
    

// var MeasurementSchema = new Schema({
// 	device: {type:String, required:true,trim:true},

// 	timestamp: {type:Date, required:true},
// 	location:{type:[Number],index:'2dsphere'},
// 	cellToken:{type:String},
// 	cellToken14:{type:String},
// 	geohash:{type:String},
// 	serving:{type:Boolean, default:true},
// 	network: {type:String, required:true, uppercase:true},
// 	mcc: {type:Number, required:true},
// 	mnc: {type:Number, required:true},
// 	lac: {type:Number},
// 	rnc: {type:Number},
// 	cid: {type:Number, required:true},
// 	bsic:{type:Number},
// 	arfcn:{type:Number},
// 	signal:{type:Number},
// 	psc:{type:Number}
// });
// MeasurementSchema.index({timestamp:1,device:1,location:1,lac:1,mcc:1,mnc:1,cid:1,arfcn:1,signal:1},{unique:true});
// MeasurementSchema.index({mcc:1});
// MeasurementSchema.index({mnc:1});
// MeasurementSchema.index({cid:1,lac:1,mnc:1,mcc:1});


// mongoose.model('Measurement', MeasurementSchema);
