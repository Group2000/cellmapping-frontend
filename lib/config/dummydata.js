'use strict';

var mongoose = require('mongoose'),
  esClient = require('./elasticsearchclient').esClient,
  esIndex=require('./elasticsearchclient').indexName;
 