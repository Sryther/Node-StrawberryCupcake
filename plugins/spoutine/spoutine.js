module.exports = function(options, imports, register) {
	var db = imports.db;

	var tokenSchema = db.Schema({
        "token" : String
    });

	var check = function(token) {
		Token.findOne({ token: token }, function (err, token) {
			if (err) return console.error(err);
			if (token == null) return true; // Can use this token
			return false; // Can not use this token
		});
	}

	var random = function() {
		return Math.floor(Math.random() * 42424242424242 + 1);
	}

    var Token = db.model('Token', tokenSchema);
    var spoutine = {
		// Check in DB if the token already exists
		check: check,
		// Return a random number between 1 and 42424242424242
		random: random,
		create: function(callback) {
			do {
				var token = random();
			} while(check(token) == false);
			var newT = new Token({token: token});
			newT.save(function(err, newT) {
				callback(err, newT.token);
			});
		}
	}
    register(null, {
        "spoutine": spoutine
    })
}
