/*
*Version:    1.0
*Author:     johnny
*Date:       2012-9-27
*Desc:       base js framework for all miot web
*
*Requires:   jquery 1.4.2+
*/

/**************************************************************************************************************************
this framework have added many common methods and root elements.
the root element named M has been added to the window object,so you can use it anywhere with M.* ;

the framework has three namespaces[M.page,M.util,M.CONST],each namespace has its own objects,they are used to isolate complex
objects from each other.
***************************************************************************************************************************/
var special = { "\b": "\\b", "\t": "\\t", "\n": "\\n", "\f": "\\f", "\r": "\\r", '"': '\\"', "\\": "\\\\" }, escape = function (a) { return special[a] || "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4); }; jQuery.stringifyJSON = function (b) { if (window.JSON && window.JSON.stringify) { return window.JSON.stringify(b); } switch (jQuery.type(b)) { case "string": return '"' + b.replace(/[\x00-\x1f\\"]/g, escape) + '"'; case "array": return "[" + jQuery.map(b, jQuery.stringifyJSON) + "]"; case "object": var a = []; jQuery.each(b, function (d, e) { var c = jQuery.stringifyJSON(e); if (c) { a.push(jQuery.stringifyJSON(d) + ":" + c); } }); return "{" + a + "}"; case "number": case "boolean": return "" + b; case "undefined": case "null": return "null"; } return b; };

(function () {
    Array.from = function (b) {
        if (!b) {
            return [];
        }
        if (b.toArray) {
            return b.toArray();
        } else {
            var d = [];
            for (var a = 0, c = b.length; a < c; a++) {
                d.push(b[a]);
            }
            return d;
        }
    };
    Function.prototype.toEventHandler = function (c) {
        var a = this,
        b = Array.from(arguments),
        c = b.shift();
        return function (d) {
            if (typeof Array.from == "function") {
                return a.apply(c, [d || window.event].concat(b));
            }
        };
    };
    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, "");
    };
    String.prototype.ltrim = function () {
        return this.replace(/^\s+/, "");
    };
    String.prototype.rtrim = function () {
        return this.replace(/\s+$/, "");
    };

    var M = M || {};
    M.isFunction = function (a) {
        return Object.prototype.toString.call(a) === "[object Function]";
    };
    M.version = "1.0";
    Function.prototype.extend = M.extend = function () {
        var f = arguments[0] || {},
        d = 1,
        e = arguments.length,
        a = false,
        c;
        if (typeof f === "boolean") {
            a = f;
            f = arguments[1] || {};
            d = 2;
        }
        if (typeof f !== "object" && !M.isFunction(f)) {
            f = {};
        }
        if (e == d) {
            f = this; --d;
        }
        for (; d < e; d++) {
            if ((c = arguments[d]) != null) {
                for (var b in c) {
                    var g = f[b],
                    h = c[b];
                    if (f === h) {
                        continue;
                    }
                    if (a && h && typeof h === "object" && !h.nodeType) {
                        f[b] = W.extend(a, g || (h.length != null ? [] : {}), h);
                    } else {
                        f[b] = h;
                    }
                }
            }
        }
        return f;
    };

    M.extend(M, {
        timeout:null,
        namespace: function (ns_string) {
            var parts = ns_string.split('.'),
            parent = M,
            i;
            if (parts[0] === "M") {
                parts = parts.slice(1);
            }
            for (i = 0; i < parts.length; i += 1) {
                if (typeof parent[parts[i]] === "undefined") {
                    parent[parts[i]] = {};
                }
                parent = parent[parts[i]];
            }
            return parent;
        },
        namespaces: function () {
            var args = arguments;
            var p = null;
            for (e = 0; e < args.length; e = e + 1) {
                p = M.namespace(args[e]);
            }
            return p;
        },
        createClass: function () {
            return function () { };
        },
        EventEle: function (e) {
            return $(e.target || e.srcElement);
        },
        mergeObject: function (obj1, obj2) {
            var output = {};
            if (!obj2) {
                return obj1;
            }
            for (var prop in obj1) {
                if (prop in obj2) {
                    output[prop] = obj2[prop];
                } else {
                    output[prop] = obj1[prop];
                }
            }
            return output;
        },
        concatObject: function (obj1, obj2) {
            var output = {};
            if (!obj2) {
                return obj1;
            }
            if (!obj1) { return obj2; }
            for (var prop in obj1) {
                output[prop] = obj1[prop];
            }
            for (var prop in obj2) {
                output[prop] = obj2[prop];
            }
            return output;
        },
        copy:function(obj)
        {
            var output = {};
            if (!obj) {
                return output;
            }
          
            for (var prop in obj) {
                output[prop] = obj[prop];
            }
            return output;
        },
        stopevent: function (e) {
            if (e == undefined) return;
            if (e.preventDefault) {
                e.preventDefault();
                e.stopPropagation();
            } else {
                e.returnValue = false;
                e.cancelBubble = true;
            }
        },
        jsonToStr: function (oJson) {
            if (typeof (oJson) == typeof (false)) {
                return oJson;
            }
            if (oJson == null) {
                return "null";
            }
            if (typeof (oJson) == typeof (0))
                return oJson.toString();
            if (typeof (oJson) == typeof ('') || oJson instanceof String) {
                oJson = oJson.toString();
                oJson = oJson.replace(/\r\n/, '\\r\\n');
                oJson = oJson.replace(/\n/, '\\n');
                oJson = oJson.replace(/\"/, '\\"');
                return '"' + oJson + '"';
            }
            if (oJson instanceof Array) {
                var strRet = "[";
                for (var i = 0; i < oJson.length; i++) {
                    if (strRet.length > 1)
                        strRet += ",";
                    strRet += M.jsonToStr(oJson[i]);
                }
                strRet += "]";
                return strRet;
            }
            if (typeof (oJson) == typeof ({})) {
                var strRet = "{";
                for (var p in oJson) {
                    if (strRet.length > 1)
                        strRet += ",";
                    strRet += '"' + p.toString() + '":' + M.jsonToStr(oJson[p]);
                }
                strRet += "}";
                return strRet;
            }
            /* return JSON.stringify(oJson);*/
            /*jQuery.stringifyJSON*/
        },
        stopevent: function (a) {
            if (a == undefined) return;
            if (a.preventDefault) {
                a.preventDefault();
                a.stopPropagation();
            } else {
                a.returnValue = false;
                a.cancelBubble = true;
            }
        },
        jsonToQueryStr: function (oJson) {
            var str = "";
            if (oJson == undefined || oJson == null) return str;
            for (i in oJson) {
                str += "&" + i + "=" + encodeURIComponent(oJson[i]);
            }
            return str;
        },
        isEmpty: function (str) {
            return str == undefined || str == null || str == '';
        },
        timeformat:function(date,format)
        {
            if(M.isEmpty(format))
            {
                format="Y-m-d";
            }
            
            var year=date.getFullYear();
            var month=this.zerosize(date.getMonth() + 1 + "", 2);
            var day=this.zerosize(date.getDate() + "", 2);
            var hours=this.zerosize(date.getHours());
            var minis=this.zerosize(date.getMinutes());
            var second=this.zerosize(date.getSeconds());
            
            var time = format.replace("Y",year)
            .replace("m",month)
            .replace("d",day)
            .replace("h",hours)
            .replace("i",minis)
            .replace("s",second);
            
            return time;
        },
        zerosize:function (value, length) {
            if (!length) length = 2;
            value = String(value);

            for (var i = 0, zeros = ''; i < (length - value.length); i++) {
                zeros += '0';
            }
            return zeros + value;
        },
        strtotime:function(timestr)
        {
            var d=new Date(Date.parse(timestr.replace(/-/g,"/")));
            
            return d;
        },
        strtotimeSetDefaultHour:function(timestr)
        {
            var d=new Date(Date.parse(timestr.replace(/-/g,"/")));
            d.setHours(8);
            return d;
        },
        valuefrom: function (ele) {
            /*get obj from element*/
            /*currently,just contains text,select,hidden*/
            var res = {};
            ele.find("input[type=hidden]").each(function () {
                var name = $(this).attr("name");
                if (name != "") {
                    var val = $(this).val();
                    val = $.trim(val);
                    res[name] = val;
                }
            });
            ele.find("input[type=text]").each(function () {
                var name = $(this).attr("name");
                if (name != "") {
                    var val = $(this).val();
                    val = $.trim(val);
                    res[name] = val;
                }
            });
            ele.find("select").each(function () {
                var name = $(this).attr("name");
                if (name != "") {
                    var val = $(this).val();
                    val = $.trim(val);
                    res[name] = val;
                }
            });
            return res;
        },
        htmlspecialchars_decode:function(string, quote_style) {
        	  var optTemp = 0,
        	    i = 0,
        	    noquotes = false;
            if(this.isEmpty(string)){
                return;
            }
        	  if (typeof quote_style === 'undefined') {
        	    quote_style = 2;
        	  }
        	  string = string.toString()
        	    .replace(/&lt;/g, '<')
        	    .replace(/&gt;/g, '>');
        	  var OPTS = {
        	    'ENT_NOQUOTES': 0,
        	    'ENT_HTML_QUOTE_SINGLE': 1,
        	    'ENT_HTML_QUOTE_DOUBLE': 2,
        	    'ENT_COMPAT': 2,
        	    'ENT_QUOTES': 3,
        	    'ENT_IGNORE': 4
        	  };
        	  if (quote_style === 0) {
        	    noquotes = true;
        	  }
        	  if (typeof quote_style !== 'number') { // Allow for a single string or an array of string flags
        	    quote_style = [].concat(quote_style);
        	    for (i = 0; i < quote_style.length; i++) {
        	      // Resolve string input to bitwise e.g. 'PATHINFO_EXTENSION' becomes 4
        	      if (OPTS[quote_style[i]] === 0) {
        	        noquotes = true;
        	      } else if (OPTS[quote_style[i]]) {
        	        optTemp = optTemp | OPTS[quote_style[i]];
        	      }
        	    }
        	    quote_style = optTemp;
        	  }
        	  if (quote_style & OPTS.ENT_HTML_QUOTE_SINGLE) {
        	    string = string.replace(/&#0*39;/g, "'"); // PHP doesn't currently escape if more than one 0, but it should
        	    // string = string.replace(/&apos;|&#x0*27;/g, "'"); // This would also be useful here, but not a part of PHP
        	  }
        	  if (!noquotes) {
        	    string = string.replace(/&quot;/g, '"');
        	  }
        	  // Put this in last place to avoid escape being double-decoded
        	  string = string.replace(/&amp;/g, '&');

        	  return string;
        	},
        _get: function (url, data, rescallback, callbackcontext) {
            var that = this;
            var tempcontext = callbackcontext;
            if (tempcontext == undefined || tempcontext == null || tempcontext == '') {
                tempcontext = that;
            }
            var reqUrl = url;
            if (url.indexOf("?") > -1) {
                reqUrl = url + "&" + M.jsonToQueryStr(data) + "&t=" + new Date().getMilliseconds();
            }
            else {
                reqUrl = url + "?" + M.jsonToQueryStr(data) + "&t=" + new Date().getMilliseconds();
            }
            
            $.ajax({
                type: 'get',
                url: reqUrl,
                dataType: 'json',
                data: "",
                success: function (e) {
                    var res = null;
                    if (e == undefined || e == '') {
                        res = { status: "NODATA" };
                    }
                    else {
                        res = e;
                    }
                    res.req=data;
                    //res=M.concatObject(res,data);
                    if (rescallback != null) {
                        rescallback.call(tempcontext,res);
                    }
                },
                error: function () {
                    if (rescallback != null) {
                        rescallback.call(tempcontext, { status: "ERROR" },data);
                    }
                }
            });
        },
        _getjson: function (url, data, rescallback,methodtype) {
            var reqUrl = url;
            /**/
            if (url.indexOf("?") > -1) {
                //reqUrl = url + "&" + M.jsonToQueryStr(data)+"&t=" + new Date().getMilliseconds();
                reqUrl+="&t=" + new Date().getMilliseconds();
            }
            else {
                //reqUrl = url + "?" + M.jsonToQueryStr(data) + "&t=" + new Date().getMilliseconds();
                reqUrl+="?t=" + new Date().getMilliseconds();
            }
            if(!M.isEmpty(methodtype))
            {
                methodtype=methodtype.toLowerCase();
                if(methodtype!="get"&&methodtype!="post")methodtype="";
            }
            var mtype=M.isEmpty(methodtype)?"post":methodtype;
            $.ajax({
                type: mtype,
                data:data,
                url: reqUrl,
                dataType: 'json',
                contentType: "application/x-www-form-urlencoded;charset=utf-8",
                success: function (e) {
                    var res = null;
                    if (e == undefined || e == '') {
                        res = { status: "NODATA" };
                    }
                    else {
                        res = e;
                    }
                    res.req=data;
                    if(!M.isEmpty(res.status)&&res.status=="notlogin")
                    {   
                        if(M.isEmpty(M.timeout))
                        {
                            M.timeout=1;
                            alert("您已经很长时间没有操作了，请重新登录");
                        }
                        window.top.location.href="/Login/index?t="+new Date().getMilliseconds();
                        return;
                    }
                    if (rescallback != null) {
                        rescallback.call(rescallback.context, res);
                    }
                },
                error: function () {
                    if (rescallback != null) {
                        rescallback.call(rescallback.context, { status: "ERROR" });
                    }
                }
            });
        },
        _gethtml: function (url, data, rescallback, callbackcontext) {
            var that = this;
            var tempcontext = callbackcontext;
            if (tempcontext == undefined || tempcontext == null || tempcontext == '') {
                tempcontext = that;
            }
            var reqUrl = url;
            if (url.indexOf("?") > -1) {
                reqUrl = url + "&" + M.jsonToQueryStr(data) + "&t=" + new Date().getMilliseconds();
            }
            else {
                reqUrl = url + "?" + M.jsonToQueryStr(data) + "&t=" + new Date().getMilliseconds(); ;
            }
            reqUrl=encodeURI(reqUrl);
            $.ajax({
                type: 'get',
                url: reqUrl,
                dataType: 'html',
                data: "",
                success: function (e) {
                    var res = e;
                    if (rescallback != null) {
                        rescallback.call(tempcontext, res);
                    }
                },
                error: function () {
                    if (rescallback != null) {
                        rescallback.call(tempcontext, { status: "ERROR" });
                    }
                }
            });
        },
        _post: function (url, data, rescallback, callbackcontext) {
            /**/
            var that = this;
            var tempcontext = callbackcontext;
            if (tempcontext == undefined || tempcontext == null || tempcontext == '') {
                tempcontext = that;
            }
            var reqUrl = url;
            $.ajax({
                type: 'post',
                url: reqUrl,
                dataType: 'json',
                data: data,
                success: function (e) {
                    var res = null;
                    if (e == undefined || e == '') {
                        res = { status: "NODATA" };
                    }
                    else {
                        res = e;
                    }
                    if (rescallback != null) {
                        rescallback.call(tempcontext, res);
                    }
                },
                error: function () {
                    if (rescallback != null) {
                        rescallback.call(tempcontext, { status: "ERROR" });
                    }
                }
            });

        }
    });

    var J = navigator.userAgent.toLowerCase();
    M.browser = {
        version: (J.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [0, "0"])[1],
        safari: /webkit/.test(J),
        opera: /opera/.test(J),
        msie: /msie/.test(J) && !/opera/.test(J),
        mozilla: /mozilla/.test(J) && !/(compatible|webkit)/.test(J)
    };

    M.extend(M, {
        isReady: false,
        readyList: [],
        pageArray: [],
        ready: function (a) {
            if (a == undefined || a == null) return;
            if (M.isReady) {
                a.call(document, this);
            } else {
                M.readyList.push(a);
                M.pageArray.push(a);
            }
            return this;
        }
    });

    M.namespaces("M.Page", "M.Data", "M.Util", "M.Controls", "M.CONST");

    window.M = M;
    $(document).ready(function () {
        if (!M.isReady) {
            M.isReady = true;
            if (M.readyList) {
                for (var i = 0; i < M.readyList.length; i++) {
                    var res = M.readyList[i].call(document, this);
                    if (res && res.init) {
                        res.init.call(res);
                    }
                }
            }
            M.readyList = null;
            $(document).triggerHandler("ready");
        }
    });
    /*add constants*/
    M.CONST.Tag = "tag";
})();
/*******util begin*******/

/*jquery template*/
(function (a) { var r = a.fn.domManip, d = "_tmplitem", q = /^[^<]*(<[\w\W]+>)[^>]*$|\{\{\! /, b = {}, f = {}, e, p = { key: 0, data: {} }, i = 0, c = 0, l = []; function g(g, d, h, e) { var c = { data: e || (e === 0 || e === false) ? e : d ? d.data : {}, _wrap: d ? d._wrap : null, tmpl: null, parent: d || null, nodes: [], calls: u, nest: w, wrap: x, html: v, update: t }; g && a.extend(c, g, { nodes: [], parent: d }); if (h) { c.tmpl = h; c._ctnt = c._ctnt || c.tmpl(a, c); c.key = ++i; (l.length ? f : b)[i] = c } return c } a.each({ appendTo: "append", prependTo: "prepend", insertBefore: "before", insertAfter: "after", replaceAll: "replaceWith" }, function (f, d) { a.fn[f] = function (n) { var g = [], i = a(n), k, h, m, l, j = this.length === 1 && this[0].parentNode; e = b || {}; if (j && j.nodeType === 11 && j.childNodes.length === 1 && i.length === 1) { i[d](this[0]); g = this } else { for (h = 0, m = i.length; h < m; h++) { c = h; k = (h > 0 ? this.clone(true) : this).get(); a(i[h])[d](k); g = g.concat(k) } c = 0; g = this.pushStack(g, f, i.selector) } l = e; e = null; a.tmpl.complete(l); return g } }); a.fn.extend({ tmpl: function (d, c, b) { return a.tmpl(this[0], d, c, b) }, tmplItem: function () { return a.tmplItem(this[0]) }, template: function (b) { return a.template(b, this[0]) }, domManip: function (d, m, k) { if (d[0] && a.isArray(d[0])) { var g = a.makeArray(arguments), h = d[0], j = h.length, i = 0, f; while (i < j && !(f = a.data(h[i++], "tmplItem"))); if (f && c) g[2] = function (b) { a.tmpl.afterManip(this, b, k) }; r.apply(this, g) } else r.apply(this, arguments); c = 0; !e && a.tmpl.complete(b); return this } }); a.extend({ tmpl: function (d, h, e, c) { var i, k = !c; if (k) { c = p; d = a.template[d] || a.template(null, d); f = {} } else if (!d) { d = c.tmpl; b[c.key] = c; c.nodes = []; c.wrapped && n(c, c.wrapped); return a(j(c, null, c.tmpl(a, c))) } if (!d) return []; if (typeof h === "function") h = h.call(c || {}); e && e.wrapped && n(e, e.wrapped); i = a.isArray(h) ? a.map(h, function (a) { return a ? g(e, c, d, a) : null }) : [g(e, c, d, h)]; return k ? a(j(c, null, i)) : i }, tmplItem: function (b) { var c; if (b instanceof a) b = b[0]; while (b && b.nodeType === 1 && !(c = a.data(b, "tmplItem")) && (b = b.parentNode)); return c || p }, template: function (c, b) { if (b) { if (typeof b === "string") b = o(b); else if (b instanceof a) b = b[0] || {}; if (b.nodeType) b = a.data(b, "tmpl") || a.data(b, "tmpl", o(b.innerHTML)); return typeof c === "string" ? (a.template[c] = b) : b } return c ? typeof c !== "string" ? a.template(null, c) : a.template[c] || a.template(null, q.test(c) ? c : a(c)) : null }, encode: function (a) { return ("" + a).split("<").join("&lt;").split(">").join("&gt;").split('"').join("&#34;").split("'").join("&#39;") } }); a.extend(a.tmpl, { tag: { tmpl: { _default: { $2: "null" }, open: "if($notnull_1){__=__.concat($item.nest($1,$2));}" }, wrap: { _default: { $2: "null" }, open: "$item.calls(__,$1,$2);__=[];", close: "call=$item.calls();__=call._.concat($item.wrap(call,__));" }, each: { _default: { $2: "$index, $value" }, open: "if($notnull_1){$.each($1a,function($2){with(this){", close: "}});}" }, "if": { open: "if(($notnull_1) && $1a){", close: "}" }, "else": { _default: { $1: "true" }, open: "}else if(($notnull_1) && $1a){" }, html: { open: "if($notnull_1){__.push($1a);}" }, "=": { _default: { $1: "$data" }, open: "if($notnull_1){__.push($.encode($1a));}" }, "!": { open: ""} }, complete: function () { b = {} }, afterManip: function (f, b, d) { var e = b.nodeType === 11 ? a.makeArray(b.childNodes) : b.nodeType === 1 ? [b] : []; d.call(f, b); m(e); c++ } }); function j(e, g, f) { var b, c = f ? a.map(f, function (a) { return typeof a === "string" ? e.key ? a.replace(/(<\w+)(?=[\s>])(?![^>]*_tmplitem)([^>]*)/g, "$1 " + d + '="' + e.key + '" $2') : a : j(a, e, a._ctnt) }) : e; if (g) return c; c = c.join(""); c.replace(/^\s*([^<\s][^<]*)?(<[\w\W]+>)([^>]*[^>\s])?\s*$/, function (f, c, e, d) { b = a(e).get(); m(b); if (c) b = k(c).concat(b); if (d) b = b.concat(k(d)) }); return b ? b : k(c) } function k(c) { var b = document.createElement("div"); b.innerHTML = c; return a.makeArray(b.childNodes) } function o(b) { return new Function("jQuery", "$item", "var $=jQuery,call,__=[],$data=$item.data;with($data){__.push('" + a.trim(b).replace(/([\\'])/g, "\\$1").replace(/[\r\t\n]/g, " ").replace(/\$\{([^\}]*)\}/g, "{{= $1}}").replace(/\{\{(\/?)(\w+|.)(?:\(((?:[^\}]|\}(?!\}))*?)?\))?(?:\s+(.*?)?)?(\(((?:[^\}]|\}(?!\}))*?)\))?\s*\}\}/g, function (m, l, k, g, b, c, d) { var j = a.tmpl.tag[k], i, e, f; if (!j) throw "Unknown template tag: " + k; i = j._default || []; if (c && !/\w$/.test(b)) { b += c; c = "" } if (b) { b = h(b); d = d ? "," + h(d) + ")" : c ? ")" : ""; e = c ? b.indexOf(".") > -1 ? b + h(c) : "(" + b + ").call($item" + d : b; f = c ? e : "(typeof(" + b + ")==='function'?(" + b + ").call($item):(" + b + "))" } else f = e = i.$1 || "null"; g = h(g); return "');" + j[l ? "close" : "open"].split("$notnull_1").join(b ? "typeof(" + b + ")!=='undefined' && (" + b + ")!=null" : "true").split("$1a").join(f).split("$1").join(e).split("$2").join(g || i.$2 || "") + "__.push('" }) + "');}return __;") } function n(c, b) { c._wrap = j(c, true, a.isArray(b) ? b : [q.test(b) ? b : a(b).html()]).join("") } function h(a) { return a ? a.replace(/\\'/g, "'").replace(/\\\\/g, "\\") : null } function s(b) { var a = document.createElement("div"); a.appendChild(b.cloneNode(true)); return a.innerHTML } function m(o) { var n = "_" + c, k, j, l = {}, e, p, h; for (e = 0, p = o.length; e < p; e++) { if ((k = o[e]).nodeType !== 1) continue; j = k.getElementsByTagName("*"); for (h = j.length - 1; h >= 0; h--) m(j[h]); m(k) } function m(j) { var p, h = j, k, e, m; if (m = j.getAttribute(d)) { while (h.parentNode && (h = h.parentNode).nodeType === 1 && !(p = h.getAttribute(d))); if (p !== m) { h = h.parentNode ? h.nodeType === 11 ? 0 : h.getAttribute(d) || 0 : 0; if (!(e = b[m])) { e = f[m]; e = g(e, b[h] || f[h]); e.key = ++i; b[i] = e } c && o(m) } j.removeAttribute(d) } else if (c && (e = a.data(j, "tmplItem"))) { o(e.key); b[e.key] = e; h = a.data(j.parentNode, "tmplItem"); h = h ? h.key : 0 } if (e) { k = e; while (k && k.key != h) { k.nodes.push(j); k = k.parent } delete e._ctnt; delete e._wrap; a.data(j, "tmplItem", e) } function o(a) { a = a + n; e = l[a] = l[a] || g(e, b[e.parent.key + n] || e.parent) } } } function u(a, d, c, b) { if (!a) return l.pop(); l.push({ _: a, tmpl: d, item: this, data: c, options: b }) } function w(d, c, b) { return a.tmpl(a.template(d), c, b, this) } function x(b, d) { var c = b.options || {}; c.wrapped = d; return a.tmpl(a.template(b.tmpl), b.data, c, b.item) } function v(d, c) { var b = this._wrap; return a.map(a(a.isArray(b) ? b.join("") : b).filter(d || "*"), function (a) { return c ? a.innerText || a.textContent : a.outerHTML || s(a) }) } function t() { var b = this.nodes; a.tmpl(null, null, null, this).insertBefore(b[0]); a(b).remove() } })(jQuery);
/*jquery cookie*/
(function ($, document, undefined) {

    var pluses = /\+/g;

    function raw(s) {
        return s;
    }

    function decoded(s) {
        return decodeURIComponent(s.replace(pluses, ' '));
    }

    var config = $.cookie = function (key, value, options) {
        if (value !== undefined) {
            options = $.extend({}, config.defaults, options);

            if (value === null) {
                options.expires = -1;
            }

            if (typeof options.expires === 'number') {
                var time = options.expires, t = options.expires = new Date();
                /*change to seconds*/

                options.expires = new Date(options.expires.getTime() + time * 1000).toUTCString();
                /*t.setDate(t.getDate() + days);*/

            }
            if (options.expires.toLowerCase() == "session") {
                if (M.browser.msie) {
                    options.expires = "At the end of the Session";
                }
                else {
                    options.expires = "Session";
                }
            }
            value = config.json ? $.stringifyJSON(value) : String(value);

            return (document.cookie = [
                encodeURIComponent(key), '=', config.raw ? value : encodeURIComponent(value),
                options.expires ? '; expires=' + options.expires : '',
                options.path ? '; path=' + options.path : '',
                options.domain ? '; domain=' + options.domain : '',
                options.secure ? '; secure' : ''
            ].join(''));
        }
        var decode = config.raw ? raw : decoded;
        var cookies = document.cookie.split('; ');
        for (var i = 0, l = cookies.length; i < l; i++) {
            var parts = cookies[i].split('=');
            if (decode(parts.shift()) === key) {
                var cookie = decode(parts.join('='));
                return config.json ? $.parseJSON(cookie) : cookie;
            }
        }

        return null;
    };

    config.defaults = {};

    $.removeCookie = function (key, options) {
        if ($.cookie(key) !== null) {
            $.cookie(key, null, options);
            return true;
        }
        return false;
    };

})(jQuery, document);
$.cookie.json = true;

/*******util end*********/

/**************controls****************/

/*time*/
M.extend(M, {
    _secondDiff:0,
    setTime:function(time)
    {
        var sms=time.getTime();
        var cms=new Date().getTime();
        var diff=sms-cms;
        
        this._secondDiff=diff;
    },
    getTime: function () {
        var cms=new Date().getTime();
        var sms=cms+this._secondDiff;
        
        var now=new Date(sms);
        
        return now;
    }
});

/*popup*/
M.Controls.Popup = M.createClass();
M.extend(M.Controls.Popup.prototype,
{
    overlay: null,
    content:null,
    classes:{},
    popup:function(ele,classes,popupfinished){
        this.overlay=$('<div class="graylayer"></div>');
        this.content=ele;
        this.classes=classes;
        
        this.overlay.appendTo($(document.body));
        this.overlay.bind("click", this.overlay_click.toEventHandler(this));
        if(!M.isEmpty(classes)&&!M.isEmpty(classes.showclass))
        {   
             if(typeof(eval(classes.drag))!="function"){
                 classes.drag=function(){};
             }  
            ele.show("fast",function(){
                ele.attr("class",classes.showclass);
                if(!M.isEmpty(popupfinished))
                {
                    popupfinished.call(popupfinished.context,null);
                }
                if(classes.dragable)
                {   
                    var oclass=ele.attr("class");
                    ele.draggable({ 
                        cancel: ".noclass",
                        handle:".modal-header",
                        cursor: "move",
                         drag: classes.drag,
                        start:function(event,ui)
                        {
                            var c1=$(this).attr("class");
                            if(c1.indexOf("nofade")<0)
                            {
                                var nclass=$(this).attr("class").replace(oclass,oclass+" nofade");
                                $(this).attr("class",nclass).attr("preclass",oclass);
                            }
                        }
                    });
                }
                
            }.toEventHandler(this));
            
        }
    },
    overlay_click:function()
    {
        /*this.close();*/
    },
    close:function(animate)
    {
        M.popupids[this.id]="";
        if(!M.isEmpty(this.classes)&&!M.isEmpty(this.classes.hideclass))
        {
            this.content.attr("class",this.classes.hideclass);
        }
        setTimeout(this.delayfun.toEventHandler(this),310);
    },
    delayfun:function(){
        if(!M.isEmpty(this.content))
        {
            if(this.classes.dragable)
            {
                this.content.removeAttr("style");   
            }
            this.content.hide();
        }
        this.destroy();
    },
    destroy:function()
    {
        if(!M.isEmpty(this.overlay))
        {
            this.overlay.unbind("click");
            this.overlay.remove();
        }
        this.overlay=null;
        this.content=null;
        this.classes=null;
    }
}
);
M.extend(M, {
    popups:new Array(),
    popupids:{},
    Popup: function (ele,classes,popupfinished) {
        if(ele.length==0)return;
        var eleid=$(ele).attr("id");
        if(M.isEmpty(this.popupids[eleid]))
        {
            var popup = new M.Controls.Popup();
            popup.id=eleid;
            if(classes.dragable==undefined||classes.dragable==null)
            {   
                classes.dragable=true;
            }
            popup.popup(ele,classes,popupfinished);
            this.popups.push(popup);
            this.popupids[eleid]="1";
        }
    },
    ClosePopup:function()
    {
        if(!M.isEmpty(this.popups))
        {
            var len=this.popups.length;
            for(var i=0;i<len;i++)
            {
                var t=this.popups.pop();
                this.popupids[t.id]="";
                t.close();
            }
        }
    },
    CloseLast:function()
    {
        if(!M.isEmpty(this.popups))
        {
            var t=this.popups.pop();
            this.popupids[t.id]="";
            t.close();
        }
    }
});



/*popup*/
M.Controls.DropdownList = M.createClass();
M.extend(M.Controls.DropdownList.prototype,
{   
    options:{
    	disable:false,
        optionwidth:null,
        optionheight:null,
        optiontpl:'<div tag="option" value="${value}"><a tag="option" value="${value}" href="javascript:;">${name}</a></div>',
        optionaddtpl:'<div tag="addoption"><input class="txt" type="text" setplaceholder  placeholder="新增项目" value="新增项目"><input tag="add" class="btn" type="button" value="+"></li>'
    },
    status:0,
    listdom:null,
    valele:null,
    optionsele:null,
    onchange:null,
    onselect:null,
    onadd:null,
    afteradd:null,
    delay2hide:null,
    init:function(ele,onchange,options){
        /*从已有dom初始化*/
        if(!M.isEmpty(options)){
            this.options = $.extend({},this.options,options);
        }
        this.delay2hide=null;
        
        this.listdom=$(ele);
        this.onchange=onchange;
        this.listdom.attr("tag","dropdownlist")
        this.valele=this.listdom.children("span");
        this.valele.attr('tag','value');
        
        this.optionsele=this.listdom.children("div");
        this.optionsele.children("div").find("div[tag!='addoption']").attr("tag",'option').children("a").attr("tag","option");
        
        //this.listdom.bind("mouseover",this.onmouseover.toEventHandler(this));
        //this.listdom.bind("mouseout",this.onmouseout.toEventHandler(this));
        this.initvalue();
    },
    initvalue:function()
    {
        /*将选项的第一项设置为默认选中值*/
        var valObj=this._getvalfromoption(this.optionsele.children().children("div:first"));
        this.listdom.unbind("click");
        this.listdom.bind("click",this.onclick.toEventHandler(this));
       // this._setval(valObj);
        this.listdom.each(function(){
        	var value=$(this).attr("value");
        	var tpl=$(this);
        	if(!M.isEmpty(value)){
        		var list=tpl.children("div").find("div[tag=option]");
            	var name='';
            	list.each(function(){
            		var val=$(this).attr("value");
            		if(val==value){
            			name=$(this).children("a").text();
            		}
            	});
            	if(M.isEmpty(name)){
            		var firsttpl=tpl.children("div").find("div[tag=option]:first");
            		name=firsttpl.children("a").text();
            		value=firsttpl.attr("value");
            	}
            	tpl.children("span").attr("value",value).html(name);            	
        	}else{
        		var firsttpl=tpl.children("div").find("div[tag=option]:first");
        		name=firsttpl.children("a").text();
        		value=firsttpl.attr("value");
        		tpl.children("span").attr("value",value).html(name);  
        	}       	
        });
        
    },
    create:function()
    {
        //TUDO:
    },
    onclick:function(e){
    	if(this.options.disable==true){
    		return;
    	}
    	var selft=M.EventEle(e).attr("tag");
    	if(selft=="value"){
    		var ele=M.EventEle(e);
    		var showstatus=ele.parents("div[tag=dropdownlist]").children("div").css("display");
    		if(showstatus!='none'){
    			ele.parents("div[tag=dropdownlist]").children("div").hide();
    			return;
    		}
    	}
    	if(selft=="dropdownlist"){
    		var ele=M.EventEle(e);
    		var showstatus=ele.children("div").css("display");
    		if(showstatus!='none'){
    			ele.children("div").hide();
    			return;
    		}
    	}
    	if(selft!="dropdownlist"){
    		 var ele = M.EventEle(e).parent();
    	}else{
    		var ele=M.EventEle(e);
    	}
        
        var t = ele.attr("tag");           
        clearTimeout(this.delay2hide);
        if(t=="dropdownlist"){
        	ele.parents("form").children().find(".droplist_on").removeClass("droplist_on").children("div").hide();    
        	ele.addClass("droplist_on");
        	var test=ele.children("span").attr("value");
        	this._setselected(test);
        	if(ele.children("span").attr("optionlength")==0){
        		return;
        	}
        }
        if(t=="value"||t=="dropdownlist")
        {
            this._toggle(ele);
        }
        else if(t=="option")
        {
        	var disabled=ele.attr("disabled");
        	if(!M.isEmpty(disabled)&&disabled=="disabled"){
        		return;
        	}
        	this._setvalele(ele);
            var valObj=this._getvalfromoption(ele);
            var oval=this._getval();
            if(oval!=valObj.value){
                this._setval(valObj);
                if(!M.isEmpty(this.onchange))
                {
                    this.onchange.call(this,ele);
                }   
            }
            this.listdom.removeClass("droplist_on");
            this._hide();
        }   
        else if(t=="add")
        {   
            if(!M.isEmpty(this.onadd))
            {
                this.onadd.call(this,valObj.value);
            }   
        }   
    },
    onmouseover:function(e){
        this.status=0;
    },
    onmouseout:function(e)
    {
    	var ele = M.EventEle(e);
        this.status=1;
        this.delay2hide=setTimeout(function() {
            if (this.status==1) {
                this._hide();
                this.status=0;
            }
        }.toEventHandler(this), 3000);
    },
    val:function(val)
    {
        /*设置选择项目*/
        if(M.isEmpty(val))
        {
            return this._getval();
        }   
        else
        {
            this._setval(val);
        }   
    },
    valAdd:function(val)
    {
        /*设置选择项目*/
        var ele=this.optionsele.children("div[tag=addoptoin]").find("input[type=text]");
        if(M.isEmpty(val))
        {
            ele.val(val);
        }   
        else
        {
            return M.getVal(ele);
        }   
    },
    bindsource:function(source,field)
    {
        if(M.isEmpty(field))
        {
            field={"vlaue":"value","name":"name"};
        }   
        /*绑定数据源*/
        this._clearoptions();
        var tmpsource=[];
        if(!M.isEmpty(source))
        {
            for(var i=0;i<source.length;i++)
            {   
                var it=source[i];
                tmpsource.push({"value":it[field.value],"name":it[field.name]});
            }
        }
        var eles=$.tmpl(this.options.optiontpl,tmpsource);
        this._addoptionsele(eles);
        this.initvalue();
    },
    addoption:function(optionObj)
    {
        this._addoptionsele($.tmpl(this.options.optiontpl,optionObj));
    },
    _setvalele:function(ele){
    	this.valele=ele.parents("div[tag=dropdownlist]").children("span");
    	this.optionsele=ele.parents("div[tag=dropdownlist]").children("div");
    },
    _create:function(){
        
    },
    _hasaddoption:function()
    {
        var ele=this.optionsele.children("div[tag=addoptoin]");
        return ele.length>0;
    },
    _addoptionsele:function(ele)
    {
        if(this._hasaddoption())
        {
            ele.insertBefore(this.optionsele.children("div[tag=addoptoin]"));
        }
        else
        {
            this.optionsele.append(ele);
        }
    },
    _setselected:function(value){
    	var list=this.optionsele.children("div").children();
    	var name='';
    	list.each(function(){
    		var val=$(this).attr("value");
    		if(val==value){
    			name=$(this).children("a").text();
    			$(this).children("a").addClass("on");
    		}else{
    			$(this).children("a").removeClass("on");
    		}
    	});
    	return name;
    },
    _getvalfromoption:function(ele){
        var v=ele.attr("value");
        var t=ele.text();
        if(M.isEmpty(v))
        {
            v=ele.children("a").attr("value");
        }   
        v=M.isEmpty(v)?"":v;
        
        return {"value":v,"name":t}; 
    },
    _getval:function()
    {
        /*获取值*/
        var v=this.valele.attr("value");
        return M.isEmpty(v)?"":v;
    },
    _setval:function(valObj)
    {
        /*设置值*/
        this.valele.attr("value",valObj.value);        
        var name=this._setselected(valObj.value);
        
        this.valele.text(name);
    },
    _toggle:function(ele)
    {
    	
    	ele.children("div").toggle();
    },
    _show:function(){
        /*显示*/
        this.optionsele.show();
    },
    _hide:function()
    {
        /*隐藏*/
        this.optionsele.hide();
    },
    _clearoptions:function(){
        this.optionsele.children("div").remove();
    },
    clear:function(){
        
    },
    setdisable:function(value){
    	this.options.disable=value;
    },
    destroy:function()
    {   
    
    }
}
);

M.extend(M, {
    DropdownList:function(ele,onchange,options){
        var droplist=new M.Controls.DropdownList();
        droplist.init(ele,onchange,options);
        return droplist;
    }
});


M.extend(M, {
    success_tpl:'<div id="ui_message" class="ui_messageBox fade ui_mb_success" style="display:none;"><div class="content" tag="msg"></div></div>',
    error_tpl:'<div id="ui_message" class="ui_messageBox fade ui_mb_error" style="display:none;"><div class="content" tag="msg"></div></div>',
    layer_tpl:'<div id="lightgraylayer" class="graylayer lightgraylayer" style="display:none"></div>',
    confirm_tpl:'<div id="ui_message" class="ui_messageBox fade in ui_mb_success" style="display:none;"><div class="content" tag="msg"></div><div class="mt20">'
            +'<a href="javascript:;" class="mr20 btn btn-primary" tag="confirm">确认</a><a href="javascript:;" tag="cancle" class="btn">取消</a></div></div>',
    confirmmessage_tpl:'<div id="ui_message" class="ui_messageBox fade in ui_mb_success" style="display:none;"><div class="content" tag="msg"></div><div class="mt20">'
        +'<a href="javascript:;" tag="confirm" class="btn">确认</a></div></div>',
        
    getVal:function(ele){
        if(ele.val()==ele.attr("placeholder"))
        {
            return "";
        }
        return ele.val();
    },
    emptyVal:function(ele)
    {
        $(ele).val($(ele).attr("placeholder"));
    },
    getDroplistVal:function(ele){
    	return ele.children("span").attr("value");
    },
    uimessage_init:function(layer_tpl,message_tpl,msg){
        $(document.body).append(layer_tpl);
        $(document.body).append(message_tpl);
        var ui_messageBox = $("#ui_message");
        var transparentlayer = $("#lightgraylayer");
        if(!M.isEmpty(msg))
           	 ui_messageBox.children("div[tag=msg]").html(msg);
        marginLeft = -ui_messageBox.outerWidth()/2;
        ui_messageBox.css("margin-left",marginLeft);
        
        ui_messageBox.show();
        transparentlayer.show();    
        ui_messageBox.addClass('in');
       
        return ui_messageBox;
        
    },
    win_resize:function(ui_messageBox){
       var marginLeft = -ui_messageBox.outerWidth()/2;
       ui_messageBox.css("margin-left",marginLeft);
   },
    getstrlength:function(str){
    	var realLength = 0, len = str.length, charCode = -1;
        for (var i = 0; i < len; i++) {
            charCode = str.charCodeAt(i);
            if (charCode >= 0 && charCode <= 128) realLength += 1;
            else realLength += 2;
        }
        return realLength;
    },
    success:function(msg){
        var ui_messageBox=this.uimessage_init(this.layer_tpl, this.success_tpl,msg);
        setTimeout(this.closeMessage,2000);
    },
    error:function(msg){
        var ui_messageBox=this.uimessage_init(this.layer_tpl, this.error_tpl,msg);        
        setTimeout(this.closeMessage,2000);
    },
    confirmmessage:function(msg,confirm_func,domsg){       
        var ui_messageBox =this.uimessage_init(this.layer_tpl, this.confirmmessage_tpl);
        ui_messageBox.children("div[tag=msg]").html(msg);
        if(M.isEmpty(domsg)){
        	domsg="确定";
        }
        ui_messageBox.children("div").children("a[tag=confirm]").html(domsg);
        if (typeof(eval(confirm_func)) == "function") {
        	 ui_messageBox.children("div").children("a[tag=confirm]").bind("click",confirm_func);
        }else{
        	 ui_messageBox.children("div").children("a[tag=confirm]").bind("click",this.closeMessage);
        }
         this.win_resize(ui_messageBox);       
    },   
    confirm:function(msg,confirm_func,cancle_func,domsg,canclemsg){        
        var ui_messageBox =this.uimessage_init(this.layer_tpl, this.confirm_tpl);
        ui_messageBox.children("div[tag=msg]").html(msg);
        if(M.isEmpty(domsg)){
        	domsg="确定";
        }
        if(M.isEmpty(canclemsg)){
        	canclemsg="取消";
        }
        if(M.isEmpty(canclemsg)||M.isEmpty(domsg)){
        	msg+='？';
        }
        ui_messageBox.children("div").children("a[tag=confirm]").html(domsg);
        ui_messageBox.children("div").children("a[tag=cancle]").html(canclemsg);
        ui_messageBox.children("div").children("a[tag=confirm]").bind("click",confirm_func);
        ui_messageBox.children("div").children("a[tag=cancle]").bind("click",cancle_func);
    },    
    closeMessage:function(){
        var ui_messageBox = $("#ui_message");
        var transparentlayer = $("#lightgraylayer");
        ui_messageBox.hide("3000",function(){
             ui_messageBox.removeClass('in');
             transparentlayer.hide();
        });
        transparentlayer.hide("1000",function(){
            ui_messageBox.hide();
        });
        ui_messageBox.remove();
        transparentlayer.remove();      
        
    }
});

function on_blur()
{
    if($(this).val()=="")
    {
        $(this).val($(this).attr("placeholder"));
    }
}
function on_focus()
{
    if($(this).val()==$(this).attr("placeholder"))
    {
        $(this).val("");
    }
}
function on_ready(ele)
{
    if(M.isEmpty($(ele).val()))
    {
        $(ele).val($(ele).attr("placeholder"));
    }
}
M.Controls.Ga =new M.createClass();
M.extend(M.Controls.Ga.prototype,
{
	init:function(){
		$('body').bind("click",this.body_click.toEventHandler(this));
		$('body').find('input[ga=input]').bind("focus",this.focusin.toEventHandler(this));
	},
	body_click:function(e){
		var ele = M.EventEle(e);    	
    	this.ga(ele);
	},
	focusin:function(e){
		var ele = M.EventEle(e);
    	this.ga(ele);
	},
	ga:function(ele){
		var gastatus=ele.attr("ga");
    	var gname=ele.attr("gname");
    	if(M.isEmpty(gastatus)||M.isEmpty(gname)){
    		return;
    	}
    	var cate='';
		if(gname.indexOf('order_')>=0){
    		var formtpl=ele.parents("div[tag=popform]");
    		var action=$("#ordercell").attr("action");
    		if(action=='add'){
    			gname=gname.replace('order_','预定_');
    			cate='预定';
    		}else if(action=='edit'){
    			gname=gname.replace('order_','修改_');
    			cate='修改';
    		}else{
    			gname=gname.replace('order_','补录_');
    			cate='补录';
    		}
    	}else{
    		if(gname.indexOf('_')>=0){
    			var cate_arr=gname.split('_');
    			cate=cate_arr[0];
    		}else{
    			cate='none';
    		}
    		
    	}
    	 var ga = window[window['GoogleAnalyticsObject'] || 'ga'];
	    if (ga){
		  ga('send', 'event', cate, 'click', gname,1);    	
	    }
	}
	
});
$(document).ready(function(){
    $("input[type=text][setplaceholder]").blur(on_blur);
    $("input[type=text][setplaceholder]").focus(on_focus);
    
    $("textarea[setplaceholder]").blur(on_blur);
    $("textarea[setplaceholder]").focus(on_focus);
    
    $("input[type=text][setplaceholder]").each(function(){
        on_ready($(this));
    });
    $("textarea[setplaceholder]").each(function(){
        on_ready($(this));
    });
    
    var tool = $('#header .tool a')
	var tool_active = $('#header .tool .active')
	tool.bind('mouseover',function(){
		if ($(this).hasClass('active'))
		{			
		}
		else
		{
		      $(this).addClass('hover')
		      tool_active.removeClass('hover')
		}
	  });
  tool.bind('mouseout',function(){
    $(this).removeClass('hover')
    tool_active.addClass('hover')
  });
    $("a[tag=closebtn]").click(function(){
        M.CloseLast();
        M.stopevent();
    }.toEventHandler(this));
   // var Gas=new M.Controls.Ga();
   // Gas.init();
 // 登录用户名
    $(".main-user").hover(function(){
       $(this).children('p').show();
       },function(){
       $(this).children('p').hide();          
       }); 
    $(".main-user").click(function(){
    	location.href='/Logout'
    });
    
});








