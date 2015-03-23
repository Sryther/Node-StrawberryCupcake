/*
* This sript use jquery and jquery.ui.chatbox.js made by Wen Pu
* You can find it here : http://www.cs.illinois.edu/homes/wenpu1/chatbox.html
* You can use the library you wan but you need to adapt this script to your use
*/
$(document).ready(function() {
	$.ajax({
		type: "POST",
		url: "http://127.0.0.1:8000/chat/hello",
		data: {
			client: client
		},
		success: function(data) {
			// Emit message function
			var broadcastMessageCallback = function(from, msg) {
				// The format message is Name#MyMessage
				// ex: "Guest#Hello I'm a guest :)"
				socket.emit('message', from + '#' + msg);
			}

			// Add the message to the chatbox
			var addMessage = function(from, msg) {
				$("#box").chatbox("option", "boxManager").addMsg(from, msg);
			}

			// Sets the token and the clientname
			var token = data.token;
			var socket = io(":1338/chat/" + client + "/" + token);

			// Chatbox configuration
			chatboxManager.init({
				messageSent : broadcastMessageCallback
			});

			chatboxManager.addBox("box", {
				dest: "dest",
				title: "box",
				first_name: "Guest", // DO NOT USE "Team" AS NAME HERE!!
				last_name: "_" + token // Use the token here is not a mandatory
			});

			// Handle message reception
			socket.on('message', function(msg) {
				var message = msg.split('#');
				addMessage(message[0], message[1]);
			});
		}
	});
});
