'use strict';

module.exports = {
  env: 'production',
  ip:   process.env.OPENSHIFT_NODEJS_IP ||
        process.env.IP ||
        '0.0.0.0',
  port: process.env.OPENSHIFT_NODEJS_PORT ||
        process.env.PORT ||
        8080,
  mongo: {
    uri: 'mongodb://localhost/measurements'
  },
   webserviceCels:{
    uri:'https://localhost:3001/v1/cellmeasurements'
  },
  ElasticSearchConfig:{
    hosts:[
      'localhost:9200'
    ],
    Index:'cell_measurements_v1',
    Type:'measurement'
  }
};