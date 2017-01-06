var mainVm = new Vue({
	el: "#main",
	data:{
		msg:[],
	},
	methods:{
		send:function () {
			socket.emit('chat message',$("#sendText").val());
		}
	}
});

var socket = io(setting.socketUrl);
socket.on('chat message', function(msg){
	mainVm.msg.push(msg);
});

var headerVm = new Vue({
	el: "header",
	data:{

	},
	methods:{
		loginCallout:function(){

		}
	}
});

