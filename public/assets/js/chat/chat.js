var addMessage = function(from, msg) {
	$("#box").chatbox("option", "boxManager").addMsg(from, msg);
}

var broadcastMessageCallback = function(from, msg) {
	socket.emit('message', from + '#' + msg);
}

$(document).ready(function() {
	chatboxManager.init({
		messageSent : broadcastMessageCallback
	});

	chatboxManager.addBox("box",
		{
			dest:"dest",
			title:"box",
			first_name:"You",
			last_name:""
		}
	);
});

socket.on('welcome', function(msg) {
	var message = msg.split('#');
	addMessage(message[0], message[1]);
});
socket.on('message', function(msg) {
	var message = msg.split('#');
	addMessage(message[0], message[1]);
});
