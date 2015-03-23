module.exports = function(options, imports, register) {
    var http = require('http');
    var app = imports.app;
    var server = {
        launch: function() {
            /* Launch the server */
            http.createServer(app).listen(options.port, function(err) {
                if (err) console.error(err)
                console.log("Server listening on port " + options.port);
            });
        }
    };

    register(null, {
        "server": server
    })
}
