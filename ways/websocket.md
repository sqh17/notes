#### websocket 定义
WebSocket 是一种网络通信协议，是 HTML5 开始提供的一种在单个 TCP 连接上进行全双工通讯的协议。什么是全双工通讯呢，就是在tcp连接上两方都能随时都能请求响应，可以想象一下聊天室的群聊。
ps:什么是单工、半双工、全工通信？
* 信息只能单向传送为单工；
* 信息能双向传送但不能同时双向传送称为半双工；
* 信息能够同时双向传送则称为全双工。

允许服务端主动向客户端推送数据。在 WebSocket API 中，浏览器和服务器只需要完成一次握手，两者之间就直接可以创建持久性的连接，并进行双向数据传输。

#### websocket与http的区别
相同点：两者都是一种通讯协议，都是基于 TCP 协议来传输数据的。
区别就是：
* http传输接收信息时都需要每次都要三次握手和四次挥手。websocket是在一次握手之后，http升级为websocket，之后就不需要握手了。
* WebSocket是需要客户端和服务器握手进行建立连接的。而http是客户端发起向服务器的连接，服务器预先并不知道这个连接。

在客户端断开WebSocket连接或Server端中断连接前，不需要客户端和服务端重新发起连接请求。在海量并发及客户端与服务器交互负载流量大的情况下，极大的节省了网络带宽资源的消耗，有明显的性能优势，且客户端发送和接受消息是在同一个持久连接上发起，实时性优势明显。

#### websocket与socket的区别
Socket不是一个协议。它工作在 OSI 模型会话层（第5层），是为了方便大家直接使用更底层协议（一般是 TCP 或 UDP ）而存在的一个抽象层。
摘录一段大白话文：（https://blog.zengrong.net/post/2199.html）
Socket是应用层与TCP/IP协议族通信的中间软件抽象层，它是一组接口。在设计模式中，Socket其实就是一个门面模式，它把复杂的TCP/IP协议族隐藏在Socket接口后面，对用户来说，一组简单的接口就是全部，让Socket去组织数据，以符合指定的协议。
而 WebSocket 则不同，它是一个完整的应用层协议，包含一套标准的API。

#### websocket链接过程
* 1 客户端发起http请求，经过3次握手后，建立起TCP连接；
* 2 搜索到ws符号，升级协议，http请求里存放WebSocket支持的版本号等信息，如：Upgrade、Connection、WebSocket-Version等；
* 2 服务器收到客户端的握手请求后，同样采用HTTP协议回馈数据；
* 3 客户端收到连接成功的消息后，开始借助于TCP传输信道进行全双工通信。

#### 代码实现

##### 客户端
websocket是一个构造函数，需要实例化一个对象，
``WebSocket(url[, protocols])`` 
* url为服务器的地址
* protocols 可接受的子协议，可选
##### 属性：
Socket.readyState：只读属性 readyState 表示连接状态
 * 0 - 表示连接尚未建立 （The connection has not yet been established.）
 * 1 - 表示连接已建立，可以进行通信 （The WebSocket connection is established and communication is possible.）
 * 2 - 表示连接正在进行关闭。（The connection is going through the closing handshake.）
 * 3 - 表示连接已经关闭或者连接不能打开（The connection has been closed or could not be opened.）

对此，可以通过readyState进行判断，并响应的回调。

##### 事件
* onopen 连接建立时触发
* onmessage 客户端接收服务端数据时触发
* onerror 通信发生错误时触发
* onclose 连接关闭时触发

##### 方法
* send 向服务端发送数据
* close 关闭连接

##### 兼容性
既然是html5的新特性，避免不了兼容性，不过可以通过插件来实现兼容

##### 代码实现
html代码：
```html
<body>
  <div class="container">
    <div class="content">
      <!-- <div class="list">
        <div class="section">123123</div>
      </div>
      <div class="list">
        <div class="section">123123</div>
      </div>
      <div class="list">
        <div class="section">123123</div>
      </div> -->
    </div>
    <div class="control">
      <input id="input" type="text" />
      <div class="send-btn">Send</div>
    </div>
  </div>
  <script src="index.js"></script>
</body>
```
js代码：
```javascript
var content = document.querySelector(".content");
var btn = document.querySelector(".send-btn");
var ipt = document.querySelector("#input");

//语法 var Socket = new WebSocket(url, [protocol] );
var ws = new WebSocket("ws://127.0.0.1:1337");
//连接建立时触发
ws.onopen = function(e) {
  console.log("Connection open ...");
  if(ws.readyState == '1'){
    console.log('可以通信了')
  }else if(ws.readyState == '0'){
    console.log('0')
  }
};
//接收消息时触发
ws.onmessage = function(e) {
  console.log("Received Message: " + evt.data);
  content.innerHTML +=
    `<div class="list"><div class="section">${e.data}</div></div>`;
  content.scrollTop = content.scrollHeight;
};
//关闭连接触发
ws.onclose = function(e) {
  console.log("Connection closed.");
};
//通信发生错误时触发
ws.onerror = function(e) {
  console.log("Connection Error.");
};
//检查浏览器是否支持WebSocket
if (typeof WebSocket == "undefined") {
  alert("您的浏览器不支持 WebSocket!");
}


btn.onclick = function() {
  var message = ipt.value;
  ws.send(message) // 向服务端发送数据
  ipt.value = "";
  content.scrollTop = content.scrollHeight;
};
```

客户端的页面代码在demo中，可以下载查看学习。

##### 服务端（Node）
