//elasticsearch.js
'use strict';
var elasticsearch=require("elasticsearch");
var config = require('./config');


var  esClient = new elasticsearch.Client({
	hosts:config.ElasticSearchConfig.hosts
});

var indexName=config.ElasticSearchConfig.index;
function checkEsServer(esClient){
	esClient.ping({
		requestTimeout:1000,
		hello:"es Check"
	}).then(function(response){
		console.log("Connected to Elasticsearch cluster");
		exports.esClient = esClient;
	},function(error){
		console.log("ES cluster down");
		exports.esClient = null;
		esClient=null;
	});
}



exports.indexName=indexName;
exports.elasticsearch = elasticsearch;
exports.esClient = esClient;
//checkEsServer(esClient);
