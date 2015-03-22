module.exports = function(options, imports, register) {
    var mongoose = imports.db;

    var userSchema = mongoose.Schema({
        "fullname" : String,
        "username" : String,
        "country" : String,
        "city": String,
        "geo": String,
        "last_seen" : Date,
        "session" : String,
        "client": String
    });

    var User = mongoose.model('User', userSchema);

    var users = {
        all: function(req, res) {
            User.find({client: req.user.clientname}, function (err, users) {
                if (err) return console.error(err);
                res.json(users)
            });
        },
        get: function(req, res) {
            User.findOne({ username: req.params.username, client: req.user.clientname }, function (err, user) {
                if (err) return console.error(err);
                res.json(user)
            });
        },
        getByToken: function(token, client) {
            User.findOne({ session: token, client: client }, function (err, user) {
                if (err) {
                    console.error(err)
                    return false;
                }
                return user;
            });
        },
        update: function(user) {
            User.update({session: user.session, client: user.clientname}, user, { upsert: true }, function(err, nbAffected) {
                if (err) return console.error(err);
                if (nbAffected > 0) return true;
                return false;
            });
        },
        model: User
    };

    register(null, {
        "users": users
    })
}
