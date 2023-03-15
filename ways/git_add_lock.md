#### 缘由

不知道之前动了git的什么操作还是git更新了，每次在git add/git commit的时候总是弹出此类问题

```bash
git add -A -- /Users/shiqinghao/eqx-work/eip-client/src/views/folder-manger/components/fileCard/style.scss
fatal: Unable to create '/Users/shiqinghao/eqx-work/eip-client/.git/index.lock': File exists.
```

#### 出现的原因

每当你运行一个git进程时，git就会在.git目录创建一个index.lock文件。例如，在当前的git仓库里运行git add .来stage本地的修改点，git就会在git add执行的时候创建index.lock文件，命令执行结束后，删除该文件
如果，同时执行两个git commit，将只有一个能正常运行，其他的进程将会报错,如果某个进程退出/结束的时候除了问题，可能会导致index.lock文件没有被清除掉,就会弹出此问题

#### 解决方案

在当前根目录下输入此命令来删除index.lock文件即可

```bash
ll -a
```

找到.git文件夹

```bash
rm -rf ./.git/index.lock
```
