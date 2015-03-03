module.exports = function(options, imports, register) {
    var restify = require('restify');
    var server = restify.createServer();

    server.use(restify.fullResponse()).use(restify.bodyParser());

    /// CONTROLLERS ///

    var messages = imports.messages;

    /// ROUTES ///

    server.get("/test", messages.test); // Testing the api
    server.post("/messages/send", messages.send);


    var api = {
        launch: function() {
            /* Launch the api */
            server.listen(options.port, function (err) {
                if (err) console.error(err)
                console.log("API listening on port " + options.port);
            });
        }
    };

    register(null, {
        "api": api
    })
}
