#### linux

走了不少弯路，其实yum可以安装node的，具体操作下次安装node时再弄再记录吧。下面的操作是用wget来手动安装。

- node 环境搭建
  1. wget https://nodejs.org/dist/v14.15.1/node-v14.15.1-linux-x64.tar.xz  
     //下载最新的稳定版 node-v14.15.1 到本地
  2. tar xvJf node-v14.15.1-linux-x64.tar.xz
     // 下载完成后, 将其解压
  3. mv node-v14.15.1-linux-x64 /usr/local/node 
     //将解压的 Node.js 目录移动到 /usr/local 目录下
  4. ln -s /usr/local/node/bin/node /bin/node
     //配置 node 软链接到 /bin 目录
  5. ln -s /usr/local/node/bin/npm /bin/npm
     //下载 node 的压缩包中已经包含了 npm , 我们只需要将其软链接到 bin 目录下即可
  6. echo 'export PATH=/usr/local/node/bin:$PATH' >> /etc/profile 
     //将/usr/local/node/bin 目录添加到 PATH 环境变量中可以方便地使用通过 npm 全局安装的第三方工具
  7. source /etc/profile
     // 执行 source 使修改生效
  8. node --version
     // 查看版本
- 安装 n 来切换 node 的版本
  - npm install -g n
  - 常用命令
    - n //会列出所有安装的版本供你切换
    - n latest //安装最新版本
    - n stable //安装最新稳定版
    - n lts //安装最新长期支持版本
    - n rm \[版本号] //删除某一版本
    - n -h //帮助命令
  - 版本切换无效解决方法
    来源：node 的安装目录和 n 默认的路径不一样
    1. 查看 node 当前安装路径
       `which node`
       `// /usr/local/node/bin/node`
    2. 而 n 默认安装路径是 /usr/local，若你的 node 不是在此路径下，n 切换版本就不能把 bin、lib、include、share 复制该路径中，所以我们必须通过 N_PREFIX 变量来修改 n 的默认 node 安装路径,编辑.bash_profile,将下面两行代码插入到文件末尾
       `vim ~/.bash_profile`
       `export N_PREFIX=/usr/local/node #node实际安装位置`
       `export PATH=$N_PREFIX/bin:$PATH`
    3. 保存退出
       `:wq`
    4. 执行 source 使修改生效
       `source ~/.bash_profile`
    5. 确认一下环境变量是否生效
       `echo $N_PREFIX`
       `// /usr/local/bin/node`
    6. 重新实行命令
       `n latest`
