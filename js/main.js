var mainVm = new Vue({
	el: "#main",
	data:{
		msg:[],
	},
	methods:{
		send:function () {
			socket.emit('message',$("#sendText").val());
			var msgPack = {
				msg:$("#sendText").val(),
				self:true
			}
			this.msg.push(msgPack);
		}
	}
});

var socket = io(setting.socketUrl);
socket.on('message', function(msgPack){
	msgPack.self = false;
	mainVm.msg.push(msgPack);
});

$.ajax({
	type:'post',
	url:setting.tokenUrl,
	async:true,
	success:function(data){
		setting.userID = data.uid;//这边在传token的时候也顺手吧uid传过来吧  省事
		socket.emit('signIn',data.token);
	}
});