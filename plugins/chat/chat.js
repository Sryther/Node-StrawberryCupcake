module.exports = function(options, imports, register) {
    /// IMPORTS ///
    var conversations = imports.conversations;
    var tracker = imports.tracker;
    var users = imports.users;
    var spoutine = imports.spoutine;

    var io = require('socket.io')(1338);

    var ids = [];

    var chat = {
        launch: function(req, res) {
            var token = req.cookies.token;
            var client = req.body.client;
            spoutine.create(token, client, function(id) {
                if (ids[id] == null) {
                    var nbUsersConnected = 0;
                    ids[id] = io.of('/chat/' + client + '/' + id);
                    ids[id].use(function(socket, next) {
                        if(socket.request.headers.cookie) return next();
                        next(new Error("Authentication failed"));
                    });

                    ids[id].on('connection', function(socket) {
                        nbUsersConnected++;

                        console.info('A new user is connected in chat n°'+id);

                        socket.on('message', function(msg) {
                            // Save
                            var arr = msg.split("#");
                            var conv = {
                                "username_client" : (id + "").substring(0, 6),
                                "sender": arr[0],
                        		"message": arr[1],
                                "datetime" : Date.now(),
                        		"end": false,
                                "session": id,
                                "client": client
                            }
                            conversations.save(conv);

                            if(arr[0] != "Team") {
                                var geo = tracker.getLocalisation(req.connection.remoteAddress);
                        		var user = {
                        			fullname : "n/a",
                        			username : (id + "").substring(0, 6),
                        			country: geo.country,
                        			city: geo.city,
                        			geo: geo.ll[0] + ',' + geo.ll[1],
                        			last_seen : Date.now(),
                        			session: id,
                        			client: client
                        		};
                                users.update(user);
                            }

                            ids[id].emit('message', msg);
                        });
                        socket.on('disconnect', function(){
                            nbUsersConnected--;
                            console.info('System#A user just disconnected');
                            // Destroy the socket if no user connected to it
                            if (nbUsersConnected == 0) {
                                socket.leave('/chat/' + client + '/' + id);
                                console.log("Socket for chat n°" + id + " destroyed");
                            }
                        });
                    });
                    console.log("Socket for chat n°" + id + " started");
                } else {
                    console.log("Socket for chat n°" + id + " already started");
                }
                res.append('Set-Cookie', 'token='+id);
                res.send({token: id});
                res.sendStatus(200);
            });
        }
    };

    register(null, {
        "chat": chat
    })
}
