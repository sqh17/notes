#### 缘由
更新git后，发现每一次git pull都出现提示，虽然不影响流程，但是还得了解一下。
##### `原版`
```
warning: Pulling without specifying how to reconcile divergent branches is discouraged. You can squelch this message by running one of the following commands sometime before your next pull:


git config pull.rebase false  # merge (the default strategy)
git config pull.rebase true   # rebase
git config pull.ff only       # fast-forward only


You can replace "git config" with "git config --global" to set a default preference for all repositories. You can also pass --rebase, --no-rebase, or --ff-only on the command line to override the configured default per invocation.
```
##### `翻译版`
```
warning: 不建议在没有为偏离分支指定合并策略时执行pull操作。 
您可以在执行下一次pull操作之前执行下面一条命令来抑制本消息：


git config pull.rebase false  # 合并（缺省策略）
git config pull.rebase true   # 变基
git config pull.ff only       # 仅快进


您可以将 "git config" 替换为 "git config --global" 以便为所有仓库设置
缺省的配置项。您也可以在每次执行 pull 命令时添加 --rebase、--no-rebase，
或者 --ff-only 参数覆盖缺省设置。
```
##### 精确翻译`偏离分支`
当本地的分支落后于远程分支时，本地分支又自行修改项目文件生成了新的提交，这时本地分支再执行git pull命令就不能快进合并，并且还容易发生冲突。这时的本地分支便称为偏离分支，因为这时的本地分支的最新提交跟远程分支的最新提交不同，产生了偏离。

##### 精确翻译`合并策略`
合并策略便是 git merge --ff-only、git merge --no-ff、git merge --rebase这三种常见的合并策略，分别代表着快进合并、非快进普通合并、变基合并。

#### 出现的原因

在执行不带任何选项的git pull命令时，会产生三种歧义： 
* git pull --ff-only
* git pull --no-ff
* git pull --rebase，
而这三种pull方式的合并策略差异很大，即对整个分布式项目的版本管理有很大的影响作用。

执行不带任何选项的git pull命令时，Git就不知道我们到底想用哪种合并策略来执行git pull，因此Git会给出上述的警告文案，建议我们通过git config命令指定不带选项的git pull命令应该按照这三种合并策略的哪种来执行。

#### 去掉提示的解决方案
在执行git pull命令时，既保持当前的默认合并策略，保证不再出现配置合并策略的警告文案，
那么你只需要执行git config pull.ff false即可，因为pull.ff默认是没有指定的，而没有指定的pull.ff的默认值与显式指定为false的效果一致。因此当你显式指定pull.ff后，既保持当前的默认合并策略，又能保证不再出现配置合并策略的警告文案。
`默认策略`便是不带任何选项的git pull命令：先尝试快进合并，如果不行再进行正常合并生成一个新的提交。
#### 拓展
##### git pull 原理
git fetch 会查询git remote中所有的远程仓库所包含分支的最新提交，并将其记录到.git/FETCH_HEAD文件中。

.git/FETCH_HEAD 是一个版本链接，指向着目前已经从远程仓库取下来的所有分支的最新提交。

git pull 命令等价于：先执行git fetch，再执行git merge FETCH_HEAD将远程仓库对应分支的最新提交合并到当前本地分支中。

##### git pull命令中各选项的含义
* 不带任何选项的git pull命令：先尝试快进合并，如果不行再进行正常合并生成一个新的提交。

* git pull --ff-only命令：只尝试快进合并，如果不行则终止当前合并操作。

* git pull --no-ff命令：禁止快进合并，即不管能不能快进合并，最后都会进行正常合并生成一个新的提交。

* git pull --rebase命令：先尝试快进合并，如果不行再进行变基合并。

##### git pull.ff
* 当把pull.ff设置为false时，这个变量告诉Git在这种情况下，如果执行不带选项的git pull命令时先尝试快进合并，不行再创建一个合并后新的提交。

* 当把pull.ff设置为only时，只允许快进合并(相当于执行命令git pull --ff-only)，如果执行不带选项的git pull命令时，不能进行快进合并则终止当前操作。

* 如果将pull.ff设置为only，而执行不带选项的git pull命令被终止，其实可以使用带参数的git pull --no-ff或者git pull --rebase命令来执行pull操作。


##### git pull.rebase
* 当pull.rebase为true时，运行不带选项的命令git pull相当于执行git pull --rebase。

* 当pull.rebase为false时，运行不带选项的命令git pull不会被改变含义，即不会变基。如果想变基，需要在执行命令时显式地加上选项--rebase，即git pull —rebase
