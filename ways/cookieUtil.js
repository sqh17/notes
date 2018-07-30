(function() {
    var tool = {
        maxage: "max-age", // 过期时间expires
        path: "path",  // 路径
        domain: "domain", // 域
        secure: "secure" // 安全设置 bool
    };
    function setCookie(k, v, options) {
        if (!options) {
            document.cookie = k + "=" + v;
        } else {
            var tmp = [];
            for (var key in options) {
                // { path='/', domain='baidu.com' }
                tmp.push(tool[key] + "=" + options[key]); //将tool的内容放到新数组中
            }
            document.cookie = k + "=" + v + "; " + tmp.join("; ");// 设置cookie
        }
    }

    function getCookie(k) {
        var strCookie = document.cookie;// 获取cookie
        // 形如: 'k=v; k=v; k=v; k=v'
        var kvs = strCookie.split(";").map(v => v.trim());// 除去空格并化成数组
        var objCookie = {};

        kvs.forEach(v => {
            var kv = v.split("=");
            objCookie[kv[0]] = kv[1];
        });
        return objCookie[k];//根据k获取kv
    }

    var cookieUtil = function(key, value, options) {
        if (!value) {
            return getCookie(key);// 没有传参, 得到数据
        } else {
            setCookie(key, value, options);
        }
    };

    window.cookieUtil = cookieUtil;
})();
