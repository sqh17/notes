## linux 常用基本知识汇总

#### systemctl

`systemctl` 是一个用于管理系统服务的命令行工具，它是在一些主流的 Linux 发行版（如 CentOS, Ubuntu, Fedora 等）中使用的。

以下是一些常见的 systemctl 命令及其功能：

* systemctl start \<service>: 启动一个服务。
* systemctl stop \<service>: 停止一个服务。
* systemctl restart \<service>: 重启一个服务。
* systemctl enable \<service>: 设置一个服务在系统启动时自动启动。
* systemctl disable \<service>: 取消一个服务在系统启动时自动启动。
* systemctl status \<service>: 显示一个服务的状态信息。
* systemctl list-unit-files: 列出所有可用的单位文件（包括服务文件、套接字文件等）。
* systemctl list-units: 列出当前正在运行的单位。

eg: 这些命令通常需要以管理员权限（如在 sudo 前缀下）运行，以便对系统服务进行管理。
eg: 在旧版的情况下都是用的 __service__ 启动服务或者其他操作的，新版都是用 __systemctl__
`sudo service nginx start`
`sudo service nginx stop`

#### scp上传

1. 本地上传到远程服务器

    !!!在本地终端操作：
    本地文件的路径既是相对路径也可以绝对路径
    scp【本地文件的路径】【服务器用户名】@【服务器地址】：【服务器上存放文件的路径】
    scp /Users/mac_pc/Desktop/test.png root@192.168.1.1:/root

2. 将服务器上的文件传输到本地
    !!!要在服务器端操作
    scp 【服务器用户名】@【服务器地址】：【服务器上存放文件的路径】【本地文件的路径】
    scp root@192.168.1.1:/data/wwwroot/default/111.png /Users/mac_pc/Desktop

#### which

`which` 命令用于查找 __可执行程序__ 的路径。它可以帮助您确定一个命令究竟是从哪个位置的可执行文件运行的,但查不出配置文件的路径(安装的路径)

#### find

`find` 是在 Linux 系统中用于搜索文件和目录的命令。它能够在指定的目录树中递归地查找文件，并可根据不同的条件进行筛选。
全范围查找，无视所在路径

```bash
# 搜索所有文件和目录
find /path/
# 按名称搜索文件：
# 可以正则匹配
find /path/ -name 'filename'
find /path/ -name '*.db'
# 按类型搜索文件
# -type f 只有文件会被匹配
# -type d 目录
# -type l 符号连接
find /path/ -type f
# 按大小搜索文件：
# -size +10M 代表 >=10M
# -size -10M 代表 <10M
# -size 10M 代表 = 10M
find /path/ -size +10M
```

#### rm

`rm` 是 Linux 系统中的一个命令，用于从文件系统中删除文件或目录

* -f：强制删除，无需确认。
* -r 或 -R：递归删除目录及其内容，用于删除目录。
* -i：交互模式，删除前逐个确认。
* -v：显示详细信息，展示每个删除的文件。

eg:可以连着使用

```bash
# 递归强制删除目录及其内容
rm -rf directory 
```
