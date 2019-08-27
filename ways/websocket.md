#### 一 websocket 定义
WebSocket 是一种网络通信协议，是 HTML5 开始提供的一种在单个 TCP 连接上进行全双工通讯的协议。什么是全双工通讯呢，就是在tcp连接上两方都能随时都能请求响应，可以想象一下聊天室的群聊。
ps:什么是单工、半双工、全工通信？
* 信息只能单向传送为单工；
* 信息能双向传送但不能同时双向传送称为半双工；
* 信息能够同时双向传送则称为全双工。

允许服务端主动向客户端推送数据。在 WebSocket API 中，浏览器和服务器只需要完成一次握手，两者之间就直接可以创建持久性的连接，并进行双向数据传输。

#### 二 websocket与http的区别
相同点：两者都是一种通讯协议，都是基于 TCP 协议来传输数据的。
区别就是：
* http传输接收信息时都需要每次都要三次握手和四次挥手。websocket是在一次握手之后，http升级为websocket，之后就不需要握手了。
* WebSocket是需要客户端和服务器握手进行建立连接的。而http是客户端发起向服务器的连接，服务器预先并不知道这个连接。

在客户端断开WebSocket连接或Server端中断连接前，不需要客户端和服务端重新发起连接请求。在海量并发及客户端与服务器交互负载流量大的情况下，极大的节省了网络带宽资源的消耗，有明显的性能优势，且客户端发送和接受消息是在同一个持久连接上发起，实时性优势明显。

#### 三 websocket与socket的区别
Socket不是一个协议。它工作在 OSI 模型会话层（第5层），是为了方便大家直接使用更底层协议（一般是 TCP 或 UDP ）而存在的一个抽象层。
摘录一段大白话文：（https://blog.zengrong.net/post/2199.html）
Socket是应用层与TCP/IP协议族通信的中间软件抽象层，它是一组接口。在设计模式中，Socket其实就是一个门面模式，它把复杂的TCP/IP协议族隐藏在Socket接口后面，对用户来说，一组简单的接口就是全部，让Socket去组织数据，以符合指定的协议。
而 WebSocket 则不同，它是一个完整的应用层协议，包含一套标准的API。

#### 四 websocket链接过程
* 1 客户端发起http请求，经过3次握手后，建立起TCP连接；
* 2 搜索到ws符号，升级协议，http请求里存放WebSocket支持的版本号等信息，如：Upgrade、Connection、WebSocket-Version等；
* 2 服务器收到客户端的握手请求后，同样采用HTTP协议回馈数据；
* 3 客户端收到连接成功的消息后，开始借助于TCP传输信道进行全双工通信。

#### 五 代码实现

##### 1 客户端
websocket是一个构造函数，需要实例化一个对象，
``WebSocket(url[, protocols])`` 
* url为服务器的地址
* protocols 可接受的子协议，可选
###### 1.1 属性：
Socket.readyState：只读属性 readyState 表示连接状态
 * 0 - 表示连接尚未建立 （The connection has not yet been established.）
 * 1 - 表示连接已建立，可以进行通信 （The WebSocket connection is established and communication is possible.）
 * 2 - 表示连接正在进行关闭。（The connection is going through the closing handshake.）
 * 3 - 表示连接已经关闭或者连接不能打开（The connection has been closed or could not be opened.）

对此，可以通过readyState进行判断，并响应的回调。

###### 1.2 事件
* onopen 连接建立时触发
* onmessage 客户端接收服务端数据时触发
* onerror 通信发生错误时触发
* onclose 连接关闭时触发

###### 1.3 方法
* send 向服务端发送数据
* close 关闭连接

###### 1.4 兼容性
既然是html5的新特性，避免不了兼容性，不过可以通过插件来实现兼容

###### 1.5 代码实现
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

##### 2 服务端（Node）
一开始实践时，看着教程实现了简易聊天室，用的是socketIO插件，很好奇原生是怎样实现的，所以本文用的是原生Websocket实现超简单版的简易聊天室，没有做很多的优化和逻辑实现，只是单纯的实现原理，废话不多说了，开始～

###### 2.1 步骤：
简要步骤如下：
* 创建一个http服务，并开启服务，监听端口。
* 在这个服务中，用upgrade事件升级为websocket。
* 设置特殊的请求头，计算Sec-WebSocket-Key。
* 创建Websocket构造函数

再详细些：
先创建并开启http服务
```javascript
const http = require('http')
const path = require('path')
const fs = require('fs')
const url = require('url')
var util = require("util");
var server = http.createServer((req,res)=>{
  let {pathname} = url.parse(req.url)
  let raw = fs.createReadStream(path.resolve(__dirname,pathname.replace(/^\//,''))) // 利用stream读取文件，提升效率
  raw.on('error',(err)=>{ // 没有对应文件时
    console.log(err)
    if(err.code === 'ENOENT'){
      res.writeHeader(404,{'content-type':'text/html;charset="utf-8"'})
      res.write('<h1>404错误</h1><p>你找的页面不存在</p>');
      res.end()
    }
  })
  res.writeHead(200,{})
  raw.pipe(res)
})  

server.listen(1337,'127.0.0.1',()=>{
  console.log('server opening')
})
```
客户端发起协议升级请求。这个请求和通常的 HTTP 请求不同，包含了一些附加头信息，其中附加头信息"Upgrade: WebSocket"表明这是一个申请协议升级的 HTTP 请求。如下：
```
GET / HTTP/1.1
Host: localhost:8080
Origin: http://127.0.0.1:1337
Connection: Upgrade  // 表示要升级协议
Upgrade: websocket // 表示要升级到websocket协议。
Sec-WebSocket-Version: 13 // 表示websocket的版本。如果服务端不支持该版本，需要返回一个Sec-WebSocket-Versionheader，里面包含服务端支持的版本号。
Sec-WebSocket-Key: qbv0O6xaTi36lq3RNcgctw== // 与后面服务端响应首部的Sec-WebSocket-Accept是配套的，提供基本的防护，比如恶意的连接，或者无意的连接。
```

ps：上面的请求不是很全，还会有其他的和http一样的host、origin、cookie。
```javascript
//  http握手成功后，升级协议,会触发upgrade
server.on('upgrade',(req,socket,upgradeHead)=>{
  var key = req.headers['sec-websocket-key'] // 因为升级协议，能拿到请求头中key
  key = crypto.createHash("sha1").update(key + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11").digest("base64"); 
  var headers = [
    'HTTP/1.1 101 Switching Protocols',
    'Upgrade: websocket',
    'Connection: Upgrade',
    'Sec-WebSocket-Accept: ' + key
  ];
  socket.setNoDelay(true);
  socket.write(headers.join("\r\n") + "\r\n\r\n", 'ascii');
})
```

`上述代码中的Sec-WebSocket-Accept根据客户端请求首部的Sec-WebSocket-Key计算出来。`


之后 服务端返回内容如下，状态代码101表示协议切换。到此完成协议升级，后续的数据交互都按照新的协议来。

```
Request URL: ws://127.0.0.1:1337/
Request Method: GET
Status Code: 101 Switching Protocols
Connection: Upgrade
Sec-WebSocket-Accept: Jd+Og2IME1QWEKi2M3QWNJ22gLM=
Upgrade: websocket
```

这样就代表转换成功，再往下就是编写websocket方法了。

但首先先了解一下websocket的数据帧格式，这数据帧的详解，我摘自这位博主`程序猿小卡_casper`的[文段](https://segmentfault.com/a/1190000012709475),这篇文章关于websocket写的很棒，可以去看看。
WebSocket客户端、服务端通信的最小单位是帧（frame），由1个或多个帧组成一条完整的消息（message）。
* 发送端：将消息切割成多个帧，并发送给服务端；
* 接收端：接收消息帧，并将关联的帧重新组装成完整的消息；
```
  0                   1                   2                   3
  0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
 +-+-+-+-+-------+-+-------------+-------------------------------+
 |F|R|R|R| opcode|M| Payload len |    Extended payload length    |
 |I|S|S|S|  (4)  |A|     (7)     |             (16/64)           |
 |N|V|V|V|       |S|             |   (if payload len==126/127)   |
 | |1|2|3|       |K|             |                               |
 +-+-+-+-+-------+-+-------------+ - - - - - - - - - - - - - - - +
 |     Extended payload length continued, if payload len == 127  |
 + - - - - - - - - - - - - - - - +-------------------------------+
 |                               |Masking-key, if MASK set to 1  |
 +-------------------------------+-------------------------------+
 | Masking-key (continued)       |          Payload Data         |
 +-------------------------------- - - - - - - - - - - - - - - - +
 :                     Payload Data continued ...                :
 + - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - +
 |                     Payload Data continued ...                |
 +---------------------------------------------------------------+
```
针对上面的的格式概览图，这里逐个字段进行讲解：
* FIN：1个比特。
    如果是1，表示这是消息（message）的最后一个分片（fragment），如果是0，表示不是是消息（message）的最后一个分片（fragment）。
* RSV1, RSV2, RSV3：各占1个比特。
    一般情况下全为0。当客户端、服务端协商采用WebSocket扩展时，这三个标志位可以非0，且值的含义由扩展进行定义。如果出现非零的值，且并没有采用WebSocket扩展，连接出错。
* Opcode: 4个比特。
    操作代码，Opcode的值决定了应该如何解析后续的数据载荷（data payload）。如果操作代码是不认识的，那么接收端应该断开连接（fail the connection）。可选的操作代码如下：
      * %x0：表示一个延续帧。当Opcode为0时，表示本次数据传输采用了数据分片，当前收到的数据帧为其中一个数据分片。
      * %x1：表示这是一个文本帧（frame）
      * %x2：表示这是一个二进制帧（frame）
      * %x3-7：保留的操作代码，用于后续定义的非控制帧。
      * %x8：表示连接断开。
      * %x9：表示这是一个ping操作。
      * %xA：表示这是一个pong操作。
      * %xB-F：保留的操作代码，用于后续定义的控制帧。
* Mask: 1个比特。
    表示是否要对数据载荷进行掩码操作。从客户端向服务端发送数据时，需要对数据进行掩码操作；从服务端向客户端发送数据时，不需要对数据进行掩码操作。
    如果服务端接收到的数据没有进行过掩码操作，服务端需要断开连接。
    如果Mask是1，那么在Masking-key中会定义一个掩码键（masking key），并用这个掩码键来对数据载荷进行反掩码。所有客户端发送到服务端的数据帧，Mask都是1。
    掩码键（Masking-key）是由客户端挑选出来的32位的随机数。掩码操作不会影响数据载荷的长度。掩码、反掩码操作都采用如下算法：

    首先，假设：

    * original-octet-i：为原始数据的第i字节。
    * transformed-octet-i：为转换后的数据的第i字节。
    * j：为i mod 4的结果。
    * masking-key-octet-j：为mask key第j字节。
  
  <font color="#555">算法描述为： original-octet-i 与 masking-key-octet-j 异或后，得到 transformed-octet-i。</font>

      j = i MOD 4
      transformed-octet-i = original-octet-i XOR masking-key-octet-j


###### 2.2 代码编写

* 1 创建一个构造函数，用来实例化，因为每个客户端请求服务时，都会调用一个实例。
  ```javascript
    function WebSocket(socket) {
      this.socket = socket;
    }
  ```
* 2 由上述的数据帧格式可知，websocket在传输接收时有对应的格式，所以先对数据进行解析(参考网上的)
  ```javascript
    /**
    * 解析接收到的数据
    * @param  {Object} data 为socket的数据
    * @return {String} 解析后得到的数据
    */
    function decodeWsFrame(data) {
      let start = 0;
      let frame = {
        isFinal: (data[start] & 0x80) === 0x80,
        opcode: data[start++] & 0xF,
        masked: (data[start] & 0x80) === 0x80,
        payloadLen: data[start++] & 0x7F,
        maskingKey: '',
        payloadData: null
      };

      if (frame.payloadLen === 126) {
        frame.payloadLen = (data[start++] << 8) + data[start++];
      } else if (frame.payloadLen === 127) {
        frame.payloadLen = 0;
        for (let i = 7; i >= 0; --i) {
          frame.payloadLen += (data[start++] << (i * 8));
        }
      }

      if (frame.payloadLen) {
        if (frame.masked) {
          const maskingKey = [
            data[start++],
            data[start++],
            data[start++],
            data[start++]
          ];

          frame.maskingKey = maskingKey;

          frame.payloadData = data
            .slice(start, start + frame.payloadLen)
            .map((byte, idx) => byte ^ maskingKey[idx % 4]);
        } else {
          frame.payloadData = data.slice(start, start + frame.payloadLen);
        }
      }

      // console.dir(frame)
      return frame;
    }
  ```
  * 3 对发送的数据进行编码(参考网上的)
  ```javascript
    /**
    * 对要发送的数据进行编码
    * @param  {String} message 要发送的数据
    * @return {Buffer}
    */
    function encodeWsFrame(message) {
      
      message = String(message);
      var length = Buffer.byteLength(message);

      if (!length) return;

      //数据的起始位置，如果数据长度16位也无法描述，则用64位，即8字节，如果16位能描述则用2字节，否则用第二个字节描述
      var index = 2 + (length > 65535 ? 8 : (length > 125 ? 2 : 0));

      //定义buffer，长度为描述字节长度 + message长度
      var buffer = Buffer.alloc(index + length);

      //第一个字节，fin位为1，opcode为1
      buffer[0] = 129;

      //因为是由服务端发至客户端，所以无需masked掩码
      if (length > 65535) {
        buffer[1] = 127;

        //长度超过65535的则由8个字节表示，4个字节能表达的长度为4294967295，直接将前面4个字节置0
        buffer.writeUInt32BE(0, 2);
        buffer.writeUInt32BE(length, 6);
      } else if (length > 125) {
        buffer[1] = 126;

        //长度超过125的话就由2个字节表示
        buffer.writeUInt16BE(length, 2);
      } else {
        buffer[1] = length;
      }

      //写入正文
      buffer.write(message, index);
      return buffer;
    }
  ```

  * 4 创建一个数组，用来存储每一个启用服务的客户端
  ```javascript
  var webSocketCollector = [];
  ```
  * 5 编写分发数据的方法
  ```javascript
  function brocast(msg) {
    webSocketCollector.forEach(function(ws) {
      ws.socket.write(msg);
    })
  }
  ```
  * 6 在upgrade事件里创建实例化，每当创建一个实例化对象时，存进webSocketCollector，调用data方法，分发数据。
  ```javascript
  var ws = new WebSocket(socket); // 实例化ws
  webSocketCollector.push(ws)
  ws.socket.on('data', function(data) { 
    brocast(encodeWsFrame(decodeWsFrame(data).payloadData.toString())) // 可以打印查看编码和解码的结果
  });
  ```
  * 7 启动服务，浏览器打开http://127.0.0.1:1337/index.html 可以用每个浏览器充当每个客户端。查看效果