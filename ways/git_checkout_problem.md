### git checkout branch-xxx

#### 问题描述
在使用`git checkout branch-xxx`切换分支时，发现报以下错误：
```
error: pathspec 'wt-sqh-intelligent2' did not match any file(s) known to git
```

这句话代表的是  当前不存在这个分支，无法切换。最后发现是分支名输错了....

#### 解决方法
检查分支名是否输错

#### 拓展
在查阅资料时，发现一篇文章有实践意义，特意来实战了一下,记录下来

##### 起源：
当本地没有对应的分支名时，又想切换到该分支
```
git checkout fix-logo
```
当切换到这个分支时，同样会报
```
error: pathspec 'fix-logo' did not match any file(s) known to git
```
##### 步骤：
1. 检查分支
```
git branch -a
```
如果没有想要的分支时，就先远程获取
```
git fetch
```
2. 切换到远程的对应的分支
```
git checkout origin/fix-logo
```
提示如下：
```
Note: switching to 'origin/fix-logo'.

You are in 'detached HEAD' state. You can look around, make experimental
changes and commit them, and you can discard any commits you make in this
state without impacting any branches by switching back to a branch.

If you want to create a new branch to retain commits you create, you may
do so (now or later) by using -c with the switch command. Example:

  git switch -c <new-branch-name>

Or undo this operation with:

  git switch -

Turn off this advice by setting config variable advice.detachedHead to false
```
3. 创建本地对应的分支
```
git checkout -b fix-logo
```
提示如下：
```
Switched to a new branch 'fix-logo'
```
4. 拉取远程对应的分支fix-logo
```
git pull
```
提示如下：
```
There is no tracking information for the current branch.
Please specify which branch you want to merge with.
See git-pull(1) for details.

    git pull <remote> <branch>

If you wish to set tracking information for this branch you can do so with:

    git branch --set-upstream-to=origin/<branch> fix-logo
```
5. 建立追踪链接
```
git branch --set-upstream-to=origin/fix-logo fix-logo
```
6. 再次拉取
```
git pull
```
提示如下:
```
Already up-to-date.
```