module.exports = function(options, imports, register) {
	var db = imports.db;
	var geoip = imports.geoip;
	var users = imports.users;

	var locate = function(ip) {
		var geo = geoip.lookup(ip);
		return geo;
	}

	var user = function(token) {
		return users.getByToken(token);
	}

    var tracker = {
		getLocalisation: locate,
		getUser: user
	}

    register(null, {
        "tracker": tracker
    })
}
