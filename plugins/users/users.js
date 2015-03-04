module.exports = function(options, imports, register) {
    var mongoose = imports.db;

    var userSchema = mongoose.Schema({
        "fullname" : String,
        "username" : String,
        "country" : String,
        "city": String,
        "geo": String,
        "last_seen" : String,
        "session" : Number
    });

    var User = mongoose.model('User', userSchema);

    var users = {
        all: function(req, res) {
            User.find(function (err, users) {
                if (err) return console.error(err);
                res.json(users)
            });
        },
        get: function(req, res) {
            User.findOne({ username: req.params.username }, function (err, user) {
                if (err) return console.error(err);
                res.json(user)
            });
        }
    };

    register(null, {
        "users": users
    })
}
