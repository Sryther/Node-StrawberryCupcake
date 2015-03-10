module.exports = function(options, imports, register) {
    var chat = imports.chat;
    var randomizerSpoutine = imports.spoutine;
    var web = {
        index: function(req, res) {
            res.append('Set-Cookie', 'id=');
            res.render("guest");
        },
        backend: function(req, res) {
            res.render("backend");
        },
        chat: function(req, res) {
            var id = req.params.id;
            chat.launch(id);
            res.render("chat", {id: id});
        }
    };

    register(null, {
        "web": web
    })
}
