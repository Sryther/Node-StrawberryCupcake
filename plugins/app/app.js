module.exports = function(options, imports, register) {
    var express = require('express');
    var app = express();
    var jwt = require('jsonwebtoken');
    var expressJwt = require('express-jwt');
    var morgan = require('morgan');
    var bodyParser = require('body-parser');
    var methodOverride = require('method-override');
    var swig = require('swig');
    var cookieParser = require('cookie-parser');

    /// IMPORTS ///
    var web = imports.web;
    var users = imports.users;
    var clients = imports.clients;
    var conversations = imports.conversations;
    var chat = imports.chat;

    /// CONFIGURATION ///
    app.use('/api', expressJwt({secret: "SuperSecret"}));
    app.use(express["static"](options.rootFolder + '/public'));
    app.use(morgan('dev')); // Log every request to the console
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
    app.use(methodOverride());
    app.use(cookieParser());

    app.use(function (req, res, next) {
        console.log(req.body);
        next();
    });

    app.engine('html', swig.renderFile);
    app.set('views', options.rootFolder + '/views');
    app.set('view engine', 'html');
    app.set('view cache', false); // True in production
    swig.setDefaults({ cache: false });

    /// ROUTES ///

    app.get("/", web.index); // Home


    app.get("/dashboard", web.backend);


    /// API ///
    app.get("/api/users", users.all);
    app.get("/api/users/:username", users.get);

    app.post("/chat/hello", chat.launch);

    app.get("/api/clients/me", clients.me);
    app.get("/isAnonymous", clients.isAnonymous);
    app.get("/api/isClient", clients.isClient);
    app.get("/api/isAdmin", clients.isAdmin);
    app.post("/register", clients.save);
    app.post("/login", clients.login);

    app.get("/api/conversations", conversations.all);
    app.get("/api/conversations/:session", conversations.get);

    register(null, {
        "app": app
    })
}
