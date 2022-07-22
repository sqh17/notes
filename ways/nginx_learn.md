### nginx 学习笔记

##### 简介
nginx是俄罗斯人Igor Sysoev编写的轻量级Web服务器。
它不仅是一个高性能的HTTP和反向代理服务器，同时也是一个IMAP/POP3/SMTP 代理服务器
nginx只是一个静态文件服务器或者http请求转发器，它可以把静态文件的请求直接返回静态文件资源，把动态文件的请求转发给后台服务。

##### 特点
* 轻量
* 事件驱动的异步非阻塞处理
* 占用内存少、启动速度快、并发能力强
* 可靠
* 热部署：通过master管理进程与worker工作进程的分离设计，使的Nginx具有热部署的功能，那么在7×24小时不间断服务的前提下，升级Nginx的可执行文件。也可以在不停止服务的情况下修改配置文件，更换日志文件等功能
##### 应用
* 动静分离
    * 定义：将网站静态资源（HTML，JavaScript，CSS，img等文件）与后台应用分开部署，提高用户访问静态代码的速度，降低对后台应用访问
    * 优点：
        1. api接口服务化：动静分离之后，后端应用更为服务化，只需要通过提供api接口即可，可以为多个功能模块甚至是多个平台的功能使用，可以有效的节省后端人力，更便于功能维护
        2. 前后端开发并行：前后端只需要关心接口协议即可，各自的开发相互不干扰，并行开发，并行自测，可以有效的提高开发时间，也可以有些的减少联调时间
        3. 减轻后端服务器压力，提高静态资源访问速度：后端不用再将模板渲染为html返回给用户端，且静态服务器可以采用更为专业的技术提高静态资源的访问速度。
* 反向代理
    * 定义：指以代理服务器来接受internet上的连接请求，然后将请求转发给内部网络上的服务器，并将从服务器上得到的结果返回给internet上请求连接的客户端，此时代理服务器对外就表现为一个反向代理服务器。
    简单来说就是真实的服务器不能直接被外部网络访问，所以需要一台代理服务器，而代理服务器能被外部网络访问的同时又跟真实服务器在同一个网络环境，当然也可能是同一台服务器，端口不同而已。
    对于前端而言，请求后端的接口容易报跨域问题，这就是前端所处于的ip和后端接口的ip不一致，这就用到了反向代理，通过nginx将后端的接口改成浏览器是别的ip，（跨域除了nginx配置外，可以通过nodejs设置中转，后端设置白名单）
    反向代理是为服务端服务的，反向代理可以帮助服务器接收来自客户端的请求，帮助服务器做请求转发，负载均衡等。
    反向代理对服务端是透明的，对我们是非透明的，即我们并不知道自己访问的是代理服务器，而服务器知道反向代理在为他服务。
    * 关键命令：proxy_pass
    * 作用：
        1. 安全：隐藏服务节点的IP，将服务节点置于防火墙之后，避免直接攻击业务节点服务器
        2. 服务节点更专注于业务，同时提升性能（去让nginx实现gzip压缩，https等等；动静分离，缓存机制，）
    * 三种模式
* 正向代理
    * 定义：

    正向代理是为我们服务的，即为客户端服务的，客户端可以根据正向代理访问到它本身无法访问到的服务器资源。
    向代理对我们是透明的，对服务端是非透明的，即服务端并不知道自己收到的是来自代理的访问还是来自真实客户端的访问
* 负载均衡
    * 定义：简单而言就是当有2台或2台以上服务器时，根据规则随机的将请求分发到指定的服务器上处理，以来减轻服务器的压力。
    负载均衡配置一般都需要同时配置反向代理，通过反向代理跳转到负载均衡。
    * 关键命令: upstream
    * 作用：
        1. 分摊服务器集群压力
        2. 保证客户端访问的稳定性（nginx自带心跳检查，会定期轮询向所有的服务器发起请求，用来检查某个服务器是否异常，若有异常，则停止请求到这个服务器，直到这个服务器正常）
    * 策略：Nginx目前支持自带3种负载均衡策略，两种常见的第三方负载均衡策略
        1. 默认：按照时间一次分配到不同的机器上
            ```
            upstream test {
                server localhost:8080;
                server localhost:8081;
            }

            server {
                listen       80;                                                        
                server_name  localhost;                                              
                client_max_body_size 1024M;
                location / {
                    proxy_pass http://test;
                    proxy_set_header Host $host:$server_port;
                }
            }
            ```
        2. 权重 weight:指定轮询几率，weight和访问比率成正比，用于后端服务器性能不均的情况。
            ```
            upstream test {
                server localhost:8080 weight=9;  #请求的 90% 进入到8080服务器
                server localhost:8081 weight=1;  #请求的 10% 进入到8081服务器
            }
            ```
        3. ip_hash：每个请求按访问ip的hash结果分配，这样每个访客固定访问一个后端服务器，可以解决session的问题，通过session/cookie共享，来指定跳到对应有session/cookie的服务器，（如果客户已经访问了某个服务器，当用户再次访问时，会将该请求通过哈希算法，自动定位到该服务器。）
            ```
            upstream test {
                ip_hash;
                server localhost:8080 weight=9;  #请求的 90% 进入到8080服务器
                server localhost:8081 weight=1;  #请求的 10% 进入到8081服务器
            }
            ```
        4. fair（第三方）：按后端服务器的响应时间来分配请求，响应时间短的优先分配。
            ```
            upstream test {
                fair;
                server localhost:8080 weight=9;  #请求的 90% 进入到8080服务器
                server localhost:8081 weight=1;  #请求的 10% 进入到8081服务器
            }
            ```
        5. url_hash（第三方）：按访问url的hash结果来分配请求，使每个url定向到同一个（对应的）后端服务器，后端服务器为缓存时比较有效。
            ```
            upstream test {
                server squid1:3128;
                server squid2:3128;
                hash $request_uri;
                hash_method crc32;
            }
            ```
* 虚拟主机
    1. 虚拟主机就是将一台服务器分割成多个“虚拟服务器”，每个站点使用各自的硬盘空间，由于省资源，省钱，众多网站都使用虚拟主机来部署网站
    2. 虚拟主机的概念就是在web服务里的一个独立的网站站点，这个站点对应独立的域名（IP），具有独立的程序和资源目录，可以独立的对外提供服务
    3. 这个独立的站点配置是在nginx.conf中使用server{}代码块标签来表示一个虚拟主机
    4. Nginx支持多个server{}标签，即支持多个虚拟主机站点

##### nginx内置全局变量
以下都是nginx的内置全局变量，可以在配置的任何位置使用
* $host : 请求信息中的Host，若请求中没有host行，则等于设置的服务器名
* $request_mothed: 客户端的请求类型，如get/post/put
* $remote_addr: 客户端的ip
* $args: 请求中的参数
* $content_length: 请求头中的content-length字段
* $http_user_agent: 客户端的agent信息
* $http_cookie: 客户端的cookie信息
* $remote_port: 客户端的port端口
* $server_protocol: 请求使用的协议，如HTTP/1.0 HTTP/2.0
* $server_addr: 服务器地址
* $server_name: 服务器名称
* $server_port: 服务器的端口号

##### 代码示例
```
#运行用户
user nobody;
#启动进程,通常设置成和cpu的数量相等
worker_processes  1;

#全局错误日志及PID文件
#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#pid        logs/nginx.pid;

#工作模式及连接数上限
events {
    #epoll是多路复用IO(I/O Multiplexing)中的一种方式,
    #仅用于linux2.6以上内核,可以大大提高nginx的性能
    use   epoll; 

    #单个后台worker process进程的最大并发链接数    
    worker_connections  1024;

    # 并发总数是 worker_processes 和 worker_connections 的乘积
    # 即 max_clients = worker_processes * worker_connections
    # 在设置了反向代理的情况下，max_clients = worker_processes * worker_connections / 4  为什么
    # 为什么上面反向代理要除以4，应该说是一个经验值
    # 根据以上条件，正常情况下的Nginx Server可以应付的最大连接数为：4 * 8000 = 32000
    # worker_connections 值的设置跟物理内存大小有关
    # 因为并发受IO约束，max_clients的值须小于系统可以打开的最大文件数
    # 而系统可以打开的最大文件数和内存大小成正比，一般1GB内存的机器上可以打开的文件数大约是10万左右
    # 我们来看看360M内存的VPS可以打开的文件句柄数是多少：
    # $ cat /proc/sys/fs/file-max
    # 输出 34336
    # 32000 < 34336，即并发连接总数小于系统可以打开的文件句柄总数，这样就在操作系统可以承受的范围之内
    # 所以，worker_connections 的值需根据 worker_processes 进程数目和系统可以打开的最大文件总数进行适当地进行设置
    # 使得并发总数小于操作系统可以打开的最大文件数目
    # 其实质也就是根据主机的物理CPU和内存进行配置
    # 当然，理论上的并发总数可能会和实际有所偏差，因为主机还有其他的工作进程需要消耗系统资源。
    # ulimit -SHn 65535

}


http {
    #设定mime类型,类型由mime.type文件定义
    include    mime.types;
    default_type  application/octet-stream;
    #设定日志格式
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';
    #日志保存地址 格式代码 main
    access_log  logs/access.log  main;

    #sendfile 指令指定 nginx 是否调用 sendfile 函数（zero copy 方式）来输出文件，
    #对于普通应用，必须设为 on,
    #如果用来进行下载等应用磁盘IO重负载应用，可设置为 off，
    #以平衡磁盘与网络I/O处理速度，降低系统的uptime.
    sendfile     on;
    #tcp_nopush     on;

    #连接超时时间
    #keepalive_timeout  0;
    keepalive_timeout  65;
    tcp_nodelay     on;

    #开启gzip压缩
    gzip  on;
    gzip_disable "MSIE [1-6].";

    #设定请求缓冲
    client_header_buffer_size    128k;
    large_client_header_buffers  4 128k;


    #设定虚拟主机配置
    server {
        #侦听80端口
        listen    80;
        #定义使用 www.nginx.cn访问
        server_name  www.nginx.cn;

        #定义服务器的默认网站根目录位置
        root html;

        #设定本虚拟主机的访问日志
        access_log  logs/nginx.access.log  main;

        #默认请求
        location / {
            
            #定义首页索引文件的名称
            index index.php index.html index.htm;   

        }

        # 定义错误提示页面
        error_page   500 502 503 504 /50x.html;
        location = /50x.html {
        }

        #静态文件，nginx自己处理
        location ~ ^/(images|javascript|js|css|flash|media|static)/ {
            
            #过期30天，静态文件不怎么更新，过期可以设大一点，
            #如果频繁更新，则可以设置得小一点。
            expires 30d;
        }

        #PHP 脚本请求全部转发到 FastCGI处理. 使用FastCGI默认配置.
        location ~ .php$ {
            fastcgi_pass 127.0.0.1:9000;
            fastcgi_index index.php;
            fastcgi_param  SCRIPT_FILENAME  $document_root$fastcgi_script_name;
            include fastcgi_params;
        }

        #禁止访问 .htxxx 文件
            location ~ /.ht {
            deny all;
        }

    }
}
```

##### 参考资料
(8分钟带你深入浅出搞懂Nginx)[https://zhuanlan.zhihu.com/p/34943332]
(Nginx中文文档)[https://www.nginx.cn/doc/index.html]
(Nginx 教程)[https://www.cainiaojc.com/nginx/nginx-index.html]