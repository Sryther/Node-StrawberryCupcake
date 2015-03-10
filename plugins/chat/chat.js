module.exports = function(options, imports, register) {
    /// IMPORTS ///
    var io = require('socket.io')(8080);

    var ids = [];

    var chat = {
        launch: function(id) {
            if (ids[id] == null) {
                var nbUsersConnected = 0;
                ids[id] = io.of('/chat/'+id);
                ids[id].use(function(socket, next) {
                    if(socket.request.headers.cookie) return next();
                    next(new Error("Authentication failed"));
                });

                ids[id].on('connection', function(socket) {
                    nbUsersConnected++;
                    console.info('A new user is connected in chat n°'+id);
                    ids[id].emit('message', "A new user entered the chat");

                    socket.on('chat message', function(msg) {
                        console.log(msg, id);
                        ids[id].emit('message', msg);
                    });
                    socket.on('disconnect', function(){
                        nbUsersConnected--;
                        console.info('A user just disconnected');
                        // Destroy the socket if no user connected to it
                        if (nbUsersConnected == 0) {
                            socket.leave('/chat/'+id);
                            console.log("Socket for chat n°" + id + " destroyed");
                        }
                    });
                });
                console.log("Socket for chat n°" + id + " started");
            } else {
                console.log("Socket for chat n°" + id + " already started");
            }
        }
    };

    register(null, {
        "chat": chat
    })
}
