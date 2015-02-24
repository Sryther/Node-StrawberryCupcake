var architect = require('./architect');

var config = [
    {
        packagePath: "./plugins/server",
        port: 8000
    }
];

// Create relative tree
var tree = architect.resolveConfig(config, __dirname);

// Starting the app
architect.createApp(tree, function() {
    console.log("Application started");
});
