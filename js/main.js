var headerVm = new Vue({
	el: "#header",
	data: setting,
});

var mainVm = new Vue({
	el: "#main",
	data:{
		msg:[],
		userlist:[],
	},
	methods:{
		send:function (event) {
			socket.emit('message',$("#sendText").val());
			var msgPack = {
				msg:$("#sendText").val(),
				self:true,
				username:setting.username,
			}
			this.msg.push(msgPack);
			event.target.value = "";
			console.log(event.target);
		}
	}
});

var socket = io(setting.socketUrl);
socket.on('message', function(msgPack){
	msgPack.self = false;
	mainVm.msg.push(msgPack);
});
socket.on('userList', function(userlist){
//	for(var i in userlist){
//		userlist[i] = JSON.parse(userlist[i]);
//	}
	mainVm.userlist = userlist;
	console.log(userlist);
});


$.ajax({
	type:'post',
	url:setting.tokenUrl,
	async:true,
	success:function(data){
		if(data.error == undefined){
			setting.userID = data.uid;//这边在传token的时候也顺手吧uid传过来吧  省事
			setting.username = data.username;
			socket.emit('signIn',data.token);			
		}else if (data.error == 100){
			location.href = "../users/login";
		}else{
			location.href = "../users/login";			
		}
	},
	error:function(){
		location.href = "../users/login";
	}
});