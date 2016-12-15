//客栈列表
var travelList = [];
//当前选中行 序号
var currentRow;
//当前选中行 游记id值
var currentRowId;
// 分页参数
var pageJson = {
	pageNum : 1,
	pageSize : 20,
	totalCount : 0
};

var openWin = {};
openWin.state = false;
openWin.addTravel = false;

$(function() {
	$.yuelj.checkPermission("operator");
	// 游记窗体
	$('#win').window({
		width:400,
		height : 700,
		modal : false,
		title : "游记信息",
		resizable : true,
		onClose : function() {
			openWin = {};
			openWin.state = false;
			openWin.addTravel = false;
		},
		onCollapse : function() {
			openWin = {};
			openWin.state = false;
		}
	});
	//游记详情窗体
	$("#detail-win").window({
		width : 600,
		height : 800,
		modal : false,
		title : "游记详情",
		resizable : true,
		onClose : function() {
			
		},
		onCollapse : function() {
			
		}
	});
	//百度地图
	var map;
	baiduMap();
	
	// 游记列表
	$('#dg').datagrid({
		loadMsg : '数据加载中,请稍后...',
		singleSelect : true,
		height : "100%",
		pagination : true,
		height : 750,
		columns : [ [ {
			field : 'id',
			title : '游记id',
			hidden : true
		}, {
			field : 'title',
			title : '游记名称',
			width : 200,
			align : 'left'
		}, {
			field : 'pic',
			title : '图片id',
			width : 60,
			align : 'center'
		}, {
			field : 'content',
			title : '推荐词',
			width : 600,
			align : 'left'
		}, {
			field : 'time',
			title : '展示时间',
			width : 90,
			align : 'center'
		}, {
			field : 'state',
			title : '状态',
			width : 30,
			align : 'center'
		}, {
			field : 'price',
			title : '价格',
			width : 60,
			align : 'center'
		}, {
			field : 'actualprice',
			title : '折后价格',
			width : 60,
			align : 'center'
		}, {
			field : 'bestmonth',
			title : '最适宜旅行月',
			width : 100,
			align : 'right'
		}, {
			field : 'createuser',
			title : '创建人',
			width : 100,
			align : 'center'
		}, {
			field : 'createtime',
			title : '创建时间',
			width : 150,
			align : 'center'
		}, {
			field : 'rank',
			title : '排序',
			width : 40,
			align : 'center'
		}, {
			field : 'address',
			title : '地址',
			width : 100,
			align : 'right'
		},{
			field : 'keyword',
			title : '关键词',
			width : 140,
			align : 'right'
		}, {
			field : 'views',
			title : '浏览数',
			width : 50,
			align : 'center'
		}, {
			field : 'type',
			title : '类型',
			width : 30,
			align : 'center'
		} ] ],
		toolbar : [ {
			iconCls : 'icon-add',
			text : '新增游记',
			handler : function() {
				if (openWin.state) {
					return;
				}
				openWin.state = true;
				openWin.addTravel = true;
				clearTravelWin();
				clearDetailWin();
				$("#saveTravel").show();
				$(".detail-edit").show();
				$('#win').window('open');
				$('#searchState').combobox('setValue','2');
				$('#searchState').combobox('getText','审核中');
				searchButtonClick();
			}
		}, '-', {
			iconCls : 'icon-search',
			text : '查看游记',
			handler : function() {
				if (openWin.state) {
					return;
				}
				openWin.state = true;
				$("#saveTravel").hide();
				var row = $('#dg').datagrid("getSelected");
				if (row != null && row.id != null) {
					openWin.obj = row;
					loadWin(row.id);
				}
				$(".detail-edit").hide();
			}
		}, '-', {
			iconCls : 'icon-edit',
			text : '编辑游记',
			handler : function() {
				$("#saveTravel").show();
				openWin.addTravel = false;
				var row = $('#dg').datagrid("getSelected");
				if (row != null && row.id != null) {
					openWin.obj = row;
					currentRowId = row.id;
					editTravel();
				}
				$(".detail-edit").show();
			}
		}, '-', {
			iconCls : 'icon-ok',
			text : '审核通过',
			handler : function() {
				if (openWin.state) {
					return;
				}
				approveTravelClick(1);
			}
		}, '-', {
			iconCls : 'icon-clear',
			text : '审核不通过',
			handler : function() {
				if (openWin.state) {
					return;
				}
				approveTravelClick(3);
			}
		} , '-', {
			iconCls : 'icon-remove',
			text : '删除',
			handler : function() {
				if (openWin.state) {
					return;
				}
				approveTravelClick(0);
			}
		} ]
	});

	$('#win').window('close');
	$('#detail-win').window('close');
	initUpload();
	loadDataGrid();
	initPagination();
});
function initUpload() {
	$("#uploadify").uploadify({
		height : 30,
		swf : '/yuelijiang/flash/uploadify.swf',
		uploader : '/yuelijiang/uploadImg.action',
		width : 120,
		fileObjName : 'uploadify',
		queueID : 'fileQueue',// 与下面的id对应
		queueSizeLimit : 1,
		fileSizeLimit : '10000KB',
		fileTypeDesc : '图片',
		fileTypeExts : '*.gif; *.jpg; *.png',
		buttonText : '上传游记封面',
		removeCompleted : true,
		removeTimeout : 0,
		multi : true,
		'onUploadSuccess' : uploadSuccess,
		onUploadStart : uploadStart
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
					
					loadDataGrid();
					$(this).pagination('loaded');
				},
				displayMsg : '当前显示' + from + "到" + to + '条记录   共'
						+ pageJson.totalCount + ' 条记录'
			});

}
// 加载游记列表
function loadDataGrid(data) {
	var entityJson = {};
	if(data != null){entityJson = data;};
	
	entityJson.state = $("#searchState").combobox("getValue");
	
	// 1有效，0无效，2审核中
	$.ajax({
		url : "/yuelijiang/operator/travelList.action",
		data : {
			entityJson : JSON.stringify(entityJson),
			pageJson : JSON.stringify(pageJson)
		},
		success : function(returnData) {
			if (returnData == null || returnData.list == null) {
				$.yuelj.alertMessage('提示', '获取失败!');
			} else {
				travelList = returnData.list;
				$('#dg').datagrid("loadData", {
					"rows" : returnData.list
				});
				console.info("数据已经重新加载！");
				currentRow = 0;
				var findRow = false;
				if (returnData.list.length != 0) {
					var rows = $("#dg").datagrid("getRows");
					for(var i=0;i<rows.length;i++){
						if(rows[i].id == currentRowId){
							currentRow = i;
							findRow = true;
						}
					};
					if(!findRow){console.error("无法获取当前选中行...")}
					else{console.info("当前选中行的序号为："+currentRow)};
					$('#dg').datagrid("selectRow", currentRow);
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
// 加载游记窗体
function loadWin() {
	loadTravel();
	$('#win').window('open');
}
function editTravel() {
	loadTravel();
	$('#win').window('open');
}
// 加载游记主信息
function loadTravel() {
	$('#win input').each(function() {
		var name = $(this).attr('id');
		if (name != null) {

			var value = openWin.obj[name];
			if (value != null && $("#" + name).textbox != null) {
				$("#" + name).textbox('setValue', value);
			}
		}
	});
	
	$("#detailSavedDiv").html("");
	var entityJson = {};
	entityJson.type = "travel";
	entityJson.productid = openWin.obj.id;
	var detailList = openWin.obj.detailList;
	for ( var i in detailList) {
		var row = detailList[i];
		if(detailList[i].state === "1"){
			addDetailDiv(row);
		}
	}
	$("#preViewImg").attr("src",
			$.yuelj.imageurlPre + openWin.obj["pic"] + "_small");
}
// 审核游记
function approveTravelClick(state) {
	// 获取选中
	var row = $('#dg').datagrid('getSelected');
	var entityJson = {};
	if (row != null) {
		entityJson.id = row.id;
		entityJson.state = state;
		$.ajax({
			url : "/yuelijiang/operator/travel.action",
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
 * 保存游记主表信息
 */
//默认上传需要审核
var travelState = 2;
function saveTravelClick() {
	$("#saveTravelResult").html("保存中......");
	// 获取选中
	var row = $('#dg').datagrid('getSelected');
	var entityJson = {};
	if (row != null) {
		entityJson.id = row.id;
		entityJson.state = travelState;
	}
	$('#win input').each(function() {
		var name = $(this).attr('id');
		var value = $(this).val();
		if (name != null && value.length != 0) {
			entityJson[name] = value;
		}
	});
	
	//若是新增,去掉id字段
	//若是更新,去掉state字段
	if(openWin.addTravel){
		delete entityJson.id;
	}else{
		delete entityJson.state;
	};
	
	for(var i in entityJson){
		if(entityJson[i] == ""){
			delete entityJson[i];
		}
	}
	entityJson.type = 1;// 操作员编辑上传
	$.ajax({
		url : "/yuelijiang/operator/travel.action",
		data : {
			entityJson : JSON.stringify(entityJson)
		},
		success : function(returnData) {
			if ($.yuelj.parseReturn(returnData)) {
				$("#saveTravelResult").html("保存成功！");
				openWin.addTravel = false;
				loadDataGrid();
			}
		}
	});
}
function getDataGridRow() {
	return $('#dg').datagrid('getSelected');
}
// 查询按钮点击
function searchButtonClick() {
	//初始化分页
	pageJson = {
			pageNum : 1,
			pageSize : 20,
			totalCount : 0
	};
	
	//传入后台的参数
	var postData = {};
	var state = $("#searchState").textbox('getValue');
	var travelName = $("#searchTravelName").textbox('getValue');
	if (state != null && state.length != 0) {
		postData.state = state;
	}
	if (travelName != null && travelName.length != 0) {
		postData.title = travelName;
	}
	
	loadDataGrid(postData);
}

/**
 * 游记详情编辑
 */
/**
 * 保存游记明细信息
 */
function saveTravelDetailClick() {
	// var ueContent = UE.getEditor('editor').getContent();
	// 获取选中
	var row = getDataGridRow();
	var entityJson = {};
	var detailRow = {};
	if (row != null) {
		// 主表id
		detailRow.tid = row.id;
		detailRow.state = 1;
		detailRow.type = $('#detailType').combobox('getValue');
		detailRow.destinationid = $('#destinationid').combobox('getValue');
		detailRow.name = $('#destinationid').combobox('getText');
		detailRow.lon = $('#lon').val();
		detailRow.lat = $('#lat').val();
		if (detailRow.name == null
				|| detailRow.name.length == 0) {
			$.yuelj.alertMessage("错误", "目的地不能为空！");
			return;
		}
		detailRow.time = $('#detailtime').datetimebox('getValue');
		detailRow.text = $('#detailtext').val();
		detailRow.pic = $('#picDetail').val();
		if (detailRow.rank == null || detailRow.rank.length == 0) {
			detailRow.rank = 1;
		}
	}
	
	if($("#detail-id").val() !== ""){
		detailRow.id = $("#detail-id").val();
	}
	for(var i in detailRow){
		if(detailRow[i] == "" || detailRow[i] == "undefined"){
			delete detailRow[i];
		}
	}
	
	if(detailRow.destinationid == detailRow.name){
		delete detailRow.destinationid;
		detailRow.type= '3' ;
	}
	$.ajax({
		url : "/yuelijiang/operator/travelDetail.action",
		data : {
			entityJson : JSON.stringify(detailRow)
		},
		success : function(returnData) {
			if ($.yuelj.parseReturn(returnData)) {
				//$.yuelj.alertMessage("成功", "操作成功！");
				if(returnData.id != ""){
					detailRow.id = returnData.id;
				};
				addDetailDiv(detailRow);
				loadDataGrid();
				$('#detail-win').window('close');
			}
		}
	});
}

function newDetail(){
	//清空游记详情窗口
	clearDetailWin();
	$('#detail-win').window('open');
}

function delDetailClick(id) {
	var entityJson = {};
	entityJson.id = id;
	entityJson.state = 0;
	$.ajax({
		url : "/yuelijiang/operator/travelDetail.action",
		data : {
			entityJson : JSON.stringify(entityJson)
		},
		success : function(returnData) {
			if ($.yuelj.parseReturn(returnData)) {
				$("#savedPic" + id).remove();
				loadDataGrid();
			} else {
				alert("删除失败！");
			}
		}
	});
}

function editDetailClick(id){
	//填充游记详情窗口
	fillDetailWin(id);
	$('#detail-win').window('open');
}

function fillDetailWin(id){
	var detail={};
	$("#savedPic"+id).find("input[type='hidden']").each(function(){
		var name = $(this).attr('name');
		var value = $(this).val();
		detail[name] = value;
	});
	$("#detail-id").val(id);
	$('#detailType').combobox('setValue',detail.type);
	$('#destinationid').combobox('setValue',detail.destinationid);
	$('#destinationid').combobox('setText',detail.name);
	setLay(detail.lon,detail.lat);
	$('#detailtext').val(detail.text);
	$('#detailtime').datetimebox('setValue',detail.time);
	$('#preViewImgDetail').attr('src',$.yuelj.imageurlPre + detail.pic);
}

//清空游记详情窗口
function clearDetailWin(){
	$("#detail-id").val("");
	$('#detailType').combobox('setValue',"");
	$('#destinationid').combobox('setValue',"");
	$('#destinationid').combobox('setText',"");
	map.clearOverlays();
	map.centerAndZoom("丽江", 14);
	$('#detailtext').val("");
	$('#detailtime').datetimebox('setValue',"");
	$('#preViewImgDetail').attr('src',"");
}

//清空游记主要信息窗口
function clearTravelWin(){
	
	$("#title").textbox('setValue',"");
	$("#day").textbox('setValue',"");
	$("#price").textbox('setValue',"");
	$("#actualprice").textbox('setValue',"");
	$("#bestmonth").textbox('setValue',"");
	$("#rank").textbox('setValue',"");
	$("#keyword").textbox('setValue',"");
	$("#address").textbox('setValue',"");
	$("#content").textbox('setValue',"");
	$("#pic").textbox('setValue',"");
	$('#win img').attr('src',"");
	$('#detailSavedDiv').html("");
};

function addDetailDiv(row) {
	var imgurl;
	!row.pic ? imgurl = "" : imgurl = $.yuelj.imageurlPre + row.pic + "_small";
	var imgHtml = '<div id="savedPic' + row.id +'" '
			+ 'style="float:left;margin:5px;width:240px;height:400px;border:#666 1px solid;padding:5px;position: relative;">'
			+ '<img  alt="无图" src=' + imgurl + ' style="width: 240px; height: 180px;" /></br>'
			+ '<span style="color:#666;">' + row.text + '</span><br /><br />'
			+ '<span style="font-weight:bold;">'+ row.name
			+ '</span>&nbsp;&nbsp;'
			+ '<span style="color: #4abdcc;font-weight: bold;">' + row.time
			+ '</span></br>'
			+ '<input type="hidden" name="type" value="'+row.type+'">'
			+ '<input type="hidden" name="destinationid" value="'+row.destinationid+'">'
			+ '<input type="hidden" name="name" value="'+row.name+'">'
			+ '<input type="hidden" name="lon" value="'+row.lon+'">'
			+ '<input type="hidden" name="lat" value="'+row.lat+'">'
			+ '<input type="hidden" name="time" value="'+row.time+'">'
			+ '<input type="hidden" name="text" value="'+row.text+'">'
			+ '<input type="hidden" name="pic" value="'+row.pic+'">'
			+ '<div class="detail-edit" style="position: absolute;top:380px;left:65px;">'
			+ '<a href="javascript:void(0)" class="easyui-linkbutton" iconCls="icon-remove" onclick="delDetailClick(' + row.id
			+ ');">删除</a>'
			+ '&nbsp;&nbsp;<a href="javascript:void(0)" class="easyui-linkbutton" iconCls="icon-edit" onclick="editDetailClick(' + row.id
			+ ');">编辑</a>'
			+ '</div></div>';
	$("#savedPic"+row.id).remove();
	$("#detailSavedDiv").append(imgHtml);
	$.parser.parse($("#savedPic"+row.id));
}
var selecting = false;
$(function() {
	$("#uploadifyDetail").uploadify({
		height : 30,
		swf : '/yuelijiang/flash/uploadify.swf',
		uploader : '/yuelijiang/uploadImg.action',
		width : 120,
		fileObjName : 'uploadify',
		queueID : 'fileQueueDetail',// 与下面的id对应
		queueSizeLimit : 1,
		fileSizeLimit : '10000KB',
		fileTypeDesc : '图片',
		fileTypeExts : '*.gif; *.jpg; *.png',
		buttonText : '上传图片',
		removeCompleted : true,
		removeTimeout : 0,
		multi : true,
		'onUploadSuccess' : uploadSuccessDetail,
		onUploadStart : function() {
			$("#picLoadingtext").html("上传中......");
		}
	});
	function uploadSuccessDetail(file, data, response) {
		data = eval("(" + data + ")");
		if (data.state == 1) {
			$("#picDetail").val(data.message);
			$("#preViewImgDetail").attr("src",
					$.yuelj.imageurlPre + data.message);
			$("#preViewImgDetail").show();
			$("#picLoadingtext").html("上传完成");
		}
	}
	$('#detailType').combobox({
		onSelect : function(record) {
			$('#destinationid').combobox("setValue", "");
		}
	});
	$('#detailType').combobox("setValue", 1);
	$('#destinationid').combobox(
			{
				valueField : 'id',
				textField : 'name',
				onSelect : function() {
					selecting = true;
				},
				onChange : function(newValue, oldValue) {
					if (selecting) {
						selecting = false;
						return;
					}
					if (newValue == null || newValue == ""
							|| newValue == oldValue) {
						return;
					}
					
					var entityJson = {};
					entityJson.name = $("#destinationid").combobox("getText");
					var queryType = $('#detailType').combobox("getValue");
					// 查询客栈
					if (queryType == "2") {
						$.ajax({
							url : "/yuelijiang/selectInnInfo.action",
							data : {
								entityJson : JSON.stringify(entityJson)
							},
							success : function(returnData) {
								if (returnData != null
										&& returnData.list != null
										&& returnData.list.length != 0) {
									$('#destinationid').combobox("loadData", returnData.list);
								}
							}
						});

					} else if (queryType == "1") {
						var sname = $("#destinationid").combobox("getText");
						if(sname != null)
						// 查询景点
						$.ajax({
							url : "/yuelijiang/spotList.action",
							data : {
								sname : newValue,
								pageJson : "{pageSize:20,pageNum:1}"
							},
							success : function(returnData) {
								if (returnData != null
										&& returnData.list != null
										&& returnData.list.length != 0) {
									$('#destinationid').combobox("loadData", returnData.list);
								}
							}
						});
					}
				}
			});
});

//初始化百度地图
function baiduMap() {
  map = new BMap.Map("baidumap"); // 创建Map实例

  if ($('#lon').val() == "" || $('#lat').val() == "") {
    map.centerAndZoom("丽江", 12);
    map.setCurrentCity("丽江"); //由于有3D图，需要设置城市哦
  } else {
    var point = new BMap.Point($('#lon').val(), $('#lat').val());
    map.centerAndZoom(point, 15);
    var marker = new BMap.Marker(point);
    map.addOverlay(marker);
    marker.disableDragging();
    var mycity = "丽江";
    map.setCurrentCity(mycity);
  };

  var top_left_control = new BMap.ScaleControl({
    anchor: BMAP_ANCHOR_TOP_LEFT
  }); // 左上角，添加比例尺
  var top_left_navigation = new BMap.NavigationControl(); //左上角，添加默认缩放平移控件
  var mapType = new BMap.MapTypeControl({
    anchor: BMAP_ANCHOR_TOP_RIGHT
  });

  map.enableScrollWheelZoom(); //启用滚轮放大缩小
  map.addControl(top_left_control);
  map.addControl(top_left_navigation);
  map.addControl(mapType); //右上角，默认地图控件
};

//定位详细地址
function setLoc() {
  map.clearOverlays();
  // 创建地址解析器实例
  var newGeo = new BMap.Geocoder();
  // 将地址解析结果显示在地图上,并调整地图视野
  newGeo.getPoint("丽江市"+$('#destinationid').combobox("getText"), function(point) {
    if (point) {
      map.centerAndZoom(point, 16);
      $('#lon').val(point.lng);
      $('#lat').val(point.lat);
      var newMarker = new BMap.Marker(point);
      map.addOverlay(newMarker);
      newMarker.enableDragging(); // 可拖拽
      newMarker.addEventListener("dragend", function(e) {
        $('#lon').val(e.point.lng);
        $('#lat').val(e.point.lat);
      });

      map.centerAndZoom(point, 15);

    } else {
      alert("您选择地址没有解析到结果!");
    }
  }, "丽江");
}

//根据经纬度定位 并添加标注
function setLay(x, y) {
  map.clearOverlays();
  var point = new BMap.Point(x, y);
  map.centerAndZoom(point, 14);
  map.panBy(140,120);
  var newMarker = new BMap.Marker(point);
  map.addOverlay(newMarker);
  newMarker.enableDragging(); // 可拖拽
  newMarker.addEventListener("dragend", function(e) {
    $('#lon').val(e.point.lng);
    $('#lat').val(e.point.lat);
  });
};

