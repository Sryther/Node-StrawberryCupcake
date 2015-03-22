module.exports = function(options, imports, register) {
    var mongoose = imports.db;
    var jwt = require('jsonwebtoken');

    var clientSchema = mongoose.Schema({
        "fullname" : String,
        "email": String,
        "clientname" : String,
        "password": String,
        "admin": Number
    });

    var Client = mongoose.model('Client', clientSchema);

    var clients = {
		me: function(req, res) {
			/**
			* req.user contains the informations on the connected client.
			* The server receives the token, jwt transform it in the user object
			**/
            res.send(req.user);
		},
        isAnonymous: function(req, res) {
            if (req.headers.authorization) {
                res.sendStatus(401);
                return;
            }
            res.sendStatus(200);
        },
        isAdmin: function(req, res) {
            if (!req.user) {
                res.sendStatus(401);
                return;
            }
            if (req.user.admin != 1) {
                res.sendStatus(403);
                return;
            }
            res.sendStatus(200);
        },
        isClient: function(req, res) {
            if (!req.user) {
                res.sendStatus(401);
                return;
            }
            res.sendStatus(200);
        },
		all: function(req, rs) {
			Client.find(function (err, clients) {
                if (err) return console.error(err);
                res.json(clients)
            });
		},
		get: function(req, res) {
			Client.findOne({ clientname: req.params.clientname }, function (err, client) {
				if (err) return console.error(err);
				res.json(client)
			});
		},
		save: function(req, res) {
			var newClient = new Client({
                fullname: req.body.fullname,
                email: req.body.email,
                clientname: req.body.clientname,
                password: req.body.password,
                admin: 0
            });
			newClient.save(function(err, client) {
				if (err) return console.error(err);
				res.json(client);
			});
		},
        login: function(req, res) {
            Client.findOne({
                clientname: req.body.clientname,
                password: req.body.password
            }, function(err, client) {
                if (err) {
                    res.sendStatus(404)
                    return console.error(err);
                }
                if (client == null) {
                    res.sendStatus(404);
                }
                // We are sending the profile inside the token
                var time = 0;
                if (req.body.rememberMe) time = 60 * 24 * 30;
                else time = 60 * 5;

                var saveToken = false;
                var profile = {
                    email: client.email,
                    clientname: client.clientname,
                    fullname: client.fullname,
                    admin: client.admin
                };

                /* Creates the token */
                var token = jwt.sign(profile, "SuperSecret", { expiresInMinutes: time });

                res.json({ token: token });
            });
        }
	};

    register(null, {
        "clients": clients
    })
}
