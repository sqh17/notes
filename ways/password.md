#### 缘由
手机打开segmentfalut时，长时间不登陆了，提示要重新登陆，输入的过程中看到输入密码时，延迟后再变成密文，很好奇，所以捣鼓了一下。本文实现了两种密码展示
#### 代码实现
##### 先明后密
js实现输入密码后，先显示当前输入的一位密码，然后再变成星号
```
<input id="ipt" type="text" /><br>
```
```
let val;
var str = ""; // 中间层
let ipt = document.getElementById('ipt');
ipt.addEventListener('keyup', function () {
  val = this.value;
  if (val.length >= str.length) {
    str += val; // 存取
  } else {
    str = str.substr(0, val.length)
  }
  this.value = val.replace(/./g, "*")
}, false)
```


##### 按钮显示隐藏密码
这个方法是通过一个按钮去显示和隐藏输入后的密码
```
<input id="pwd" type="password" /> <button>显示密码</button>
```
```
let pwd = document.getElementById('pwd')
    let btn = document.querySelector('button')
    let flag = true; // 状态控制
    btn.onclick = function(){
      if(flag){
        btn.innerHTML = '隐藏密码'
        pwd.type = 'text'
        flag = false
      }else{
        btn.innerHTML = '显示密码'
        pwd.type = 'password'
        flag = true
      }
    }
```