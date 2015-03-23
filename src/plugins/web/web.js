module.exports = function(options, imports, register) {
    var chat = imports.chat;
    var randomizerSpoutine = imports.spoutine;
    var web = {
        index: function(req, res) {
            res.render("guest");
        },
        backend: function(req, res) {
            res.render("backend");
        }
    };

    register(null, {
        "web": web
    })
}
