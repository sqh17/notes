### 异步组件&代码分包

在大型应用中，我们可能需要将应用分割成小一些的代码块 并且减少主包的体积,这时候就可以使用异步组件。
在setup语法糖里面 使用方法
`<script setup> 中可以使用顶层 await。结果代码会被编译成 async setup()`
父组件引用子组件 通过defineAsyncComponent加载异步配合import 函数模式便可以分包

```javascript
import { defineAsyncComponent } from 'vue'
const Dialog = defineAsyncComponent(() => import('../Dialog/index.vue'))
```

### Teleport

\<Teleport> 是一个内置组件，它可以将一个组件内部的一部分模板“传送”到该组件的 DOM 结构外层的位置去

[Teleport](https://cn.vuejs.org/guide/built-ins/teleport.html#basic-usage)

Teleport 是一种能够将我们的模板渲染至指定DOM节点，不受父级style、v-show等属性影响，但data、prop数据依旧能够共用的技术；类似于 React 的 Portal。
主要解决的问题 因为Teleport节点挂载在其他指定的DOM节点下，完全不受父级style样式影响。

通过to 属性 插入指定元素位置 to="body" 便可以将Teleport 内容传送到指定位置,可以id，className，选择器

```html
<Teleport to="body">
    <Loading></Loading>
</Teleport>
```

动态控制teleport
使用disabled 设置为 true则 to属性不生效  false 则生效

```html
<Teleport :disabled="true" to="body">
    <Loading></Loading>
</Teleport>
```

### inject/provide

1. provide:提供可以被后代组件注入的值
参数：
    * 第一个参数是一个对象或是返回一个对象的函数。这个对象包含了可注入其后代组件的属性。你可以在这个对象中使用 Symbol 类型的值作为 key
    * 第二个参数要传的值/对象
2. inject: 通过从上层提供方匹配并注入进当前组件的属性
参数：
    * 第一个参数是接受的属性名，
    * 第二参数是默认值。

只要是父子关系/父孙关系等等都可以注入，遵遁单项数据流。
可以设置成响应式

```javascript
// 父组件
import child from './child.vue'
import { ref, computed,provide, reactive } from "vue"
const parent = reactive({
    name:'parent',
    age: 50,
    color:'red'
})
provide('parentData', parent)
```

```javascript
// 子组件
import childChild from './childChild.vue'
import {ref, provide, inject} from 'vue'

let obj = ref({name:'peter', age: 18})

provide('sonData', obj)
let parentData = inject('parentData', ref({}))
```

```javascript
// 孙组件
import {ref, inject} from 'vue'
let parentData = inject('parentData')
let sonData = inject('sonData')
let obj = ref(parentData)
let obj1 = ref(sonData)
```

### 全局变量

```javascript
const app = createApp({})
app.config.globalProperties.$http = () => {}
```

### 指令

自定义指令概念：
 在 Vue 中，代码复用和抽象的主要形式是组件。然而，有的情况下，你仍然需要对普通 DOM 元素进行底层操作，这时候就会用到自定义指令。
 自定义指令是vue提供给我们用原生DOM封装一系列DOM相关功能、视图变化的一个接口(API)
 综上，使用指令封装底层时，基本都在使用原生JS进行代码编写，所以要熟悉使用原生！

分为两种，全局指令和局部指令

#### 全局指令

__app.directive()__
有两个参数：
    *name: 指令名
    * definition
        *指令具有7个生命周期
            1. created(el, binding, vnode){}
            2. beforeMount(el, binding, vnode){}
            3. mounted() {},
            4. beforeUpdate(a,b,c,prevNode) {
                //! 第四个参数 prevNode 只在beforeUpdate和updated才有！
            },
            5. updated() {},
            6. beforeUnmount() {
                // 当指令绑定的元素 的父组件销毁前调用。  <简单讲，指令元素的父组件销毁前调用>
            },
            7. unmounted() {},// 当指令与元素解除绑定且父组件已销毁时调用。
        * 4个参数
            1. el：指令绑定到的元素。这可用于直接操作 DOM。
            2. binding：
                1. instance : 使用指令的组件实例。
                2. value : 传递给指令的值。例如，在 v-my-directive="1 + 1" 中，该值为 2。可传递任意类型的数据！指令函数能够接受所有合法的 JavaScript 表达式。
                3. oldValue : 先前的值，仅在 beforeUpdate 和 updated 中可用。值是否已更改都可用。
                4. arg : 参数传递给指令 (如果有)。例如在 v-my-directive:foo 中，arg 为 "foo"。注意：值只有一个，且是字符串。指令参数名可是动态的：v-my-directive:\[argName]="anyData"
                5. modifiers : 包含修饰符 (如果有) 的对象。例如在 v-my-directive.foo.bar 中，修饰符对象为 {foo: true，bar: true}。
                6. dir : 一个对象，在注册指令时作为参数传递。简单来说，就是现在这的 content:{} 对象内的所有生命周期数据。
            3. vnode：上面作为 el 参数收到的真实 DOM 元素的蓝图，el树的所有节点。
            4. prevNode : 上一个虚拟节点，仅在 beforeUpdate 和 updated 钩子中可用。
            5.（注意 1：如上一点所说，除了这2个生命周期有这4个参数，其他的5个生命周期都是只有前面3个参数）
            6.（注意 2：除了 el 之外，你应该将这些参数视为只读，并且永远不要修改它们。如果你需要跨钩子共享信息，建议通过元素的自定义数据属性集进行共享。）
返回值：
    *如果传入 definition 参数，则返回应用实例
    * 如果不传入 definition 参数，则返回指令定义

```javascript
// 写法一
import { createApp } from 'vue'
const app = createApp(App)
app.directive('highlight',{
  created(el, binding, vnode) {},
  beforeMount(el, binding, vnode) {},
  mounted(el, binding, vnode) {},
  beforeUpdate(el, binding, vnode,prevNode) {},
  updated(el, binding, vnode, prevNode) {},
  beforeUnmount(el, binding, vnode) {},
  unmounted(el, binding, vnode) {}
})
```

```javascript
// 写法2
import { createApp } from 'vue'
const app = createApp(App)
app.directive('highlight',(el,binding,vNode,prevNode)=>{
  console.log(el,binding,vNode,pre);
  // 注意 prevNode 只有在 updated 生命周期才有值！
})
```

// 例子

```javascript
import { nextTick } from "vue"
import ScrollBar from "./scroll-bar"

export const scrollBar = {
  mounted(el, binding) {
    binding.value = binding.value || {}

    el.style.overflow = "hidden"

    const options = binding.value

    if (typeof binding.value.onScrollEnd !== "function") {
      options.onScrollEnd = () => {}
    }

    el.myScroll = new ScrollBar(el, options)

    nextTick(() => el.myScroll.refresh())
  },
  updated(el) {
    nextTick(() => el.myScroll.refresh())
  },
  unmounted(el) {
    el.myScroll.destroy()
    el.myScroll = null
    delete el.myScroll
  }
}

export default {
  install(app) {
    app.directive("scrollBar", scrollBar)
  }
}

```

#### 局部指令
