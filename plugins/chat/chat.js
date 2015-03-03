module.exports = function(options, imports, register) {
    /// IMPORTS ///
    var http = imports.http;
    var logger = imports.logger;

    var io = require('socket.io')(http); // TODO

    var chat = {
        launch: function() {
            /* Launch the chat */
            // TODO
        }
    };

    register(null, {
        "chat": chat
    })
}
