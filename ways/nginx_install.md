# linux服务器安装nginx步骤以及问题解决

#### 安装必备插件

1. gcc是linux下的编译器

`yum -y install gcc`

2. pcre是一个perl库，包括perl兼容的正则表达式库，nginx的http模块使用pcre来解析正则表达式，所以需要安装pcre库

`yum install -y pcre pcre-devel`

3. zlib库提供了很多种压缩和解压缩方式nginx使用zlib对http包的内容进行gzip

`yum install -y zlib zlib-devel`

4. openssl是web安全通信的基石，没有openssl，可以说我们的信息都是在裸奔

`yum install -y openssl openssl-devel`

eg: 查看系统中是否安装过以上插件

* gcc -v  #查看服务器gcc版本
* openssl version  #查看openssl的版本
* rpm -qa |grep pcre  #查看系统中是否安装了pcre

#### 步骤

1. 下载nginx压缩包
先进入到想存放的文件目录，一般是存放到/usr/local目录下，有两种方式，(本次采用第二种方式，第一种方式方法放到最后的拓展中)

    1. 去[官网](http://nginx.org/download/)下载对应的nginx包，通过上传文件的方式，上传到服务器下
    2. 直接通过wget命令下载(在哪个路径下下载就是在在哪个路径下)
    `wget -c https://nginx.org/download/nginx-1.14.0.tar.gz`

2. 解压nginx压缩包

`tar -zxvf nginx-1.14.0.tar.gz`
（解压后当前的压缩包会被清空）
然后进入到解压后的文件下
`cd nginx-1.14.0`
配置
（注意！这里有一个坑，一般是使用默认配置，即输入./configure 就好了，但是如果你需要使用https支持，则需要加上SLL模块，否则会出现如下报错
`nginx: [emerg] the "ssl" parameter requires ngx_http_ssl_module in /usr/local/nginx/conf/nginx.conf:37
`
）

`./configure --with-http_ssl_module`

3. 编译安装

`make`
`make install`

4. 启动nginx

进入到 /usr/local/nginx/sbin 文件夹下
`cd /usr/local/nginx/sbin`
输入./nginx即可启动nginx
启动：`./nginx`
停止：`./nginx -s stop`
重启：`./nginx -s reload`
查看进程：`ps aux|grep nginx`

5. 建立软连接

这个有个不足点，就是每次必须进到/usr/local/nginx/sbin文件夹才能操作nginx，可以建立软连接，就是建立快捷方式,这样可以在任何地方调用nginx

`ln -sv /usr/local/nginx/sbin/nginx /usr/bin/nginx`

#### 知识解答

1. make/make install
就是在实行.configure这一指令后，才可以make，make install

* .configure，生成Makefile文件。（指定安装路径；自动设定源程序以符合各种不同平台上Unix系统的特性）

    `
      ./configure \
      --prefix=/usr/local/nginx \
      --pid-path=/var/run/nginx/nginx.pid \
      --lock-path=/var/lock/nginx.lock \
      --error-log-path=/var/log/nginx/error.log \
      --http-log-path=/var/log/nginx/access.log \
      --with-http_gzip_static_module \
      --http-client-body-temp-path=/var/temp/nginx/client \
      --http-proxy-temp-path=/var/temp/nginx/proxy \
      --http-fastcgi-temp-path=/var/temp/nginx/fastcgi \
      --http-uwsgi-temp-path=/var/temp/nginx/uwsgi \
      --http-scgi-temp-path=/var/temp/nginx/scgi \--with-http_stub_status_module \--with-http_ssl_module \--with-file-aio \--with-http_realip_module
    `
* make，编译，生成执行文件。（执行Makefile里的代码，将源代码编译成可执行文件。）

    若没有Makefile文件，执行make会报错
    `make: *** No targets specified and no makefile found. Stop.`
* make install，将可执行文件、依赖包复制到相应的路径下。

make 命令行

* make all：编译程序、库、文档等（等同于make）
* make install：安装已经编译好的程序。复制文件树中到文件到指定的位置
* make uninstall：卸载已经安装的程序。
* make clean：删除由make命令产生的文件
* make distclean：删除由./configure产生的文件
* make check：测试刚刚编译的软件（某些程序可能不支持）
* make installcheck：检查安装的库和程序（某些程序可能不支持）
* make dist：重新打包成packname-version.tar.gz

2. tar
tar 命令 对文件打包压缩或解压
tar [选项] [文件] //格式

* tar -c //创造压缩文件
* tar -x // 解开压缩文件
* tar -t //查看压缩包内有那些文件
* tar -z //用Gzip压缩或解压
* tar -j //用bzip2 压缩或解压
* tar -v //显示压缩或解压缩的过程
* tar -f //目标文件名
* tar -p //小P是保留原始的权限与属性
* tar -P // 大P使用绝对路径来压缩
* tar -C //指定解压到的目录
注意；-c 与 -x 这两个参数不可以同时使用

3. ln
链接，link的缩写
ln命令用于创建链接文件，链接文件又可以分为软链接和硬链接文件，这两者的区别主要是：
    1. 硬链接其实是创建了一个指向文件的节点（inode）（源文件的节点数加1了），我们可以把硬链接理解成源文件的一个备份副本，硬链接可以有效的防止文件被删除，因为在Linux系统中，删除一个文件的实质是删除该文件的节点（inode）信息，从而切断了节点与文件之间的联系，当给一个文件创建硬链接后，删除文件时，只会减少文件的节点数，当节点数为0时，文件才彻底的被删除了。而软链接不同，软链接类似于windows中的快捷方式，当删除了源文件后，软链接的指向就失效了。
    2. 大小不一样。硬链接文件的内容和源文件的内容是一样的，所所以硬链接文件大小和源文件大小是一样的；而软链接文件中的内容仅仅是源文件的文件名，即仅仅是保存了源文件名而已，所以软件链接文件大小一般是4KB ，即一个节点的大小。
    3. 硬链接不能跨目录、跨分区做链接，而软链接无要求，既可以跨目录还可以跨分区做软链接。
    4. 创建硬链接直接使用 ln 命令，不要加参数，创建软链接使用 ln -s 命令，-s表示符号链接，即软链接

示例：
`ln -s /usr/local/node/bin/node /bin/node`
就是访问/usr/local/node/bin/node可以通过/bin/node来访问

#### 报错以及处理

在实行make的时候导致报错，经过查阅，说是服务器版本过高，和nginx版本不兼容。换个高版本的nginx也可以解决。先记录下当前报错信息以及解决方式

1.

    ```
      src/os/unix/ngx_user.c: In function ‘ngx_libc_crypt’:
      src/os/unix/ngx_user.c:26:7: error: ‘struct crypt_data’ has no member named ‘current_salt’
        cd.current_salt[0] = ~salt[0];
          ^

    ```
  解决方案：进入到src/os/unix/ngx_user.c，找到对应的代码段，将那一行进行注释

  `vi  src/os/unix/ngx_user.c`

  `/* cd.current_salt[0] = ~salt[0]; */`
  保存后在nginx-1.14.0目录下再进行 make

2.

    ```
      src/http/ngx_http_script.c: In function ‘ngx_http_script_add_copy_code’:
      src/http/ngx_http_script.c:698:18: error: cast between incompatible function types from ‘size_t (*)(ngx_http_script_engine_t *)’ {aka ‘long unsigned int (*)(struct <anonymous> *)’} to ‘void (*)(ngx_http_script_engine_t *)’ {aka ‘void (*)(struct <anonymous> *)’} [-Werror=cast-function-type]
          code->code = (ngx_http_script_code_pt) ngx_http_script_copy_len_code;
                        ^
      src/http/ngx_http_script.c: In function ‘ngx_http_script_add_var_code’:
      src/http/ngx_http_script.c:787:18: error: cast between incompatible function types from ‘size_t (*)(ngx_http_script_engine_t *)’ {aka ‘long unsigned int (*)(struct <anonymous> *)’} to ‘void (*)(ngx_http_script_engine_t *)’ {aka ‘void (*)(struct <anonymous> *)’} [-Werror=cast-function-type]
          code->code = (ngx_http_script_code_pt) ngx_http_script_copy_var_len_code;
                        ^
      src/http/ngx_http_script.c: In function ‘ngx_http_script_add_capture_code’:
      src/http/ngx_http_script.c:1181:18: error: cast between incompatible function types from ‘size_t (*)(ngx_http_script_engine_t *)’ {aka ‘long unsigned int (*)(struct <anonymous> *)’} to ‘void (*)(ngx_http_script_engine_t *)’ {aka ‘void (*)(struct <anonymous> *)’} [-Werror=cast-function-type]
          code->code = (ngx_http_script_code_pt)
                        ^
      src/http/ngx_http_script.c: In function ‘ngx_http_script_add_full_name_code’:
      src/http/ngx_http_script.c:1296:18: error: cast between incompatible function types from ‘size_t (*)(ngx_http_script_engine_t *)’ {aka ‘long unsigned int (*)(struct <anonymous> *)’} to ‘void (*)(ngx_http_script_engine_t *)’ {aka ‘void (*)(struct <anonymous> *)’} [-Werror=cast-function-type]
          code->code = (ngx_http_script_code_pt) ngx_http_script_full_name_len_code;

    ```
  
  解决方案：进入objs目录下修改Makefile文件,将 -Werror 去掉。（-Wall 表示打开gcc的所有警告；-Werror，它要求gcc将所有的警告当成错误进行处理）
    `CFLAGS =  -pipe  -O -W -Wall -Wpointer-arith -Wno-unused-parameter - Werror -g`
  改成
    `CFLAGS =  -pipe  -O -W -Wall -Wpointer-arith -Wno-unused-parameter -g`
  保存后在nginx-1.14.0目录下再进行 make

#### 拓展

* scp上传

1. 本地上传到远程服务器

    !!!在本地终端操作：
    本地文件的路径既是相对路径也可以绝对路径
    scp【本地文件的路径】【服务器用户名】@【服务器地址】：【服务器上存放文件的路径】
    scp /Users/mac_pc/Desktop/test.png root@192.168.1.1:/root

2. 将服务器上的文件传输到本地
    !!!要在服务器端操作
    scp 【服务器用户名】@【服务器地址】：【服务器上存放文件的路径】【本地文件的路径】
    scp root@192.168.1.1:/data/wwwroot/default/111.png /Users/mac_pc/Desktop
