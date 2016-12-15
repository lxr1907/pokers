/**
 * 丰登街客站管理系统通用js
 */

/**
 * ajax请求基本配置
 */
$(function() {
	$.ajaxSetup({
		async : true,// 异步请求
		cache : false,// 缓存
		dataType : "json",// 数据类型
		type : "POST",
		error : function(xmlReq, error, obj) {
			if (xmlReq.responseText != null
					&& xmlReq.responseText.indexOf("nopower") != -1) {
				$.yuelj.alertMessage("提示", "请重新登录！");
				$.yuelj.toIndexHtml();
				return;
			}
			$.yuelj.alertMessage("提示", obj.message + xmlReq.responseText);
		}
	});
});
$.yuelj = {
	/**
	 * 图片地址的前缀
	 */
	imageurlPre : "http://fdjimg.oss-cn-hangzhou.aliyuncs.com/",
	/**
	 * 用户提示信息窗体
	 * 
	 * @param title
	 * @param content
	 */
	alertMessage : function(title, content) {
		var d = dialog({
			title : title,
			content : content,
			quickClose : true
		});
		d.show();
	},
	/**
	 * 根据权限跳转到不同首页
	 */
	checkPermission : function(type) {
		//var permiss = this.getSessionParm("permission");
		//if (permiss == type) {
		//} else if (permiss != null) {
		//	if (permiss == "operator") {
		//		location.href = "/fdj/html/operator/operatMain.html";
		//	} else if (permiss == "inn_seller") {
		//		location.href = "/fdj/html/innSeller/innSellerMain.html";
		//	}
		//} else if (permiss == null && type != null) {
		//	this.toIndexHtml();
		//}
	},

	toIndexHtml : function() {
		location.href = "/index.html";
		window.parent.location.href = "/index.html";
	},
	/**
	 * 获得session值
	 */
	getSessionParm : function(key) {
		var parm = null;
		$.ajax({
			url : "/fdj/getSessionParm.action",
			async : false,// 同步
			data : {
				sessionKey : key
			},
			success : function(returnData) {
				if (returnData != null && returnData.message != null) {
					if (returnData.state == 1) {
						parm = returnData.message;
					}
				}
			},
			error : function() {
				$.yuelj.alertMessage('提示', "session获取失败!");
			}
		});
		return parm;
	},
	/**
	 * 退出
	 */
	logOut : function() {
		$.ajax({
			url : "/fdj/logOut.action",
			success : function(returnData) {
				window.parent.location.href = "/index.html";
			}
		});
	},
	/**
	 * 判断ajax请求返回值是否正常 正常返回true
	 */
	parseReturn : function(returnData) {
		if (returnData == null || returnData.message == null) {
			$.yuelj.alertMessage('提示', "操作失败!");
			return false;
		} else {
			if (returnData.state == 1) {
				return true;
			}
			if (returnData.state == 0) {
				$.yuelj.alertMessage('提示', returnData.message);
				return false;
			}
		}
	},
	
	// 判断是否是正整数
	isNum : function(s) {
		if (s != null) {
			var r, re;
			re = /\d*/i; // \d表示数字,*表示匹配多个数字
			r = s.match(re);
			return (r == s) ? true : false;
		}
		return false;
	},
	/**
	 * 将2015-07-17格式字符串转换为date时间类型
	 * 
	 * @param strDate
	 * @returns
	 */
	getDate : function(strDate) {
		var date = eval('new Date('
				+ strDate.replace(/\d+(?=-[^-]+$)/, function(a) {
					return parseInt(a, 10) - 1;
				}).match(/\d+/g) + ')');
		return date;
	},
	getDateTime : function(strDate) {
		strDate = strDate.replace(/-/g, "/");
		var date = new Date(strDate);
		return date;
	},
	/**
	 * 将datetime转换为2015-07-17的格式
	 * 
	 * @param datetime
	 * @returns {String}
	 */
	getDateStr : function(datetime) {
		var year = datetime.getFullYear();
		var month = datetime.getMonth() + 1;
		if (month < 10) {
			month = "0" + month;
		}
		var day = datetime.getDate();
		if (day < 10) {
			day = "0" + day;
		}
		return year + "-" + month + "-" + day;
	},
	/**
	 * 将1970年到现在的数字类型时间， 转换为2015-07-17的格式
	 * 
	 * @param datetime
	 * @returns {String}
	 */
	getDateStrFromTime : function(datetime) {
		var date = new Date();
		date.setTime(datetime);
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		if (month < 10) {
			month = "0" + month;
		}
		var day = date.getDate();
		if (day < 10) {
			day = "0" + day;
		}
		return year + "-" + month + "-" + day;
	},
	/**
	 * 将datetime转换为2015-07-17 00:00:00的格式
	 * 
	 * @param datetime
	 * @returns {String}
	 */
	getDateTimeStr : function(datetime) {
		var year = datetime.getFullYear();
		var month = datetime.getMonth() + 1;
		if (month.length == 1) {
			month = "0" + month;
		}
		var day = datetime.getDate();
		if (day.length == 1) {
			day = "0" + day;
		}
		return year + "-" + month + "-" + day + " " + datetime.getHours() + ":"
				+ datetime.getMinutes() + ":" + datetime.getSeconds();
	},
	/**
	 * 计算date后addNum天的日期时间 addNum为负数时向前推
	 * 
	 * @param date
	 * @param addNum
	 * @returns {Date}
	 */
	addDay : function(date, addNum) {
		var time = date.getTime() + 1000 * 3600 * 24 * addNum;
		var d = new Date();
		d.setTime(time);
		return d;
	},
	// 日期格式2015-07-17
	addDayStr : function(dateStr, addNum) {
		var date = $.yuelj.getDate(dateStr);
		var time = date.getTime() + 1000 * 3600 * 24 * addNum;
		var d = new Date();
		d.setTime(time);
		return $.yuelj.getDateStr(d);
	},
	/**
	 * 从时间类型中获取07/05格式的月日
	 * 
	 * @param datetime
	 * @returns {String}
	 */
	getMonthDay : function(datetime) {
		var month = datetime.getMonth() + 1;
		if (month.length == 1) {
			month = "0" + month;
		}
		var day = datetime.getDate();
		if (day.length == 1) {
			day = "0" + day;
		}
		return month + "/" + day;
	},
	/**
	 * 根据传入的日期，获取中文周几
	 * 
	 * @param d
	 *            取值从0到6
	 * @returns
	 */
	getWeekDay : function(d) {
		var day = new Array(7)
		day[0] = "日";
		day[1] = "一";
		day[2] = "二";
		day[3] = "三";
		day[4] = "四";
		day[5] = "五";
		day[6] = "六";
		return day[d.getDay()];
	},
	getDayMinus : function(date1, date2) {
		var time = date1.getTime() - date2.getTime();
		var day = time / (1000 * 3600 * 24);
		return Math.ceil(day);
	},
	// 冒泡排序
	bubbleSort : function(array, key) {
		var i = 0, len = array.length, j, d;
		for (; i < len; i++) {
			for (j = 0; j < len; j++) {
				if (array[i][key] < array[j][key]) {
					d = array[j].key;
					array[j][key] = array[i][key];
					array[i][key] = d;
				}
			}
		}
		return array;
	},
	constant : {
		// 证件类型
		cardType : {
			1 : "身份证",
			2 : "军官证",
			3 : "通行证",
			4 : "护照",
			5 : "其他"
		}
	},
	
	/*字符串首尾去除空格
	*/
	trimStr : function (str){return str.replace(/(^\s*)|(\s*$)/g,"");}
}

