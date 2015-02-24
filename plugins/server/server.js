module.exports = function(options, imports, register) {
    var http = require('http');
    var server = {
        launch: function() {
            /* Launch the server */
            http.createServer().listen(options.port, function() {
                console.log("Server listening on port 8000");
            });
        }
    };


    server.launch();

    register(null, {
        "server": server
    })
}
