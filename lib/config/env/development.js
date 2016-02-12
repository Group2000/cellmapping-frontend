'use strict';

module.exports = {
  env: 'development',
  mongo: {
    
    uri: 'mongodb://localhost/measurements-dev'
  },
  webserviceCels:{
    uri:'https://localhost:3001/v1/cellmeasurements-dev'
  },
  ElasticSearchConfig:{

    
	hosts:[
      'localhost:9200'
    ],
    Index:'cell_measurements_v1',
    Type:'measurement'
	}
};