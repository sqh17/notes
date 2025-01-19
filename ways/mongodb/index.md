新安装3.6的mongo数据库，运行show dbs，显示not authorized on admin to execute command 错误，如下图：

原因：

安装mongo数据库时，配置文件中加了安全权限的设置。

解法：

输入下列语句：切换admin库，建立root角色账号，给账号复权限。（之前看很多文章，会加dbAdminAnyDatabase角色，但安装完里没有任何账号，所以应先加root账号，再在建其它角色账号）

use admin
db.createUser({"user":"root","pwd":"123456","roles":[{role:"root",db:"admin"}]})
db.auth('root','123456')

如下显示结果：

问题解决，再输入show dbs,显示正常。

输入exit 退出，再输入：mongo -u root -p 12456  重新用root 账号登录，进行其它操作，才有权限，不然，还是会出现，没权限的提示。

docker exec -it mongo-1 /bin/mongosh
