module.exports = function(options, imports, register) {
    var mongoose = imports.db;

    var conversationSchema = mongoose.Schema({
        "username_client" : String,
        "sender": String,
		"message": String,
        "datetime" : Date,
		"end": Boolean,
        "session": String
    });

    var Conversation = mongoose.model('Conversation', conversationSchema);

    var conversations = {
        all: function(req, res) {
			Conversation.aggregate(
                [
                    { "$sort": { "datetime": -1 } },
                    { "$group": {
                        "_id": "session",
                        "session": { "$first": "$session" },
                        "sender": { "$first": "$sender" },
                        "message": { "$first": "$message" },
                        "end": { "$first": "$end" },
                        "datetime": { "$first": "$datetime" },
                        "username_client": { "$first": "$username_client" }
                    }}
                ]
            ).exec(function (err, conversations) {
                if (err) return console.error(err);
                res.json(conversations);
            });
        },
        get: function(req, res) {
			Conversation.find({ session: req.params.session }, null, {sort: {datetime: 1}}, function (err, conversation) {
                if (err) return console.error(err);
                res.json(conversation);
            });
        },
        save: function(obj) {
            var conversation = new Conversation(obj);
            conversation.save(function(err, conversation) {
				return conversation;
			});
        }
    };

    register(null, {
        "conversations": conversations
    })
}
