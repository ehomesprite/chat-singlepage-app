var mainVm = new Vue({
	el: "#main",
	data:{
		msg:[],
	},
	methods:{
		send:function () {
			socket.emit('chat message',$("#sendText").val());
			//console.log($("#sendText").val());
		}
	}
});

var socket = io('http://45.76.149.222:3000/');
socket.on('chat message', function(msg){
	mainVm.msg.push(msg);
	//console.log(typeof msg);
});
