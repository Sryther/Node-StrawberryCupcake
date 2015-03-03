module.exports = function(options, imports, register) {

    var db = require('mongoose');
    
	db.connect('mongodb://localhost/StrawberryCupcake');
	console.log('db Started');

    register(null, {
        "db": db
    })
}
