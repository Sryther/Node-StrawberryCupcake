var architect = require('./architect');

var config = [
    {
        packagePath: "./plugins/geoip"
    },
    {
        packagePath: "./plugins/tracker"
    },
    {
        packagePath: "./plugins/spoutine"
    },
    {
        packagePath: "./plugins/web"
    },
    {
        packagePath: "./plugins/users"
    },
    {
        packagePath: "./plugins/clients"
    },
    {
        packagePath: "./plugins/conversations"
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
        packagePath: "./plugins/chat"
    },
    {
        packagePath: "./plugins/db"
    }
];

// Create relative tree
var tree = architect.resolveConfig(config, __dirname);

// Starting the app
architect.createApp(tree, function(err, app) {
    if (err) console.log(err);
    var services = app.services;
    var server = services.server;
    var db = services.db;
    server.launch();
});
