var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/measurements-test');
// mongoose.connection.db.dropDatabase();
// console.log('Dropped test db');
// mongoose.connection.close(function(){
// 	mongoose.connect('mongodb://localhost/measurements-dev');
// 	mongoose.connection.db.dropDatabase();
// 	console.log('Dropped dev db');
// 	mongoose.connection.close();	
// });
