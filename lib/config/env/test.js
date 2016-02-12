'use strict';

module.exports = {
  env: 'test',
  mongo: {
    uri: 'mongodb://localhost/measurements-test'
  },
  ElasticSearchConfig:{
		hosts:[
			'localhost:9200'
		],

    	Index:'cells',
    	Type:'cell'
	}
};