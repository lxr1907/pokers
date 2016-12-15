/**
 * Created by ausu on 2016/11/28.
 */
function fullScreen(id) {
    var element = document.getElementById(id),method = "RequestFullScreen";
    var prefixMethod;
    ["webkit", "moz", "ms", "o", ""].forEach(function(prefix) {
            if (prefixMethod)
                return;
            if (prefix === "") {
                // 无前缀，方法首字母小写
                method = method.slice(0,1).toLowerCase() + method.slice(1);
            }
            var fsMethod = typeof element[prefix + method];
            if (fsMethod + "" !== "undefined") {
                // 如果是函数,则执行该函数
                if (fsMethod === "function") {
                    prefixMethod = element[prefix + method]();
                } else {
                    prefixMethod = element[prefix + method];
                }
            }
        }
    );
    return prefixMethod;
}