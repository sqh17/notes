# 引言
不再用到的内存，没有及时释放，就叫做内存泄漏。在 js 中，详细一点说就是指我们已经无法再通过js代码来引用到某个对象，但垃圾回收器却认为这个对象还在被引用，因此在回收的时候不会释放它。导致了分配的这块内存永远也无法被释放出来。如果这样的情况越来越多，会导致内存不够用而系统崩溃。
### 常见内存泄漏
#### 意外的全局变量
由于 js 对未声明变量的处理方式是在全局对象上创建该变量的引用。如果在浏览器中，全局对象就是 window 对象。变量在窗口关闭或重新刷新页面之前都不会被释放，如果未声明的变量缓存大量的数据，就会导致内存泄露。
JS有两种变量，全局变量和在函数中产生的局部变量。局部变量的生命周期在函数执行过后就结束了，此时便可将它引用的内存释放（即垃圾回收），但全局变量生命周期会持续到浏览器关闭页面。所以当我们过多的使用全局变量的时候也会导致内存泄漏的问题
- 未声明变量
  ```javascript
  function fn() {
    a = 'global variable'
  }
  fn()
  ```
- 使用 this 创建的变量(this 的指向是 window)。
  ```javascript
  function fn() {
    this.a = 'global variable'
  }
  fn()
  ```
解决方法：
- 避免创建全局变量
- 使用严格模式,在 JavaScript 文件头部或者函数的顶部加上 use strict。
- 使用es6的let/const，禁止变量提升。


#### ~~闭包引起的内存泄漏~~
闭包可以读取函数内部的变量，然后让这些变量始终保存在内存中。根据垃圾回收机制，被另一个作用域引用的变量不会被回收。所以 __如果在使用结束后没有将局部变量清除，就可能导致内存泄露__。

虽然很多大量的博客说遇到了闭包泄漏的实际问题，大部分都将原因归结为闭包产生了内存泄漏。其实内存泄漏并不是闭包造成的，而是通过闭包内的函数对变量的引用，闭包不是真正产生内存泄漏的原因！
大量博客记录的实际遇到的闭包产生内存泄漏问题的根本原因就是没有及时的断开对变量的引用，而不是注册监听事件的闭包产生的内存泄漏。如果我们对该引用可以进行控制，就可以解决内存泄漏的问题，而不应该把这个锅甩给无辜的闭包。

#### 没有清理的 DOM 元素引用(同上)
虽然别的地方删除了，但是对象中还存在对 dom 的引用。
```javascript
// 在对象中引用DOM
var elements = {
  btn: document.getElementById('btn'),
}
function doSomeThing() {
  elements.btn.click()
}

function removeBtn() {
  // 将body中的btn移除, 也就是移除 DOM树中的btn
  document.body.removeChild(document.getElementById('button'))
  // 但是此时全局变量elements还是保留了对btn的引用, btn还是存在于内存中,不能被GC回收
}
```

解决方法：
- 手动删除，elements.btn = null。

#### 被遗忘的定时器或者回调
定时器中有 dom 的引用，即使 dom 删除了，但是定时器还在，所以内存中还是有这个 dom。
```javascript
// 定时器
var serverData = loadData()
setInterval(function () {
  var renderer = document.getElementById('renderer')
  if (renderer) {
    renderer.innerHTML = JSON.stringify(serverData)
  }
}, 5000)

// 观察者模式
var btn = document.getElementById('btn')
function onClick(element) {
  element.innerHTMl = "I'm innerHTML"
}
btn.addEventListener('click', onClick)
```

解决方法：
- 手动删除定时器和 dom。
- removeEventListener 移除事件监听

### vue 中容易出现内存泄露的几种情况
#### 全局变量造成的内存泄露
声明的全局变量在切换页面的时候没有清空
```html
<template>
  <div id="home">这里是首页</div>
</template>
```
```javascript
<script>
  export default {
    mounted() {
      window.test = {
        // 此处在全局window对象中引用了本页面的dom对象
        name: 'home',
        node: document.getElementById('home'),
      }
    },
  }
</script>
```

解决方案:
- 在页面卸载的时候顺便处理掉该引用。
```javascript
destroyed () {
  window.test = null // 页面卸载的时候解除引用
}
```

#### 监听在 window/body 等事件没有解绑
```javascript
mounted () {
  window.addEventListener('resize', this.func)
},
beforeDestroy () {
  window.removeEventListener('resize', this.func)
}
```
解决方法:
- 在页面销毁的时候，顺便解除引用，释放内存(如上)

#### 绑在 EventBus 的事件没有解绑
```javascript
<template>
  <div id="home">这里是首页</div>
</template>

<script>
export default {
  mounted () {
   this.$EventBus.$on('homeTask', res => this.func(res))
  }
}
</script>
```
解决方法:
- 在页面卸载的时候也可以考虑解除引用
```javascript
mounted () {
 this.$EventBus.$on('homeTask', res => this.func(res))
},
destroyed () {
 this.$EventBus.$off()
}
```

#### Echarts（未实践）
每一个图例在没有数据的时候它会创建一个定时器去渲染气泡，页面切换后，echarts 图例是销毁了，但是这个 echarts 的实例还在内存当中，同时它的气泡渲染定时器还在运行。这就导致 Echarts 占用 CPU 高，导致浏览器卡顿，当数据量比较大时甚至浏览器崩溃。
解决方法：加一个 beforeDestroy()方法释放该页面的 chart 资源，我也试过使用 dispose()方法，但是 dispose 销毁这个图例，图例是不存在了，但图例的 resize()方法会启动，则会报没有 resize 这个方法，而 clear()方法则是清空图例数据，不影响图例的 resize，而且能够释放内存，切换的时候就很顺畅了。
```javascript
beforeDestroy () {
  this.chart.clear()
}
```

### ES6 防止内存泄漏
- weakMap
- weakSet
他们对值的引用都是不计入垃圾回收机制的，也就是说，如果其他对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存。

```javascript
// 代码1
ele.addEventListener('click', handler, false)

// 代码2
const listener = new WeakMap()
listener.set(ele, handler)
ele.addEventListener('click', listener.get(ele), false)
```

当使用Dom对象绑定事件时，Dom对象消失后若没有及时释放内存（置null），便会一直存在内存中。 使用WeakMap保存Dom对象不会出现这样的问题，因为Dom对象消失后，JS的垃圾回收机制便会自动释放其所占用的内存(上述代码weakMap就没必要removeEventListener了)