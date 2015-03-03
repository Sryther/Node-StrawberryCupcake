module.exports = function(options, imports, register) {
    var http = require('http');

    register(null, {
        "http": http
    })
}
