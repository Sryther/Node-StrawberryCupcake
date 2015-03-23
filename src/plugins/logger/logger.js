module.exports = function(options, imports, register) {
    var logger = {
        log: function(message) {
            // TODO
        }
    };

    register(null, {
        "logger": logger
    })
}
