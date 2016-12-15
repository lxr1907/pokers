/**
 * Created by xll on 2016/10/30.
 */
var websocket = null;
//var wsip = "127.0.0.1:8080/lxrtexas/ws/texas";
var wsip = "120.26.217.116:8080/texas/ws/texas";
// 发送消息映射
var mapping = {
	// 注册
	regist : 0,
	// 登陆
	login : 1,
	// 进入房间
	enterRoom : 2,
	// 退出房间
	exitRoom : 3,
	// 坐下
	sitDown : 4,
	// 站起
	standUp : 5,
	// 过牌
	check : 6,
	// 下注
	betChips : 7,
	// 弃牌
	fold : 8,
	//
	getRankList : 9,
	//看牌
	lookCards: 10,
	//比牌
	compareCards: 11
};
function wsInit() {
	var url="ws://" + wsip;
	if ('WebSocket' in window) {
		websocket = new WebSocket(url);
	} else if ('MozWebSocket' in window) {
		websocket = new MozWebSocket(url);
	}
	bindWsFunction(websocket);
}
function wsReOpen() {
	// if (websocket.readState != 1) {
	// websocket = new WebSocket("ws:/" + wsip );
	// }
	// bindWsFunction(websocket);
}
function bindWsFunction(ws) {
	ws.onerror = function(event) {
		onError(event);
	};
	ws.onopen = function(event) {
		onOpen(event);
	};
	ws.onmessage = function(event) {
		onMessage(event);
	};
	ws.onclose = function(event) {
		onClose(event);
	};
}
/**
 * 接收服务器消息
 */
function onMessage(event) {
	if (event.data != null) {
		var dataJson = JSON.parse(event.data);
		var func = eval(dataJson.c);
		new func(null, dataJson);
		console.log(dataJson.c + " is call by server!");
	}
}
/**
 * 建立连接
 */
function onOpen(event) {
	//document.getElementById('messages').innerHTML = 'Connection established';
}
function onError(event) {
	console.log(event.data);
	window.location.reload();
	alert(event.data);
}
function onClose(event) {
	//document.getElementById('messages').innerHTML = 'Connection onCloseed';
	window.location.reload();
	wsReOpen();
}

// 发送消息
function sendMessage() {
	var data = {};
	data.c = mapping.sendMessage;
	websocket.send(JSON.stringify(data));
}
// 错误消息返回
function onException(e, data) {
	console.log(data.message);
	alert(data.message);
}
function logErrorMessage(txt){
	//document.getElementById('messages').innerHTML =txt;
	console.log(txt);
}