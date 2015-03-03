var architect = require('./architect');

var config = [
    {
        packagePath: "./plugins/http"
    },
    {
        packagePath: "./plugins/web"
    },
    {
        packagePath: "./plugins/app",
        rootFolder: __dirname
    },
    {
        packagePath: "./plugins/logger"
    },
    {
        packagePath: "./plugins/server",
        port: 8000
    },
    {
        packagePath: "./plugins/chat",
        port: 8080
    }
];

// Create relative tree
var tree = architect.resolveConfig(config, __dirname);

// Starting the app
architect.createApp(tree, function(err, app) {
    if (err) console.log(err);
    var services = app.services;
    var server = services.server;
    var chat = services.chat;

    chat.launch();
    server.launch();
});
