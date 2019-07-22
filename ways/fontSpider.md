### 使用字蛛教程以及遇到的bug
#### 前言：
前段时间刚完成一个外项目，歇了几天，老大让我看看公司的官网，优化一下，发现移动端的字体下载特别慢，才发现引用了字体包，一个字体包就达到了11M，想着既然有了图片压缩，那么应该有字体压缩，所以百度，弄了起来，废了不少劲，遇到不少坑，记录下来。

WebFont可以让网页使用特殊字体，就不用针对特殊字体用图片来代替了，通过 CSS3的新属性@font-face 语句引入字体资源，然后使用 CSS 选择器指定 font-family运用字体的文本。

#### 一 了解字蛛
字蛛 正如官网所说：是一个中文字体压缩器，（http://font-spider.org/）
它的原理就是将页面引用特殊字体的字体抽出来，然后访问字体包对应的字体，进而合成一个字体包，这样就不用引入3000多个字体了，实现了按需引入的功能。

官方话：字蛛通过分析本地 CSS 与 HTML 文件获取 WebFont 中没有使用的字符，并将这些字符数据从字体中删除以实现压缩，同时生成跨浏览器使用的格式。

虽然官网有详细的教程，自己还是再记录下，哈哈哈。
#### 二 安装
font-spider是一个node包，依赖于node，所以应先下载node，下载过程略～（前端再不懂node，真不好意思说是前端了）
之后：

    npm install font-spider -g

查看版本号

    font-spider —version

如果出现版本号，则代表安装成功。
#### 三 使用
在 CSS 中使用 WebFont：

    /*声明 WebFont*/
    @font-face {
          font-family: 'myfont';
          src: url('../font/myfont.eot');
          src:url('../font/myfont.eot?#font-spider') format('embedded-opentype'),
                url('../font/myfont.woff') format('woff'),
                url('../font/myfont.ttf') format('truetype'),
                url('../font/myfont.svg') format('svg');
          font-weight: normal;
          font-style: normal;
    }
#### 四 运行
在当前路径下，或者要压缩字体的html文件下，实行终端：

    font-spider xxx.html

#### 五 坑
  * 1 font-spider主要依据ttf格式的文件来进行分析压缩的，所以font-face的路径必须存在ttf格式的，其他格式不行。设计师的字体大部分都是网上下载的，可以找设计师要字体包的名字，然后通过这个网站[字客网](https://www.fontke.com/)去找对应的ttf，下载～
  * 2 引入路径要使用相对路径，
      否则会报 Web Font was not found 
  * 3 font-spider 仅适用于固定文本，如果文字内容为动态可变的，新增的文字将无法显示为特殊字体。解决办法是删除压缩后的，将备份出来的还原，重新压缩。

    font-spider xxx.html 如果不添加options，会默认备份原文件。
    font-spider会将页面依赖的字体将会自动压缩好，原 .ttf 字体会备份；
    
    如需再次压缩，还原.ttf字体文件，修改html文字之后，再次运行font-spider即可。
 * 4 如下：
 ![img](https://github.com/sqh17/notes/blob/master/images/3.png)

    这个报错就是Quarto A没有对应字体包，我查过这个字体是类似于base64那样形式的字体，所以不存在引入文件。
    所以如果不想压缩某个字体包的话，就先注释其font-face。
 * 5 一旦压缩一次后，再压缩别的是没用的。

      比如说，我在一个文件夹里压缩了字体，然后生成了新的字体包，我又在另一个文件夹里压缩字体，这两个文件夹的字体共用一个字体包和font-face，所以再次压缩的就是上一个压缩字体包进行压缩的，所以导致页面中有的字体没有转化过来。

      解决办法：一个命令行压缩所有

        font-spider file1/*.html file2/*.html file3/*.html
      
      这样即可，*.html代表通配符，分析所有html格式的文件，多个文件就直接在后面加上。

      我最大的坑就是这个，没仔细看官方文档，认为只能一次性，浪费了好多时间，wtf。 

#### 总结
  字蛛是一个很好用的字体压缩包，将十几M的字体包变成了多少k的字体包，减少了容量，提高了性能，优化了用户体验，推荐！

  我把笔记放到[GitHub](https://github.com/sqh17/notes/blob/master/ways/fontSpider.md)里了，如需要可以去看看，有什么不对的地方，欢迎指正，大家一起进步加油。