module.exports = function(options, imports, register) {
    var messages = {
        test: function(req, res) {
            res.send("Hello");
        },
        send: function(req, res) {
            // TODO send Message
        }
    };

    register(null, {
        "messages": messages
    })
}
