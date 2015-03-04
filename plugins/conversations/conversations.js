module.exports = function(options, imports, register) {
    var mongoose = imports.db;

    var conversationSchema = mongoose.Schema({
        "username_client" : String,
        "username_team" : String,
		"message": String,
        "datetime" : Date,
		"end": Boolean
    });

    var Conversation = mongoose.model('Conversation', conversationSchema);

    var conversations = {
        all: function(req, res) {
			Conversation.find(function (err, conversations) {
                if (err) return console.error(err);
                res.json(users);
            });
        },
        get: function(req, res) {
			Conversation.find({ username_client: req.params.username }, null, {sort: {datetime: 1}}, function (err, conversation) {
                if (err) return console.error(err);
                res.json(conversation);
            });
        }
    };

    register(null, {
        "conversations": conversations
    })
}
