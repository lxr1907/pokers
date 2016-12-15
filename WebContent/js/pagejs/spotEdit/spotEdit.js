//客栈列表
var spotList = [];
// 分页参数
var pageJson = {
	pageNum : 1,
	pageSize : 20,
	totalCount : 0
};
// 传入后台查询用户的参数
var postData = {
	state : "2",
	pageJson : JSON.stringify(pageJson),
	type : "inn_seller"
};
var openWin = {};
var editOrNew = "new";
openWin.state = false;
$(function() {
	//$.yuelj.checkPermission("operator");
	// 客栈窗体
	$('#win').window({
		height : 750,
		modal : false,
		title : "景点信息",
		resizable : false,
		onClose : function() {
			openWin = {};
			openWin.state = false;
		},
		onCollapse : function() {
			openWin = {};
			openWin.state = false;
		}
	});
	// 用户列表
	$('#dg').datagrid({
		loadMsg : '数据加载中,请稍后...',
		singleSelect : true,
		height : "100%",
		pagination : true,
		height : 750,
		columns : [ [ {
			field : 'id',
			title : '景点id',
			hidden : true
		}, {
			field : 'name',
			title : '景点名',
			width : 100
		}, {
			field : 'pic',
			title : '图片id',
			hidden : true
		}, {
			field : 'basicinfo',
			title : '景点描述',
			width : 200,
			align : 'center'
		}, {
			field : 'state',
			title : '状态',
			width : 50
		}, {
			field : 'bestmonth',
			title : '最适宜旅行月',
			width : 100,
			align : 'center'
		}, {
			field : 'rank',
			title : '排序',
			width : 70,
			align : 'center'
		}, {
			field : 'address',
			title : '地址',
			width : 150,
			align : 'center'
		}, {
			field : 'keyword',
			title : '关键词',
			width : 120,
			align : 'center'
		}, {
			field : 'price',
			title : '价格',
			width : 50
		}, {
			field : 'realprice',
			title : '折后价格',
			width : 70,
			align : 'center'
		}, {
			field : 'createuser',
			title : '创建人',
			width : 100,
			align : 'center'
		}, {
			field : 'createtime',
			title : '创建时间',
			width : 120,
			align : 'center'
		}, {
			field : 'jsoninfo',
			title : '其他信息',
			width : 80,
			align : 'left'
		} ] ],
		toolbar : [ {
			iconCls : 'icon-add',
			text : '新增景点',
			handler : function() {
				if (openWin.state) {
					return;
				}
				editOrNew = "new";
				openWin.state = true;
				$("#saveSpot").show();
				$('#win').window('open');
				
				$("#addinfo").show();
			}
		}, '-', {
			iconCls : 'icon-search',
			text : '查看景点',
			handler : function() {
				if (openWin.state) {
					return;
				}
				openWin.state = true;
				$("#saveSpot").hide();
				var row = $('#dg').datagrid("getSelected");
				if (row != null && row.id != null) {
					openWin.obj = row;
					loadWin();
				};
				$("#infoList").empty();
				$("#newInfoList").empty();
				var jsoninfo = JSON.parse($("#win input[name='jsoninfo']").val());
				for(var i in jsoninfo){
					$("#infoList").append(
						'<span  id="oldInfoNo'+ i +'">'
						+'<input type="hidden" name="info-id" value="'+jsoninfo[i].id+'">'
						+'<input placeholder="字段名，如：电话"  maxlength="12" type="text" name="info-txt" value="'+jsoninfo[i].txt+'">'
						+'<input placeholder="字段内容，如：0571-87950889"  maxlength="30" type="text" name="info-value" value="'+jsoninfo[i].value+'">'
						+'<a title="删除" href="#" onclick="removeInfo(\'old\',' + i + ');"></a></span>');
				};
				$("#addinfo").hide();
			}
		}, '-', {
			iconCls : 'icon-edit',
			text : '编辑景点',
			handler : function() {
				if (openWin.state) {
					return;
				}
				openWin.state = true;
				$("#saveSpot").show();
				var row = $('#dg').datagrid("getSelected");
				if (row != null && row.id != null) {
					editOrNew = "edit";
					openWin.obj = row;
					editSpot();
				};
				$("#infoList").empty();
				$("#newInfoList").empty();
				var jsoninfo = JSON.parse($("#win input[name='jsoninfo']").val());
				for(var i in jsoninfo){
					$("#infoList").append(
						'<span  id="oldInfoNo'+ i +'">'
						+'<input type="hidden" name="info-id" value="'+jsoninfo[i].id+'">'
						+'<input placeholder="字段名，如：电话"  maxlength="12" type="text" name="info-txt" value="'+jsoninfo[i].txt+'">'
						+'<input placeholder="字段内容，如：0571-87950889"  maxlength="30" type="text" name="info-value" value="'+jsoninfo[i].value+'">'
						+'<a title="删除" href="#" onclick="removeInfo(\'old\',' + i + ');"></a></span>');
				};
				$("#addinfo").show();
			}
		}, '-', {
			iconCls : 'icon-ok',
			text : '审核通过',
			handler : function() {
				if (openWin.state) {
					return;
				}
				//openWin.state = true;
				approveSpotClick(1);
			}
		}, '-', {
			iconCls : 'icon-clear',
			text : '下架景点',
			handler : function() {
				if (openWin.state) {
					return;
				}
				//openWin.state = true;
				approveSpotClick(2);
			}
		}, '-', {
			iconCls : 'icon-ok',
			text : '设为本月推荐',
			handler : function() {
				monthRecommend(0);
			}
		}, '-', {
			iconCls : 'icon-clear',
			text : '取消本月推荐',
			handler : function() {
				monthRecommend(999);
			}
		} ]
	});

	$('#win').window('close');
	initUpload();
	loadDataGrid();
	initPagination();
});
function initUpload() {
	$("#uploadify").uploadify({
		height : 30,
		swf : '/fdj/flash/uploadify.swf',
		uploader : '/fdj/uploadImg.action',
		width : 120,
		fileObjName : 'uploadify',
		queueID : 'fileQueue',// 与下面的id对应
		queueSizeLimit : 1,
		fileSizeLimit : '10000KB',
		fileTypeDesc : '图片',
		fileTypeExts : '*.gif; *.jpg; *.png',
		buttonText : '浏览',
		removeCompleted : true,
		removeTimeout : 0,
		multi : true,
		'onUploadSuccess' : uploadSuccess,
		onUploadStart : uploadStart
	});
	$("#uploadifyMore").uploadify({
		height : 30,
		swf : '/fdj/flash/uploadify.swf',
		uploader : '/fdj/uploadImg.action',
		width : 120,
		fileObjName : 'uploadify',
		queueID : 'some_file_queue',// 与下面的id对应
		queueSizeLimit : 30,
		fileSizeLimit : '10000KB',
		fileTypeDesc : '图片',
		fileTypeExts : '*.gif; *.jpg; *.png',
		buttonText : '上传更多图片',
		removeCompleted : true,
		multi : true,
		'onUploadSuccess' : uploadSuccessMore
	});
	// $("#uploadifyMore").hide();
}
function uploadSuccessMore(file, data, response) {
	var entityJson = {};
	entityJson.name = "";
	entityJson.type = "spot";
	entityJson.productid = openWin.obj["id"];
	entityJson.pic = eval("(" + data + ")").message;
	$.ajax({
		url : "/fdj/operator/insertPictureProduct.action",
		data : {
			entityJson : JSON.stringify(entityJson)
		},
		success : function(returnData) {
			if ($.yuelj.parseReturn(returnData)) {
				loadSpot();
			} else {
				$.yuelj.alertMessage('提示', "上传失败！");
			}
		}
	});

}
function delImgMoreClick(id) {
	$("#savedPic" + id).remove();
	$.ajax({
		url : "/fdj/operator/deletePictureProduct.action",
		data : {
			id : id
		},
		success : function(returnData) {
			if ($.yuelj.parseReturn(returnData)) {
			} else {
				$.yuelj.alertMessage('提示', "删除失败！");
			}
		}
	});
}
function uploadStart() {
	$("#uploadTxt").html("图片上传中......");
}
function uploadSuccess(file, data, response) {
	$("#uploadTxt").html("图片上传成功！");
	data = eval("(" + data + ")");
	if (data.state == 1) {
		$("#pic").val(data.message);
		$("#preViewImg").attr("src", $.yuelj.imageurlPre + data.message);
		$("#preViewImg").show();
	}
}
var from = 0;
var to = 0;
// 加载分页条
function initPagination() {
	$('#dg').datagrid("getPager").pagination(
			{
				total : pageJson.totalCount,
				pageSize : pageJson.pageSize,
				pageNumber : parseInt(pageJson.pageNum),
				onSelectPage : function(pageNum, pageSize) {
					$(this).pagination('loading');
					pageJson.pageSize = pageSize;
					pageJson.pageNum = pageNum;
					postData.pageJson = JSON.stringify(pageJson);
					loadDataGrid();
					$(this).pagination('loaded');
				},
				displayMsg : '当前显示' + from + "到" + to + '条记录   共'
						+ pageJson.totalCount + ' 条记录'
			});

}
// 加载用户列表
function loadDataGrid() {
	// 1有效，0无效，2审核中
	$.ajax({
		url : "/fdj/operator/spotList.action",
		data : postData,
		success : function(returnData) {
			if (returnData == null || returnData.list == null) {
				$.yuelj.alertMessage('提示', '获取失败!');
			} else {
				spotList = returnData.list;
				$('#dg').datagrid("loadData", {
					"rows" : returnData.list
				});
				if (returnData.list.length != 0) {
					$('#dg').datagrid("selectRow", 0);
				}
				pageJson.totalCount = returnData.page.totalCount;
				returnData.page.totalCount == 0 ? from = 0 : from = returnData.page.ifrom + 1;
				to = pageJson.pageSize * pageJson.pageNum;
				if (to > pageJson.totalCount) {
					to = pageJson.totalCount;
				}
				pageJson.pageSize = returnData.page.pageSize;
				pageJson.pageNum = returnData.page.pageNum;

				initPagination();
			}

		}
	});
}
// 加载客栈窗体
function loadWin() {
	loadSpot();
	$('#win').window('open');
}
function editSpot() {
	loadSpot();
	$('#win').window('open');
}
// 加载客栈数据
function loadSpot() {
	$('#win input').each(function() {
		var name = $(this).attr('id');
		if (name != null) {

			var value = openWin.obj[name];
			if (value != null && $("#" + name).textbox != null) {
				$("#" + name).textbox('setValue', value);
			}
		}
	});
	$('#basicinfo').val(openWin.obj["basicinfo"]);
	$("#uploadMoreDiv").html("");
	var entityJson = {};
	entityJson.type = "spot";
	entityJson.productid = openWin.obj.id;
	$
			.ajax({
				url : "/fdj/selectPictureProduct.action",
				data : {
					entityJson : JSON.stringify(entityJson)
				},
				success : function(returnData) {
					if (returnData != null && returnData.list != null) {
						var picList = returnData.list;
						for ( var i in picList) {
							var imgHtml = '<div  id=savedPic'
									+ picList[i].id
									+ '  style="float:left;text-align:center;margin:5px;"><img  alt="无法访问" src="'
									+ $.yuelj.imageurlPre
									+ picList[i].pic
									+ '_small"	style="width: 200px; height: 150px;" /></br><a href="#" onclick="delImgMoreClick('
									+ picList[i].id
									+ ')" class="easyui-linkbutton"'
									+ 'data-options="iconCls:\'icon-edit\'">删除</a></div>';
							$("#uploadMoreDiv").append(imgHtml);
						}
						$('.easyui-linkbutton').linkbutton({});
					}
				}
			});

	$("#preViewImg").attr("src",
			$.yuelj.imageurlPre + openWin.obj["pic"] + "_small");
}
// 审核客栈管理员用户
function approveSpotClick(state) {
	// 获取选中
	var row = $('#dg').datagrid('getSelected');
	var entityJson = {};
	if (row != null) {
		entityJson.id = row.id
		entityJson.state = state;
		$.ajax({
			url : "/fdj/operator/spot.action",
			data : {
				entityJson : JSON.stringify(entityJson)
			},
			success : function(returnData) {
				if ($.yuelj.parseReturn(returnData)) {
					$.yuelj.alertMessage('提示', "操作成功");
					loadDataGrid();
				}
			}
		});
	}
}
// 设为本月推荐，rank=0，取消本月推荐，rank=999
function monthRecommend(rank) {
	// 获取选中
	var row = $('#dg').datagrid('getSelected');
	var entityJson = {};
	if (row != null) {
		entityJson.id = row.id;
		entityJson.rank = rank;
		$.ajax({
			url : "/fdj/operator/spot.action",
			data : {
				entityJson : JSON.stringify(entityJson)
			},
			success : function(returnData) {
				if ($.yuelj.parseReturn(returnData)) {
					$.yuelj.alertMessage('提示', "操作成功");
					loadDataGrid();
				}
			}
		});
	}
}
/**
 * 保存景点信息
 */
var spotState = 2;
function saveSpotClick() {
	saveInfo();
	var entityJson = {};
	if (editOrNew == "new") {

	} else {
		// 获取选中
		var row = $('#dg').datagrid('getSelected');
		if (row != null) {
			entityJson.id = row.id;
			entityJson.state = spotState;
		}
	}

	$('#win input,#win textarea').each(function() {
		var name = $(this).attr('id');
		var value = $(this).val();
		if (name != null) {
			entityJson[name] = value;
			// entityJson[name] = $("#" + name).textbox('getValue');
		}
	});
	if (editOrNew == "new") {
		delete entityJson.id;
	}
	$.ajax({
		url : "/fdj/operator/spot.action",
		data : {
			entityJson : JSON.stringify(entityJson)
		},
		success : function(returnData) {
			if ($.yuelj.parseReturn(returnData)) {
				$.yuelj.alertMessage('提示', "操作成功");
				$('#win').window('close');
				loadDataGrid();
			}
		}
	});
}
// 查询按钮点击
function searchButtonClick() {
	pageJson = {
		pageNum : 1,
		pageSize : 20,
		totalCount : 0
	};
	postData.pageJson = JSON.stringify(pageJson);
	var state = $("#searchState").textbox('getValue');
	var spotName = $("#searchSpotName").textbox('getValue');
	if (state != null && state.length != 0) {
		postData.state = state;
	}
	if (spotName != null && spotName.length != 0) {
		postData.name = spotName;
	}
	loadDataGrid();
}

//新增其他信息
var i = 1;
function addInfo(){
	$("#newInfoList").append(
			'<span  id="newInfoNo'+ i +'">'
			+'<input type="hidden" name="info-id" value="info'+ i +'">'
			+'<input placeholder="字段名，如：电话"  maxlength="12" type="text" name="info-txt">'
			+'<input placeholder="字段内容，如：0571-87950889"  maxlength="30" type="text" name="info-value">'
			+'<a title="删除" href="javascript:void(0)" onclick="removeInfo(\'new\',' + i + ');"></a></span>');
	i++;
}
function removeInfo(type, j){
	if (type == "old") {
		$("#oldInfoNo" +j).remove();
	}else if(type == "new"){
		$("#newInfoNo" +j).remove();
	};
}
function saveInfo(){
	$("#jsoninfo").val("");
	$("#infoList span, #newInfoList span").each(function(){
		var jsoninfo = $("#jsoninfo").val();
		if(jsoninfo == ""){
			$("#jsoninfo").textbox('setValue','['
					+ '{"id":"'+ $(this).find("input[name='info-id']").val()
					+ '","txt":"' + $(this).find("input[name='info-txt']").val()
					+ '","value":"' + $(this).find("input[name='info-value']").val() + '"}]');
		}else
		$("#jsoninfo").textbox('setValue',jsoninfo.substring(0,jsoninfo.search("]")) 
				+ ',{"id":"'+ $(this).find("input[name='info-id']").val()
				+ '","txt":"' + $(this).find("input[name='info-txt']").val()
				+ '","value":"' + $(this).find("input[name='info-value']").val() + '"}]');
	})
}
