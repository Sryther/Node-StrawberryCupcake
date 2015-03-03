module.exports = function(options, imports, register) {

    var mongoose = require('mongoose');

	mongoose.connect('mongodb://localhost/StrawberryCupcake');
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
	console.log('db Started');

    db.once('open', function (callback) {
        register(null, {
            "db": mongoose
        })
    });
}
