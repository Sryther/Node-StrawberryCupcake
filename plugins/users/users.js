module.exports = function(options, imports, register) {
    var mongoose = imports.db;

    var userSchema = mongoose.Schema({
        "fullname" : String,
        "username" : String,
        "locale" : String,
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
            User.find({ username: req.params.username }, function (err, user) {
                if (err) return console.error(err);
                res.json(user)
            });
        }
    };

    register(null, {
        "users": users
    })
}
