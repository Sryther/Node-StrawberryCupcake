module.exports = function(options, imports, register) {
    var express = require('express');
    var app = express();
    var morgan = require('morgan');
    var bodyParser = require('body-parser');
    var methodOverride = require('method-override');
    var swig = require('swig');

    /// IMPORTS ///
    var web = imports.web;

    /// CONFIGURATION ///
    app.use(express["static"](options.rootFolder + '/public')); // TODO
    app.use(morgan('dev')); // Log every request to the console
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
    app.use(function (req, res, next) {
        console.log(req.body);
        next();
    });
    app.use(methodOverride());

    app.engine('html', swig.renderFile);
    app.set('views', options.rootFolder + '/views');
    app.set('view engine', 'html');
    app.set('view cache', false);
    swig.setDefaults({ cache: false });
    app.set('view engine', 'html');

    /// ROUTES ///

    app.get("/", web.index); // Home


    app.get("/dashboard", web.dashboard);

    register(null, {
        "app": app
    })
}
