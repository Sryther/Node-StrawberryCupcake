module.exports = function(options, imports, register) {
    var logger = {
        save: function(message) {
            // TODO
        }
    };

    register(null, {
        "logger": logger
    })
}
