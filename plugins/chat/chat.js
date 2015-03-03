module.exports = function(options, imports, register) {
    /// IMPORTS ///
    var http = imports.http;
    var logger = imports.logger;

    var io = require('socket.io')(http); // TODO

    var chat = {
        launch: function() {
            io.on('connection', function(socket) {
                console.log('a user connected');
          

                socket.on('chat message', function(msg){
                    io.emit('chat message', msg);
                });

                socket.on('disconnect', function(){
                    console.log('user disconnected');
                });
      
            });
            console.log("Socket started");
        }
    };

    register(null, {
        "chat": chat
    })
}
