module.exports = function(options, imports, register) {
	var db = imports.db;
	var users = imports.users;
	var tracker = imports.tracker;

	var check = function(token) {
		var user = tracker.getUser(token);
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
		create: function(ip, callback) {
			do {
				var token = random();
			} while(check(token) == false);

			// Track user
			var location = tracker.getLocalisation(ip);

			if (location == null) {
				location = {
					city: "unknown",
					country: "unknown",
					ll: [
						"0",
						"0"
					]
				}
			}

			var newU = new users.model({
				fullname : "n/a",
				username : (token + "").substring(0, 6),
				country: location.country,
				city: location.city,
				geo: location.ll[0] + ',' + location.ll[1],
				last_seen : Date.now(),
				session: token
			});

			newU.save(function(err, newT) {
				callback(err, newU.session);
			});
		}
	}
    register(null, {
        "spoutine": spoutine
    })
}
