module.exports = function(options, imports, register) {
    var web = {
        index: function(req, res) {
            res.render("guest");
        },
        dashboard: function(req, res) {
            res.render("dashboard");
        }
    };

    register(null, {
        "web": web
    })
}
