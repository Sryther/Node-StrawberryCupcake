module.exports = function(options, imports, register) {
    var express = require('express');
    var app = express();
    var morgan = require('morgan');
    var bodyParser = require('body-parser');
    var methodOverride = require('method-override');
    var swig = require('swig');
    var cookieParser = require('cookie-parser');

    /// IMPORTS ///
    var web = imports.web;
    var users = imports.users;
    var conversations = imports.conversations;

    /// CONFIGURATION ///
    app.use(express["static"](options.rootFolder + '/public')); // TODO
    app.use(morgan('dev')); // Log every request to the console
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(function (req, res, next) {
        console.log(req.body);
        next();
    });
    app.use(methodOverride());

    app.engine('html', swig.renderFile);
    app.set('views', options.rootFolder + '/views');
    app.set('view engine', 'html');
    app.set('view cache', false); // True in production
    swig.setDefaults({ cache: false });

    /// ROUTES ///

    app.get("/", web.index); // Home
    app.get("/chat/:id", web.chat); // Remove in production


    app.get("/dashboard", web.backend);


    /// API ///
    app.get("/api/users", users.all);
    app.get("/api/users/:username", users.get);

    app.get("/api/conversations", conversations.all);
    app.get("/api/conversations/:session", conversations.get);

    register(null, {
        "app": app
    })
}
