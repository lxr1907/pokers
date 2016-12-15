M.Controls.Holiday = M.createClass();
M.extend(M.Controls.Holiday.prototype,
{
	lunarInfo:[0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950,
			0x16554, 0x056a0, 0x09ad0, 0x055d2, 0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250,
			0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977, 0x04970, 0x0a4b0,
			0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
			0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0,
			0x1c8d7, 0x0c950, 0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0,
			0x092d0, 0x0d2b2, 0x0a950, 0x0b557, 0x06ca0, 0x0b550, 0x15355, 0x04da0,
			0x0a5d0, 0x14573, 0x052d0, 0x0a9a8, 0x0e950, 0x06aa0, 0x0aea6, 0x0ab50,
			0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
			0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540,
			0x0b5a0, 0x195a6, 0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50,
			0x06d40, 0x0af46, 0x0ab60, 0x09570, 0x04af5, 0x04970, 0x064b0, 0x074a3,
			0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0, 0x0c960, 0x0d954,
			0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
			0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176,
			0x052b0, 0x0a930, 0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6,
			0x0a4e0, 0x0d260, 0x0ea65, 0x0d530, 0x05aa0, 0x076a3, 0x096d0, 0x04bd7,
			0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45, 0x0b5a0, 0x056d0,
			0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0],
	sTermInfo:[0, 21208, 42467, 63836, 85337, 107014, 128867,150921, 173149,
			195551, 218072, 240693, 263343, 285989, 308563, 331033, 353350,
			375494, 397447, 419210,
			440795, 462224, 483532, 504758],
	solarTerm:new Array("","","","","","","清明节","","","","","","","","立秋","","","","","","立冬","","","冬至"),
	lFtv:new Array("0101*春节", "0115 元宵节", "0505 端午节","0707 七夕", "0715 中元节", "0815 中秋节","0909 重阳节", "1208 腊八节",
				"1224 小年", "0100*除夕"),
	sFtv:new Array("0101*元旦", "0214 情人节", "0308 妇女节","0401 愚人节", "0501 劳动节", "0504 青年节",
					"0601 儿童节","0910 教师节", "1001*国庆节","1224 平安夜","1225 圣诞节"),	
	Lunar:function(objDate) {
		var returndata={};
		var i, leap = 0, temp = 0
		var baseDate = new Date(1900, 0, 31)
		var offset = (objDate - baseDate) / 86400000

		returndata.dayCyl = offset + 40
		returndata.monCyl = 14

		for (i = 1900; i < 2050 && offset > 0; i++) {
			temp = this.lYearDays(i)
			offset -= temp
			returndata.monCyl += 12
		}
		if (offset < 0) {
			offset += temp;
			i--;
			returndata.monCyl -= 12
		}

		returndata.year = i
		returndata.yearCyl = i - 1864

		leap = this.leapMonth(i) // 闰哪个月
		returndata.isLeap = false

		for (i = 1; i < 13 && offset > 0; i++) {
			// 闰月
			if (leap > 0 && i == (leap + 1) && returndata.isLeap == false) {
				--i;
				returndata.isLeap = true;
				temp = this.leapDays(returndata.year);
			} else {
				temp = this.monthDays(returndata.year, i);
			}

			// 解除闰月
			if (returndata.isLeap == true && i == (leap + 1))
				returndata.isLeap = false

			offset -= temp
			if (returndata.isLeap == false)
				returndata.monCyl++
		}

		if (offset == 0 && leap > 0 && i == leap + 1)
			if (returndata.isLeap) {
				returndata.isLeap = false;
			} else {
				returndata.isLeap = true;
				--i;
				--returndata.monCyl;
			}

		if (offset < 0) {
			offset += temp;
			--i;
			--returndata.monCyl;
		}
		returndata.month = i
		returndata.day = offset + 1
       return returndata;

	},
	getholiday:function (date) {
		var sDObj=M.strtotime(date);
		var lDObj = this.Lunar(sDObj);
		var lDPOS = new Array(3);
		var SY=sDObj.getFullYear();
		var SM=sDObj.getMonth();
		var SD=sDObj.getDate();
		var festival = '', solarTerms = '', solarFestival = '', lunarFestival = '', tmp1, tmp2;
		// 农历节日
		var lFtv=this.lFtv;
		var sFtv=this.sFtv;
		for (i in lFtv)
			if (lFtv[i].match(/^(\d{2})(.{2})([\s\*])(.+)$/)) {
				tmp1 = Number(RegExp.$1) - lDObj.month
				tmp2 = Number(RegExp.$2) - parseInt(lDObj.day)
				if (tmp1 == 0 && tmp2 == 0)
					lunarFestival = RegExp.$4
			}
		// 国历节日
		for (i in sFtv)
			if (sFtv[i].match(/^(\d{2})(\d{2})([\s\*])(.+)$/)) {
				tmp1 = Number(RegExp.$1) - (SM + 1)
				tmp2 = Number(RegExp.$2) - SD
				if (tmp1 == 0 && tmp2 == 0)
					solarFestival = RegExp.$4
			}
		// 节气
		tmp1 = new Date(
				(31556925974.7 * (SY - 1900) + this.sTermInfo[SM * 2 + 1] * 60000)
						+ Date.UTC(1900, 0, 6, 2, 5))
		tmp2 = tmp1.getUTCDate()
		if (tmp2 == SD)
			solarTerms = this.solarTerm[SM * 2 + 1]
		tmp1 = new Date((31556925974.7 * (SY - 1900) +this.sTermInfo[SM * 2] * 60000)
				+ Date.UTC(1900, 0, 6, 2, 5))
		tmp2 = tmp1.getUTCDate()
		if (tmp2 == SD)
			solarTerms = this.solarTerm[SM * 2]

		if (solarTerms == '' && solarFestival == '' && lunarFestival == '')
			festival = '';
		else
			festival = solarTerms+solarFestival+lunarFestival;

		var cl = '<font color="#000066" STYLE="font-size:9pt;">';
		return festival;
	},
	lYearDays:function(y) {
		var i, sum = 348
		for (i = 0x8000; i > 0x8; i >>= 1)
			sum += (this.lunarInfo[y - 1900] & i) ? 1 : 0
		return (sum + this.leapDays(y))
	},
	leapDays:function(y) {
		if (this.leapMonth(y))
			return ((this.lunarInfo[y - 1900] & 0x10000) ? 30 : 29)
		else
			return (0)
	},
	// ==== 传回农历 y年闰哪个月 1-12 , 没闰传回 0
	leapMonth:function(y) {
		return (this.lunarInfo[y - 1900] & 0xf)
	},
	// ====================================== 传回农历 y年m月的总天数
	monthDays:function(y, m) {
		return ((this.lunarInfo[y - 1900] & (0x10000 >> m)) ? 30 : 29)
	}
});
M.extend(M, {
	Holiday: function (ele, options) {
    	var control = new M.Controls.Holiday(); 
        return control;
    }
});
//例子
/*
**date格式是年月日如2014-09-10
**var holiday=M.Holiday();
**var value=holiday.getholiday(date);
**返回的值就是对应的节日，没有节日则返回空
 */