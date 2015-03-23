module.exports = function(options, imports, register) {
	var db = imports.db;
	var users = imports.users;
	var tracker = imports.tracker;

	var check = function(token, client) {
		var user = tracker.getUser(token, client);
		if (user) return false;
		return true;
	}

	var random = function() {
		return Math.floor(Math.random() * 42424242424242 + 1);
	}

    var spoutine = {
		// Check in DB if the token already exists
		check: check,
		// Return a random number between 1 and 42424242424242
		random: random,
		create: function(token, client, callback) {
            if (token === undefined) {
				do {
					token = random();
				} while(check(token, client) == false);
			}
			callback(token);
		}
	}
    register(null, {
        "spoutine": spoutine
    })
}
