var mainVm = new Vue({
	el: "#main",
	data:{
		msg:[],
	}
});

var socket = io();
socket.on('chat message', function(msg){
	main.msg.push(msg);
});
