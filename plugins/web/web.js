module.exports = function(options, imports, register) {
    var chat = imports.chat;
    var randomizerSpoutine = imports.spoutine;
    var web = {
        index: function(req, res) {
            var token = req.cookies.token;
            if (token === undefined) {
                randomizerSpoutine.create(req.connection.remoteAddress, function(err, token) {
                    if (err) console.error(err);
                    token = token;
                    res.append('Set-Cookie', 'token='+token);
                    chat.launch(token);
                    res.render("guest", {token: token});
                });
            } else {
                chat.launch(token);
                res.render("guest", {token: token});
            }
        },
        backend: function(req, res) {
            res.render("backend");
        },
        chat: function(req, res) {
            var id = req.params.id;
            res.render("chat", {id: id});
        }
    };

    register(null, {
        "web": web
    })
}
