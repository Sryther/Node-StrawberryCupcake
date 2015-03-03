module.exports = function(options, imports, register) {
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
