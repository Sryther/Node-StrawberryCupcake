module.exports = function(options, imports, register) {
    var http = imports.http;
    var app = imports.app;
    var server = {
        launch: function() {
            /* Launch the server */
            http.createServer(app).listen(options.port, function() {
                console.log("Server listening on port " + options.port);
            });
        }
    };

    register(null, {
        "server": server
    })
}
