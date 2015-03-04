module.exports = function(options, imports, register) {
    var geoiplite = require('geoip-lite');

    var geoip = {
        lookup: function(ip) {
            var geo = geoiplite.lookup(ip);
            geo = {
                city: geo.city,
                country: geo.country,
                coords: geo.ll[0] + ',' + geo.ll[1]
            }
            return geo;
        }
    }

    register(null, {
        "geoip": geoip
    })
}
