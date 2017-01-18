var headerVm = new Vue({
	el: "#header",
	data: setting,
});

var mainVm = new Vue({
	el: "#main",
	data:{
		msg:[],
		userlist:[],
		emojiList:[],
		emojiListShow:false,
	},
	methods:{
		send:function (event) {
			if($("#sendText").val().search(/^\/\w+/img) == -1){
				socket.emit('message',$("#sendText").val());
				var msgPack = {
					msg:$("#sendText").val(),
					self:true,
					username:setting.username,
				}
				this.msg.push(msgPack);
			}else{// such as '/roll'
				socket.emit('console',$("#sendText").val().slice(1));
			}
			$("#sendText").val("");
		},
		emojiInsert:function(category,name){
			$("#sendText")[0].value += "!:" + category + "/" + name + ":!";
			$("#sendText").focus();
		},
		emojiListTrigger:function(){
			if(!this.emojiListShow){
				this.emojiListShow = true;
			}else{
				this.emojiListShow = false;
			}
		},
	},
	watch:{
		emojiList:function(){
			setTimeout(function(){
				$(".emojiList .nav-tabs a:first").tab('show');
			});
		},
		msg:function(){
			setTimeout(function(){
				var reg = /!:[\w\/]+:!/img;
				$(".messageText").each(function(){
					if($(this).html().match(reg)!=-1){
						var inner = $(this).html().replace(reg,function(str){
							var _src= 'img/'+str.slice(2,-2)+'.png';
							return "<img class='emoji' src='"+_src+"'/>";
						});
						$(this).html(inner);
					}
				});
			});
		},
	}
});

function emojiInit () {
	$.ajax({
		type:'post',
		url:setting.emojiUrl,
		async: true,
		success:function(data){
			if(data!=undefined){
				mainVm.emojiList = data;
			}
		}
	})
}
emojiInit();

socket:{
	var socket = io(setting.socketUrl);
	socket.on('message', function(msgPack){
		mainVm.msg.push(msgPack);
	});
	socket.on('console',function(msgPack){
		msgPack.isConsole = true;
		mainVm.msg.push(msgPack);
	})
	socket.on('userList', function(userlist){
		userlist = JSON.parse(userlist);
		console.log(userlist);
		mainVm.userlist = userlist;
	});
}

function loginCheck () {
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
}
loginCheck();

emojiList_close:{
	$("body").bind('click',function(){
		if($(this).parents(".inputWindow").length == 0){
			mainVm.emojiListShow = false;
		}
	});
	$(".inputWindow").click(function(){
		return false;
	});
}