  今天拿到了离职单，成为了失业人员一枚，收拾收拾心情，复习复习知识，开始面试之旅……
##### arr.indexOf()和arr.includes()的区别
    arr.indexOf() 查找某个元素的索引值，若有重复的，则返回第一个查到的索引值，若不存在，则返回 -1;
    arr.includes() 判断数中是否包含给定的值,若有，返回true，若没有则返回false。
    
    let arr = [1,2,3,NaN]
    arr.indexOf(NaN) 判断不了NaN，只返回 -1。而arr.includes(NaN) 返回true。

    let arr = new Array(3);
    arr.indexOf(undefined) 在数组为空的时候，判断不了undefined，只返回 -1；而arr.includes(undefined) 返回 true 

##### 第1个人10，第2个比第1个人大2岁，依次递推，请用递归方式计算出第8个人多大？
```javascript
function recursion(val) {
    if (val < 0) return 0;
    if (val == 1) return 10;
    if (val > 1)
        return recursion(val - 1) + 2
}
```

##### 随机数
```javascript
function Random(length) {
    length = length == null?10:length  // length为几位数，默认是个位数
    return parseInt(Math.random() * length) 
}
```

##### 获取URL的参数
    思路：
        1：先获取?到最后的字符串。str.slice()当参数为一个的时候，截取当前的值到最后；indexOf()得到的是当前数的索引
        2：如果有多个值（&），则化成数组
        3：遍历这个数组，将截取的第一个值作为对象的属性，截取的最后一个值作为该属性的值。
```javascript
function getURL(url) {
    let params = url.slice(url.indexOf('?') + 1),
        arr = params.indexOf('&') == -1 ? params.split() : params.split('&'),
        obj = {};
    for (var i = 0, len = arr.length; i < len; i++) {
        obj[arr[i].slice(0, arr[i].indexOf('='))] = arr[i].slice(arr[i].indexOf('=') + 1, arr[i].length - 1)
    }
    return obj
}
```

##### 除去前后的空格，兼容所有浏览器
```javascript
function trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
}
```

##### 将一个不超过5位数的阿拉伯数字转化成大写数字，20985 => 两万零九百八十五
```javascript
function transform(number){
    
}
```

##### AJAX
    Asynchronous Javascript And Xml  异步 JavaScript 和 XML
    是客户端/浏览器与服务器之间的中间层，实现了在不重新加载整个网页的情况下，对网页的某部分进行更新。
    readyState码：
        0：请求未初始化，实例已生成，但open()未调用。
        1：服务器连接已建立，send()未调用，但setRequestHeader()能设置。
        2：请求已接收，send()已实行。头信息和状态码已收到
        3：请求处理中。responsText已拿到。
        4：请求已完成，且响应已就绪
    state状态码：
        200：成功响应。
        301：永久重定向，在Location响应首部的值仍为当前URL(隐式重定向)。
        302：临时重定向，在Location响应首部的值仍为新的URL(显示重定向)。
        304：Not Modified 请求的资源没有改变 可以继续使用缓存。
        400：错误请求。
        401：未授权。
        403：禁止访问。
        404：资源未找到。
        500：服务器错误。
```javascript
function Ajax(type, url,data){
    let xhr = new XMLHttpRequest(); // 实例化对象
    xhr.open(type,url); // 设置请求行 type：get/post 
    xhr.setRequestHeader('Content-Type','Application/x-www-form-urlencoded'); //设置请求头
    xhr.send(data); // 设置请求体
    xhr.onreadystatechange = ()=>{
        if(status == 200 && readyState == 4){
            console.log(xhr.responseText);
        }
    }
}
```

##### flex
```CSS
    display:flex;
    justify-content:flex-start;   //往右边对齐
                    flex-end;    //往左边对齐
                    center;    // 项目中间对齐
                    space-between  // 两边对齐，项目之间的间隔都相等
                    space-around;  // 每个项目两侧的间隔相等。所以，项目之间的间隔比项目与边框的间隔大一倍  
    align-items:baseline;    // 与项目的第一行文字对齐
                flex-start;  
                flex-end;
                center;
                stretch;  // 默认 如果项目未设置高度或设为auto，将占满整个容器的高度
    flex-direction:row;   // 水平方向，从左往右
                   row-reverse; // 水平方向，从右往左
                   column;  // 垂直方向，从上往下
                   column-reverse; // 垂直方向，从下往上
    flex-wrap:no-wrap; // 默认，不换行
              wrap; // 换行
              wrap-reverse // 反向换行
    flex-flow:row wrap; // flex-direction和flex-wrap的缩写
    项目:
    order:项目的排列顺序，数越大越靠后，默认是0
    flex-grow:项目的放大比例。
    flex-shrink:项目的缩小比例。
    flex-basis:在分配多余空间之前，项目占据的水平上的空间
    flex:flex-grow+flex-shrink+flex-basis
    align-self 允许单个项目有与其他项目不一样的对齐方式，可覆盖align-items属性。默认值为auto，表示继承父元素align-items属性，如果没有父元素，则等同于stretch。只针对于垂直方向上的,水平方向上没有该属性。属性和align-items是的属性一样，多了一个auto。
```

##### 九九乘法表
```javascript
function multiplication(){
   for (var i = 1; i < 10; i++) {
        for (var j = 1; j < 10; j++) {
            document.write(`${i} * ${j} = ${i * j} &nbsp;`);
            if (i == j) {
                document.write("<br/>");
                break;
            }
        }
    }
}
```

##### session和cookie的区别

    1、cookie数据存放在客户的浏览器上，session数据放在服务器上。
    2、cookie不是很安全，别人可以分析存放在本地的COOKIE并进行COOKIE欺骗,考虑到安全应当使用session。
    3、session会在一定时间内保存在服务器上。当访问增多，会比较占用你服务器的性能,考虑到减轻服务器性能方面，应当使用COOKIE。
    4、单个cookie保存的数据不能超过4K，很多浏览器都限制一个站点最多保存20个cookie。

##### es6的一个方法实现对象copy
    Object.assign(target, source)  // target为目标对象，source为源对象，可以多个
    ```只能实现浅复制```
    tip: 如果目标对象与源对象有同名属性，则后面的属性会覆盖前面的属性
         如果只有一个参数，则直接返回该参数。即Object.assign(obj) === obj
         如果第一个参数不是对象，而是基本数据类型（Null、Undefined除外），则会调用对应的基本包装类型
         如果第一个参数是Null和Undefined，则会报错；如果Null和Undefined不是位于第一个参数，则会略过该参数的复制  
##### 实现对象的深拷贝
```javascript
  function deepClone(obj){
    let objClone = Array.isArray(obj)?[]:{};
    if(obj && typeof obj==="object"){
        for(key in obj){
            if(obj.hasOwnProperty(key)){
                //判断ojb子元素是否为对象，如果是，递归复制
                if(obj[key]&&typeof obj[key] ==="object"){
                    objClone[key] = deepClone(obj[key]);
                }else{
                    //如果不是，简单复制
                    objClone[key] = obj[key];
                }
            }
        }
    }
    return objClone;
}    
```
##### 给一个整数列，找出和为特定值的所有的数
```javascript
    function findNum(arr,sum){
        var newArr = [];
            
        for(var i = 0;i<arr.length;i++){
            for(var j = i+1;j<arr.length;j++){
                var obj={one:'',two:''};
                if(arr[i] + arr[j] == sum){
                    obj.one = arr[i];
                    obj.two = arr[j];
                    newArr.push(obj)
                }
            }
        }
        return newArr
    }
```
##### vue之间组件传递有几种方法
    父组件->子组件
##### 不用vue-router如何实现两个表单之间的切换（向导）

##### 小程序组件之间数值是怎么传递的

##### 将2rem换算成200px
```css
    html{
        font-size:100px;
    }
    div{
        width:2rem;
    }
```
```javascript
    (function(doc, win, width) {   // width为设计稿的宽度
        var docEl = doc.documentElement,
            resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
            recalc = function() {
                var clientWidth = docEl.clientWidth;　　
                if (!clientWidth) return;
                docEl.style.fontSize = 100 * (clientWidth / (width / 2)) + 'px';
            };

        if (!doc.addEventListener) return;
        win.addEventListener(resizeEvt, recalc, false);
        doc.addEventListener('DOMContentLoaded', recalc, false);
    })(document, window, 750);
```

##### 在已知的对象上对方法进行扩充

##### 每隔几秒实行一次并发，有哪几种方法
    定时器（setInterval。setTimeout）
    promise
    aysnc/await
##### 后台接受post数据有哪几种方法
    1 application/x-www-form-urlencoded
    2 multipart/formdata
    3 application/json
    4 text/xml
##### vuex有哪些模块

##### 用字符串方法对一个字符串“abbbcddbqab”删掉字母b
```javascript
    function deletStr(str,s){
        return str.replace(/s/g,'');
    }
```
##### 用正则方法判断用户输入的网址是否有.com,.cn,.net的合法性
```javascript
    function judgeUrl(url){
        return /\.com|\.cn|\.net$/.test(url)
    }
    
```


