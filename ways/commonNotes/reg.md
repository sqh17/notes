### 正则

--------------------

#### 正则声明
  * 构造函数声明方式
    `var pat = new RegExp(pattern,modifiers);`
  * 字面量声明方式
    `var pat = /pattern/modifiers`
  * tip:参数解释：
    pattern：模式，要匹配的内容。
    modifiers：修饰符
     * i：ignore。不区分大小写的匹配
     * g：global。全局匹配
     * m：多行匹配
     ps：这三个可以连用，无顺序之分。
  ```javascript
    var reg = new RegExp('abc','ig'); // 代表不区分大小写并且全局匹配abc。
    var reg = /abc/m  // 代表多行匹配abc。
  ```
#### 正则字符
  * ^ 表示匹配输入字符串的开始位置
    `^abc => 代表整个字符中匹配首个字符串为abc的`
  * $ 表示匹配输入字符串的结束位置
    `abc$ => 代表整个字符中匹配尾部字符串为abc的`
  * . 表示匹配换行符\n之外的任何字符
    `. <=> \w\d\r\f\t\v`  
    ps：[.] 这种模式代表只匹配.字符，等价于'\.'
  * [] 表示字符集合。匹配所包含的任意一个字符
    `[abc] => apple也符合[abc]中的a`
    `[abcdef] => football也符合[abcdef]的a,b,f`
    `[^abc] => 代表不包含abc的任何字符都可匹配`
    ps: ^abc与[\^abc]的区别：
      + ^abc 代表整个字符中匹配首个字符串为abc的
      + \[\^abc\] 代表不包含abc的任何字符都可匹配
  * {} 表示匹配字符的数量，量词
    `a{2} => 代表匹配确定a只能出现两次`
    * {n} 匹配确定的n次
      `a{2} => 代表匹配确定a只能出现两次 aa`
    * {n,} 表示至少匹配n次
      `a{2,} => 代表匹配确定a至少出现两次 aa,aaa,aaaa`
    * {m,n} 表示最少出现m次，最多出现n次
      `a{2,4} => 代表匹配确定a最少出现2次，最多出现4次 aa,aaa,aaaa`
  * | 表示或的关系，两者都可匹配
    `a|b => 代表a和b都可以匹配到`
  * () 表示分组符，一代表匹配里面的字符并获取这一匹配。二代表优先级
    `(partten) => 匹配pattern并获取这一匹配`
    `^(0|[1-9][0-9]*)$ => 代表零和非零开头的数字`
    ps：(?:pattern) => 匹配pattern但不获取匹配结果。
  * \+ 表示前面的字符必须至少出现一次(1次或多次)
    `a+bc <=> abc | aabc | aaabc`
    ps:\+ 等价于 {1,}
  * \* 表示字符可以不出现，也可以出现1次或多次
    `a*bc <=> bc | abc | aabc`
    ps: \* 等价于 {0,}
  * ? 表示前面的字符最多只可以出现一次(0次或1次)
    `a?bc <=> bc | abc`
#### 常用字符和非打印字符
  * \d 匹配一个数字字符
    \d 等价于 \[0-9\] (`\d <=> \[0-9\]`)
  * \D 匹配一个非数字字符
    \D 等价于 \[^abc\] (`\D <=> \[^0-9\]`)
  * \w 匹配字母，数字，下划线
    `\w <=> \[A-Za-z0-9_\]`
  * \W 匹配非字母，数字，下划线
    `\W <=> \[^A-Za-z0-9_\]`
  * \b 匹配一个单词边界，也就是单词和空格间的位置
  * \B 匹配一个非单词边界
  eg: /ter\b/ => 可匹配chapter，不能匹配terminal
  * \n 换行符
  * \r 回车符
  * \f 换页符
  * \t 制表符
  * \v 垂直制表符
  * \s 匹配任何空白字符，包括空格，制表符，换页符
    `\s <=> \[\f\n\v\t\r\]`
  * \S 匹配任何非空白字符
    `\S <=> \[^\f\n\r\v\t\]`
#### 正则方法
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`var reg = new RegExp()`
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`var str = 'abc'; typeof str == 'string'`
* reg.test(str); 用来测试某个字符串是否与正则匹配，返回值是一个布尔值，匹配为true，不匹配为false。
  ```javascript
    var reg = /^a?b+c*/
    var str1 = 'aabbcc'
    var str2 = 'bc'
    reg.test(str1) // false  ？代表的是最多出现一次
    reg.test(str2) // true 
  ```
* reg.compile(str) 能够对正则表达式进行编译，方便多次调用，提高性能。参考菜鸟教程的说法：`该方法可以编译指定的正则表达式，编译之后的正则表达式执行速度将会提高，如果正则表达式多次被调用，那么调用compile方法可以有效的提高代码的执行速度，如果该正则表达式只能被使用一次，则不会有明显的效果。 `
  ```javascript
    var str="Every man in the world! Every woman on earth!";
    patt=/man/g;
    str2=str.replace(patt,"person");
    console.log(str2); // Every person in the world! Every woperson on earth!

    patt=/(wo)?man/g;
    patt.compile(patt);
    str2=str.replace(patt,"person");
    console.log(str2); // Every person in the world! Every person on earth!
  ```
* reg.exec(str) 接受一个字符串，返回一个数组，否则返回null。
  返回值是数组 解释：
  1  如果有多个匹配的话
   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 此数组的第0个元素是与正则表达式相匹配的文本。
   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 第一个元素是与reg的第一个子表达式相匹配的文本，（如果有的话）
   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 第二个元素是reg的第二个子表达式相匹配的文本，（如果有的话）
   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4……
  2 index 匹配文本的第一个字符的索引
  3 input 是被检索的字符串str
  ```javascript
    var str = '2018ceshi2019'
    var reg = /(\d)(\w)/;
    var result = reg.exec(str)
    console.log(result);//["20", "2", "0", index: 0, input: "2018ceshi2019"]
  ```
  ```javascript
    var str = 'The Quick Brown Fox Jumps Over The Lazy Dog'
    var reg = /quick\s(brown).+?(jumps)/ig;
    var result = reg.exec(str);
    console.log(result); //  ["Quick Brown Fox Jumps", "Brown", "Jumps", index: 4, input: "The Quick Brown Fox Jumps Over The Lazy Dog", groups: undefined]
    // result [0] 匹配的全部字符串 'Quick Brown Fox Jumps' 
    //        [1],[2],...[n] 括号中的分组捕获 [1] = Brown [2] = Jumps 
    //        index :匹配到的字符位于原始字符串的基于0的索引值 4
    //        input : 原始字符串 The Quick Brown Fox Jumps Over The Lazy Dog
  ```
  `ps:如果不需要捕获分布的内容，则在不需要分组捕获里面加上?:，此表示匹配不捕获。`
  `var reg = /quick\s(?:brown).+?(?;jumps)/ig;` 这样就不会有\[1\],\[2\],...\[n\]的分组捕获了。
* str.match(reg) 在字符串中搜索符合规则的内容，成功则返回数组内容，失败则返回null
  ```javascript
    var str = 'abc123def45g6hijkl789';
    var reg1 = /\d+/g;   // 每次匹配至少一个数字  且全局匹配
    console.log( str.match(reg1));   // [123，45，6，789]
    var reg2 = /\d+/;
    console.log(str.match(reg2)); // ["123", index: 3, input: "abc123def45g6hijkl789", groups: undefined]
    var reg3 = /\d/;
    console.log(str.match(reg3));//["1", index: 3, input: "abc123def45g6hijkl789", groups: undefined]
    var reg4 = /\d/g;
    console.log(str.match(reg4)) // ["1", "2", "3", "4", "5", "6", "7", "8", "9"]
  ```
  由这四个例子可知，全局匹配,得出的结果是一个数组，如果不是全局匹配，当找到数字123，它就会停止了。就只会弹出123，类似与exec()的结果。加上全局匹配，就会从开始到结束一直去搜索符合规则的。如果没有加号，匹配的结果就是["1", "2", "3", "4", "5", "6", "7", "8", "9"]，有了加号，每次匹配的数字就是至少一个了。
* str.search(reg) 在字符串中搜索符合正则内容的索引,如果不存在，则返回-1。
  ```javascript
    var str = 'abcdefg';
    var reg1 = /B/i;
    console.log(str.search(reg1)) // 1
    var reg2 = /B/;
    console.log(str.search(reg2)) // -1 
  ```
* str.replace(reg,new str/callback)
  参数解释: 第一个参数reg:要匹配的正则内容，
           第二个参数new str/callback。callback，回调函数里也有三个参数：1 匹配的字符，2 匹配字符的索引，3 源字符串。
  ```javascript
    var str = '我爱北京天安门，天安门上太阳升'
    var reg = /北京|天安门/g
    console.log(str.replace(reg,'*')) // 我爱**，*上太阳升
  ```
  ```javascript
    var str = "我爱北京天安门，天安门上太阳升。";
    var re = /北京|天安门/g;  //  找到北京 或者天安门 全局匹配
    var str2 = str.replace(re,function(str){
        console.log(str); //用来测试：函数的第一个参数代表每次搜索到的符合正则的字符，所以第一次str指的是北京 第二次str是天安门 第三次str是天安门
        var result = '';
        for(var i=0;i<str.length;i++){
            result += '*';
        }              
        return result; //所以搜索到了几个字就返回几个* 
    });
    console.log(str2)  //我爱*****，***上太阳升 
  ```

#### 额外例子：
* 1 找重复项最多的字符个数
  ```javascript 
    var str = 'aibbicidhdieifigbdihdaii';
    var arr = str.split(''); //把字符串转换为数组
    str = arr.sort().join(''); //首先进行排序，这样结果会把相同的字符放在一起，然后再转换为字符串
    console.log(str);  // aabbbcddddefghhiiiiiiiii
    var value = '';
    var index = 0;
    var re = /(\w)\1+/g;  //匹配字符，且重复这个字符，重复次数至少一次。
    str.replace(re,function($0,$1){
        console.log($0);   //代表每次匹配成功的结果 : aa dd jj kk l sssssssssssssssss
        console.log($1);  //代表每次匹配成功的第一个子项，也就是\w:  a d j k l S
        if(index<$0.length){  //如果index保存的值小于$0的长度就进行下面的操作
            index = $0.length;  // 这样index一直保存的就在最大的长度
            value = $1;  //value保存的是出现最多的这个字符
        }

    });
    console.log('最多的字符:'+value+',重复的次数:'+index);  // 最多的字符:i,重复的次数:9
  ```
* 大写数字替换小写数字
  ```javascript
    var str = "2019";
    var a = ["零","壹","贰","叁","肆","伍","陆","柒","捌","玖"];
    str = str.replace(/\d/g, function () {
        return a[arguments[0]];
    });
    console.log(str);//贰零壹玖
  ```

#### 参考资料
  * [菜鸟教程](http://www.runoob.com/regexp/regexp-tutorial.html)
  * [mdn](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/match)
  * [初漾博客](https://blog.csdn.net/shuidinaozhongyan/article/details/76599019)