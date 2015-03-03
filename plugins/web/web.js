module.exports = function(options, imports, register) {
    var web = {
        index: function(req, res) {
            res.render("guest");
        }
    };
    
    register(null, {
        "web": web
    })
}
