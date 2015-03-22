module.exports = function(options, imports, register) {
    var mongoose = imports.db;

    var conversationSchema = mongoose.Schema({
        "username_client" : String,
        "sender": String,
		"message": String,
        "datetime" : Date,
		"end": Boolean,
        "session": String,
        "client": String
    });

    var Conversation = mongoose.model('Conversation', conversationSchema);

    var conversations = {
        all: function(req, res) {
			Conversation.aggregate(
                [
                    {
                        "$match": {
                            "client": req.user.clientname
                        }
                    },
                    {
                        "$sort": {
                            "datetime": -1
                        }
                    },
                    {
                        "$group": {
                            "_id": { "session" : "$session" },
                            "session": {
                                "$first": "$session"
                            },
                            "sender": {
                                "$first": "$sender"
                            },
                            "client": {
                                "$first": "$client"
                            },
                            "message": {
                                "$first": "$message"
                            },
                            "end": {
                                "$first": "$end"
                            },
                            "datetime": {
                                "$first": "$datetime"
                            },
                            "username_client": {
                                "$first": "$username_client"
                            }
                        }
                    }
                ],
                function (err, conversations) {
                    if (err) return console.error(err);
                    console.log(conversations)
                    res.json(conversations);
                }
            );
        },
        get: function(req, res) {
			Conversation.find({ session: req.params.session, client: req.user.clientname }, null, {sort: {datetime: 1}}, function (err, conversation) {
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
