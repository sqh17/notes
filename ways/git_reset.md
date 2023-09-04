## git远程库回退版本复习

前段时间提交git的时候，发现功能有误，但已经提交到远程库了，但是忘了具体的git指令了，所以借此重新复习一下

------

### 指令

#### git log

`git log`命令可以显示当前分支所有提交过的版本信息，不包括`已经被删除的commit` 记录和`reset`的操作。(注意: 只是当前分支操作的信息)

git log显示的信息太繁琐，可以加上参数 --pretty=oneline 只会显示版本号和提交时的备注信息
```git log --pretty=oneline```

#### git reflog

`git reflog`命令可以查看所有分支的所有操作记录信息，包括`已经被删除的 commit`记录和 `reset` 的操作，现在包括`切换分支`的记录了(所有操作记录信息)

#### git reset --hard commitID

这个意思就是代表回退某个id下的版本信息

commitID就是在`git reflog`和`git log`的id

这次回退，当前分支下超过ahead of 'origin/xxx'的信息都不存在了，只能通过commitID去找回来，无法通过HEAD^去找了

eg:

* git reset xxx ： 撤销暂存 会将文件从暂存区撤销到工作区(未被追踪的状态)
* git reset --soft xxx 不删除本地代码变动，不撤销add，撤销commit
* git reset --mixed xxx 不删除本地代码变动，撤销commit，撤销add
* git reset --hard xxx 删除本地代码变动，撤销commit，撤销add

然后接下来的一步就是强制push到远程分支

```git push -f```
因为本地分支回滚后，版本将落后远程分支，必须使用强制推送覆盖远程分支，否则无法推送到远程分支

#### git revert HEAD^

`git revert`可以撤销指定的提交内容，撤销后会生成一个新的commit，会在整个log上会有记录，并不会删除某些commitID下的版本信息。这个可能会产生冲突，需要解决一下冲突

### 拓展

#### 更改本地以及远程分支的名字

1. 重命名本地分支 / 直接本地新建分支
`git branch -m oldName newName`
2. 删除远程分支
`git push --delete origin oldName`
3. 上传新命名的本地分支
`git push origin newName`
4. 本地分支与远程分支关联
`git branch --set-upstream-to origin/newName`
其中，第3、4步命令也可以直接用下面的命令代替
`git push -u origin newName`
