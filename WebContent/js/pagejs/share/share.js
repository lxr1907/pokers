$(function(){
//传入的id参数
var actionId;

//$(".content").hide();
$("#inn-info").hide();
$("#spot-info").hide();
$("#travel-info").hide();

if(!getUrlParam('type') || !getUrlParam('id')){
	document.write('参数错误！');
}else{
	actionId = getUrlParam('id');
	switch(getUrlParam('type')){
		case "1":
			initPage(actionId);
			break;
		case "2":
			initSpotPage(actionId);
			break;
		case "3":
			initTravelPage(actionId);
			break;
		defualt:
			break;
	}
}
})

//获取url中的参数
function getUrlParam(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	var r = window.location.search.substr(1).match(reg); //匹配目标参数
	if (r != null) return unescape(r[2]);
	return null; //返回参数值
}

function initPage(actionId){
	//设施列表初始化
	initFaci();

	//客栈信息初始化
	initInn(actionId);

	//房型信息初始化
	initRoomType(actionId);

}

//设施列表
var innFaci;
var roomFaci;
var initFaciOK = false;

function initFaci(){
	innFaci = [];
	roomFaci = [];
	$.ajax({
		url : "/yuelijiang/selectInnFacility.action",		
		success : function(returnData) {
			for (var i in returnData.list){
				if(returnData.list[i].type == "inn"){
					var faci = {};
					faci.name = returnData.list[i].name;
					faci.id = returnData.list[i].id;
					innFaci.push(faci);
				}
				else if(returnData.list[i].type == "room"){
					var faci = {};
					faci.name = returnData.list[i].name;
					faci.id = returnData.list[i].id;
					roomFaci.push(faci);
				}
			};
			initFaciOK = true; //设施列表初始化状态码，完成
		}
	});
}

function initInn(actionId){
	var reqdata = {
      innid: actionId
    };
  $.ajax({
    url: "/yuelijiang/selectInnInfoExt.action",
    data: {
      entityJson: JSON.stringify(reqdata)
    },
    success: function(returnData) {
	  	if(returnData.list.length>0){
	  		var data = returnData.list[0];
	  		//客栈信息
	  		$('#pic').attr("src","http://yueljimg.oss-cn-hangzhou.aliyuncs.com/"+data.pic);
	  		$('#name').text(data.name);

	  		//掌柜信息
	  		if ((data.bossInfo)) {
	  			$('#boss-pic').attr("src","http://yueljimg.oss-cn-hangzhou.aliyuncs.com/"+data.bossInfo.pic);
		  		$('#boss-name').text(data.bossInfo.name);
		  		$('#boss-description').text(data.bossInfo.description);
	  		};
	  		
	  		$('#star').text(data.star);
	  		$('#commentcount').text(data.commentcount);
	  		$('#location').text(data.location);
	  		$('#phone').text(data.phone);
	  		$('#phone').attr("href","tel:"+data.phone);
	  		$('#description').text(data.description);

	  		//客栈设施
	  		var facilities = [];
        if(data.facilities.length >0){
        	facilities = data.facilities.split(",");
        };
        var faciStr = "";
        for(var i in facilities){
        	for(var j in innFaci){
        		if(innFaci[j].id == facilities[i]){
        		faciStr += '<div class="facilities" id="faci_'+innFaci[j].id+'">'+innFaci[j].name+'</div>';}
        	}
        }
	  		$('#facilities').append(faciStr);
	  		$('#facilities .facilities').each(function(){
	  			$(this).css({"background":"url(/yuelijiang/icons/share/"+$(this).attr("id")+".png)",
	  				"background-size":"0.24rem 0.24rem","background-repeat":"no-repeat"});
	  		});

	  	}
    }
  })
}

function initRoomType(actionId){
	var reqdata = {
      innid: actionId
    };
  $.ajax({
    url: "/yuelijiang/selectInnRoomExtWeb.action",
    data: {
      entityJson: JSON.stringify(reqdata)
    },
    success: function(returnData) {
	  	if(returnData.list.length>0){
	  		var data;
	  		returnData.list.splice(3,returnData.list.length);
	  		data = returnData.list;
	  		$('#roomtype').empty();

	  		for(var i in data){
	  			
	  			var str;
	  			str = '<li class="roomlist" id="roomtype_'+data[i].id+'">'
							+'<img src="http://yueljimg.oss-cn-hangzhou.aliyuncs.com/'+data[i].roomext.pic+'" alt="房型封面">'
							+'<span class="room-title">'+data[i].name+'</span>'
							+'<ul class="faci">'
							+'	<li>楼层：<span>'+data[i].roomext.floor+'</span>层</li>'
							+'	<li>面积：<span>'+data[i].roomext.roomarea+'</span>m²</li>'
							+'	<li>床型：<span>'+(data[i].roomext.bedcount=="1"?"大床":(data[i].roomext.bedcount=="2" ? 
								"双床位" : "多床位"))
							+'</span><span>'+parseInt(data[i].roomext.bedwidth)/100+'</span>m</li>'
							+'	<li>宽带：<span name="roomFaci_25">免费</span></li>'
							+'	<li>WiFi：<span name="roomFaci_26">有</span></li>'
							+'	<li>窗门：<span name="roomFaci_27">有</span></li>'
							+'</ul>'
							+'<div class="clear"></div></li>';
					$('#roomtype').append(str);
	  		}
	  		//加载结束，显示页面
	  		$("#inn-info").show();
	  	}
    }
  })
}

function initSpotPage(actionId){

	// 传入后台查询用户的参数
	var postData = {
		sid : actionId
	};
	// 1有效，0无效，2审核中
	$.ajax({
		url : "/yuelijiang/spotById.action",
		data : postData,
		success : function(returnData) {
			if (returnData == null || returnData.address == null) {
				document.write('未查询到景点数据！');
			} else {
				var spotList = returnData;
				$("#spot-pic").attr("src","http://yueljimg.oss-cn-hangzhou.aliyuncs.com/"+spotList.pic);
				$("#spot-name").text(spotList.name);
				$("#spot-star").text(spotList.star);
				$("#spot-commentcount").text(spotList.commentcount);
				$("#spot-basicinfo").text(spotList.basicinfo);

				var jsoninfo = JSON.parse(spotList.jsoninfo);
				for(var i in jsoninfo){
					$("#spot-infolist").append(
						'<li><p>'+jsoninfo[i].txt+':&nbsp;&nbsp;'+jsoninfo[i].value+'</p></li>');
				};

				//加载结束，显示页面
	  		$("#spot-info").show();

			}

		}
	});
}

function initTravelPage(actionId){
	// 传入后台查询用户的参数
	var postData = {
		tid : actionId
	};
	// 1有效，0无效，2审核中
	$.ajax({
		url : "/yuelijiang/travelById.action",
		data : postData,
		success : function(returnData) {
			if (returnData == null || returnData.address == null) {
				document.write('未查询到游记数据！');
			} else {
				
			}

		}
	});
}