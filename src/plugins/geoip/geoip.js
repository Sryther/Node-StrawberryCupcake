module.exports = function(options, imports, register) {
    var geoiplite = require('geoip-lite');

    register(null, {
        "geoip": geoiplite
    })
}
