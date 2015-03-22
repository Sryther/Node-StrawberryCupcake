module.exports = function(options, imports, register) {
	var db = imports.db;
	var geoip = imports.geoip;
	var users = imports.users;

	var locate = function(ip) {
		var geo = geoip.lookup(ip);

		if (geo == null) {
			geo = {
				city: "unknown",
				country: "unknown",
				ll: [
					"0",
					"0"
				]
			}
		}

		return geo;
	}

	var user = function(token, client) {
		return users.getByToken(token, client);
	}

    var tracker = {
		getLocalisation: locate,
		getUser: user,
	}

    register(null, {
        "tracker": tracker
    })
}
