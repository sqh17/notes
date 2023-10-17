### 动态组件

动态组件component，可以根据不同条件来显示不同的组件

```html
  <component :is="comId"></component>
```

```javascript
import A from './a.vue'
import B from './b.vue'
import C from './c.vue'
let comId = ref(A)
```

通过源码可知，会区分两种渲染模式，要是字符串就走resolveAsset方法，若是组件，则走render-patch方式

### 插槽slot

`<slot>` 元素是一个插槽出口 (slot outlet)，标示了父元素提供的插槽内容 (slot content) 将在哪里被渲染
`父组件模板中的表达式只能访问父组件的作用域；子组件模板中的表达式只能访问子组件的作用域。`

* 具名插槽
  可以指定名字，以及在父组件中对相应的插槽进行渲染

  ```html
  <!-- dialog.vue -->
  <div class="container">
    <header>
      <slot name="header"></slot>
    </header>
    <main>
      <slot></slot>
    </main>
    <footer>
      <slot name="footer"></slot>
    </footer>
  </div>
  ```

  ```html
  <!-- app.vue -->
  <dialog>
    <!-- 这个是具名插槽 -->
    <template v-slot="header">
      <div>头部</div>
    </template>
    <!-- 这个是默认插槽 -->
    <!-- 可以这样用#default -->
    <template v-slot>
      <div>中间</div>
    </template>
    <!-- 可以用#+name来使用 -->
    <template #footer>
      <div>尾部</div>
    </template>
  </dialog>
  ```

* 动态插槽

  ```html
  <!-- app.vue -->
  <dialog>
    <!-- 缩写可以这样写 #[slotName] -->
    <template v-slot:[slotName]>
      <div>头部</div>
    </template>
  </dialog>
  ```

  ```javascript
  import {ref} from 'vue'
  let slotName = ref('header')
  ```

* 作用域插槽
  就是子组件的数据可以通过attribute向插槽出口传递到父组件

  ```html
  <!-- dialog.vue -->
  <div class="container">
    <header>
      <slot name="header" :data='headerData'></slot>
    </header>
    <main>
      <slot :data="mainData"></slot>
    </main>
    <footer>
      <slot name="footer" :data="footerData"></slot>
    </footer>
  </div>
  ```

  ```javascript
  // dialog.vue
  import {ref} from 'vue'
  let headerData = reactive({name: 'peter', age: 18})
  let mainData = reactive([1,2,3])
  let footerData = reactive({name: 'peter', age: 18})
  ```

  ```html
  <!-- app.vue -->
  <dialog>
    <template #header='headerProps' >
      <div>{{headerProps.data.name}}</div>
    </template>
    <template #default='mainData >
      <div>{{mainData.data}}</div>
    </template>
    <template #footer='{data} >
      <div>{{data.name}}</div>
    </template>
  </dialog>
  ```

* 注意点
  1. 插槽不能再嵌套插槽

### 异步组件&代码分包

在大型应用中，我们可能需要将应用分割成小一些的代码块 并且减少主包的体积,这时候就可以使用异步组件。
在setup语法糖里面 使用方法
`<script setup> 中可以使用顶层 await。结果代码会被编译成 async setup()`
父组件引用子组件 通过defineAsyncComponent加载异步配合import 函数模式便可以分包，分包的意思就是，异步组件在打包的时候会单独提出来

```javascript
// app.vue
import { defineAsyncComponent } from 'vue'
const Dialog = defineAsyncComponent(() => import('../Dialog/index.vue'))
```

使用例子可以参考下面Suspense的例子

```html
<!-- Dialog/index.vue -->
<template>
  <div>哈哈哈</div>
</template>
<script setup>
const post = await fetch(`/api/post/1`).then(r => r.json())
</script>
```

* 注意点
  1. defineAsyncComponent有两种写法，一个是导入，一个是对象形式

    ```javascript
    const Dialog = defineAsyncComponent(() => import('../../components/Dialog/index.vue'))
    
    //完整写法
    
    const AsyncComp = defineAsyncComponent({
      // 加载异步组件时使用的组件
      loadingComponent: Dialog,
      // 展示加载组件前的延迟时间，默认为 200ms
      delay: 200,
      // 加载失败后展示的组件
      errorComponent: ErrorComponent,
      // 如果提供了一个 timeout 时间限制，并超时了
      // 也会显示这里配置的报错组件，默认值是：Infinity
      timeout: 3000
    })
    ```

### Suspense

* 定义：`<Suspense>` 是一个内置组件，用来在组件树中协调对异步依赖的处理。它让我们可以在组件树上层等待下层的多个嵌套异步依赖项解析完成，并可以在等待时渲染一个加载状态
* 大白话：比如说有两个异步组件，需要通过异步请求才能显示组件，这期间就得等待空白，有了 `<Suspense>` 组件后，我们就可以在等待整个多层级组件树中的各个异步依赖获取结果时，在顶层展示出加载中或加载失败的状态
Suspense 组件有两个插槽：#default 和 #fallback。两个插槽都只允许一个直接子节点。在可能的时候都将显示默认槽中的节点。否则将显示后备槽中的节点。

```html
<!-- app.vue -->
<template>
  <Suspense>
    <template #default>
      <!-- 具有深层异步依赖的组件 -->
      <Dialog />
    </template>

    <template #fallback>
        <div>loading...</div>
    </template>
  </Suspense>
</template>
<script setup>
import { defineAsyncComponent } from 'vue'
const Dialog = defineAsyncComponent(() => import('../Dialog/index.vue'))
</script>
```

这个示例就是当Dashboard未加载完时，就先展示loading

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

### transition过渡

[官网解释超详细](https://cn.vuejs.org/guide/built-ins/transition.html#css-based-transitions)

### inject/provide

1. provide:提供可以被后代组件注入的值
参数：
    * 第一个参数是一个对象或是返回一个对象的函数。这个对象包含了可注入其后代组件的属性。你可以在这个对象中使用 Symbol 类型的值作为 key
    * 第二个参数要传的值/对象
2. inject: 通过从上层提供方匹配并注入进当前组件的属性
参数：
    * 第一个参数是接受的属性名，
    * 第二参数是默认值。

只要是父子关系/祖孙关系等等都可以注入，遵遁单项数据流。
但可以设置成响应式，但不推荐子组件修改父组件的值

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

* 注意点
  1. provide可以设置值为readonly，防止子组件修改父组件的值
  2. inject可以设置个默认值

### eventBus 事件总线

兄弟之间的传值的方式可以使用事件总线，定义一个类，然后设置emit和on来分发和订阅，在每个组件里调用这个类，使用emit和on

代码示例

```typescript
type BusClass = {
  emit:(name: string) => void,
  on:(name: string, callback: Function) => void
}

type ParamsKey = string | number | symbol

type List = {
  [key: ParamsKey]: Array<Function>
}

class eventBus implements BusClass {
  list:List,
  constructor(){
    this.list = {}
  }
  emit(name: string, ...args: Array<any>){
    let eventName: Array<Function> = this.list[name]
    eventName.forEach((fn)=>{
      fn.apply(this, args)
    })
  }
  on(name: string, callback: Function){
    let fn:Array<Function> = this.list[name] || []
    fn.push(callback)
    this.list[name] = fn
  }
  off(name: string, callback: Function) {
    const callbacks = this.list[name];
    if (callbacks) {
      if (callback) {
        const index = callbacks.indexOf(callback);
        if (index !== -1) {
          callbacks.splice(index, 1);
        }
      } else {
        delete this.list[name];
      }
    }
  }
}
export default new Bus()
```

### jsx/tsx用法（大致，就是学习，还没深入）

vue的jsx/tsx写法和react大致一样

* 使用方式：

  1. 先引入`@vitejs/plugin-vue-jsx`
    在vite.config.js使用

    ```javascript
    import vueJsx from '@vitejs/plugin-vue-jsx';
    export default defineConfig({
      plugins: [...,vueJsx()]
    })
    ```

    tsconfig.js改些配置

    ```javascript
    {
      ...,
      "jsx": "preserve",
      "jsxFactory": "h",
      "jsxFragmentFactory": "Fragment",
    }
    ```

    然后vue就可以识别以.jsx/.tsx后缀名的文件了
* 书写方式
  1. 返回一个渲染函数

    ```typescript
    import {ref} from 'vue'
    let name:string = 'peter'
    export default function (){
      
      return (<div>{name}, hello</div>)
    }
    ```

  2. optionsAPI（少见）

    ```typescript
    import {defineComponent} from 'vue'
    export default defineComponent({
      data(){
        return {
          name: 'peter'
        }
      },
      method:{

      },
      render(){
        return (<div>{this.name}</div>)
      }
    }
    ```

  3. setup函数模式

    ```typescript
      import {defineComponent, ref} from 'vue'
      export default defineComponent({
        setup(){
          let name = ref('peter')
          return (<div>{name.value}</div>)
        }
      }
      ```

* 用法

  1. jsx/tsx支持v-model和v-show，***v-bind***（v-bind不支持，需要使用自定义属性）

    ```tsx
    import {ref} from 'vue'
    let name:string = 'peter'
    let val = ref<string>('123')
    let flag = ref<boolean>(false)
    export default ()=>{
      return (
      <div>
        <div>{name}, hello</div>
        <hr />
        {/* v-model */}
        <input v-model={val.value} type="text" />
        <div>{val.value}</div>
        <hr />
        {/* v-show */}
        <div v-show={!flag.value}>显示</div>
        <div v-show={flag.value}>隐藏</div>
        <hr />
        {/* ！！！v-bind */}
        <div data-name={'name'}>哈哈哈</div>
      </div>
      )
    }

    ```
  
  * 注意点：tsx无法解包ref，所以需要加value

  2.不支持v-if和v-for需要通过js变成方式去使用

    ```typescript
    import {defineComponent, reactive, ref} from 'vue'
    let flag = ref<boolean>(false)
    interface List {
      name: string;
      age: number;
    }
    let list = reactive<List[]>([
      {
        name: 'peter',
        age: 18
      },{
        name: 'tom',
        age: 20
      },
      {
        name: 'jerry',
        age: 30
      }
    ])
    export default ()=>{
      return (
          <div>
            <div>{!flag.value ? <div>显示</div> : <div>隐藏</div>}</div>
            <hr />
            <div>
            {
              list.map(item=>{
                return <div>{item.name}-{item.age}</div>
              })
            }
            </div>
          </div>
          )
    }
    ```

  * 注意点：for循环的map需要return

  3. props和emit的用法

    ```typescript
    interface Props {
      propsParent?: string
    }
    const clickTap = (val: any) => {
      val.emit('on-click', '点击了',list[0])
    }

    export default (props: Props,content: any)=>{
      return (
          <div>
            <div>{props.propsParent}</div>
            <hr />
            <div onClick={()=>clickTap(content)}>click</div>
          </div>
          )
    }
    ```

  * 注意点： 事件注意绑定上下文

  4. slots用法

    ```typescript
    const A = (props, { slots }) => (
      <>
        <h1>{ slots.default ? slots.default() : 'foo' }</h1>
        <h2>{ slots.bar?.() }</h2>
      </>
    );
    const slots = {
      bar: () => <span>B</span>,
    };
    export default (props: Props,content: any)=>{
      return (
        <div>
          <A v-slots={slots}>
            <div>A</div>
          </A>

        </div>
        )
    }
    ```

### babel

（待实现）
实现一个vite插件解析tsx

  ```typescript
  import type { Plugin } from 'vite'
  import * as babel from '@babel/core'; //@babel/core核心功能：将源代码转成目标代码。
  import jsx from '@vue/babel-plugin-jsx'; //Vue给babel写的插件支持tsx v-model等
  export default function (): Plugin {
      return {
          name: "vite-plugin-tsx",
          config (config) {
            return {
                esbuild:{
                  include:/\.ts$/
                }
            }
          },
          async transform(code, id) {
              if (/.tsx$/.test(id)) {
                  //@ts-ignore
                  const ts = await import('@babel/plugin-transform-typescript').then(r=>r.default)
                  const res = babel.transformSync(code,{
                      plugins:[jsx,[ts, { isTSX: true, allowExtensions: true }]], //添加babel插件
                      ast:true, // ast: 抽象语法树，源代码语法结构的一种抽象表示。babel内部就是通过操纵ast做到语法转换。
                      babelrc:false, //.babelrc.json
                      configFile:false //默认搜索默认babel.config.json文件
                  })
                  return res?.code //code: 编译后的代码
              }
            
              return code
          }
      }
  }
  ```

### 全局变量

```javascript
const app = createApp({})
app.config.globalProperties.$http = () => {}
app.config.globalProperties.$env = 'dev'
// vue3已摈弃过滤器
app.config.globalProperties.$filters = {
  format: (str)=>{
    return `拾柒的${str}`
  }
}

// 使用
<template>
  <div>{{$env}}</div>
  <div>{{$filters.format}}</div>
</template>
<script setup>
import {getCurrentInstance} from 'vue'
const {proxy} = getCurrentInstance()
console.log(proxy.$env)
console.log(proxy.$filters.format)
</script>
```

### 指令

自定义指令概念：
 在 Vue 中，代码复用和抽象的主要形式是组件。然而，有的情况下，你仍然需要对普通 DOM 元素进行底层操作，这时候就会用到自定义指令。
 自定义指令是vue提供给我们用原生DOM封装一系列DOM相关功能、视图变化的一个接口(API)
 综上，使用指令封装底层时，基本都在使用原生JS进行代码编写，所以要熟悉使用原生！

分为两种，全局指令和局部指令

#### 全局指令

**app.directive()**
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

在组件中直接自定义指令名称即可

```javascript
// html
<A v-move="{ background: value }" ></A>
// js
import A from './components/A.vue'
import { ref, Directive, DirectiveBinding } from 'vue'
let value = ref<string>('')
type Dir = {
  background: string
}
const vMove: Directive = (el, binding: DirectiveBinding<Dir>) => {
  el.style.background = binding.value.background
}

```

写了两个自定义指令

1. 拖拽自定义指令，在[simple-directive文件中](./simple-vue3/simple-directive.vue)
2. 图片懒加载指令，在[v-lazy](./simple-vue3/vLazy.vue)

### hooks

主要用来处理复用代码逻辑的一些封装
Vue3 的 hook函数 相当于 vue2 的 mixin, 不同在与 hooks 是函数
Vue3 的 hook函数 可以帮助我们提高代码的复用性, 让我们能在不同的组件中都利用 hooks 函数

### 插件

插件是自包含的代码，通常向 Vue 添加全局级功能。你如果是一个对象需要有install方法Vue会帮你自动注入到install 方法 你如果是function 就直接当install 方法去使用
eg：若 app.use() 对同一个插件多次调用，该插件只会被安装一次
示例如下
[use-loading](./simple-vue3/use-loading/index.ts)

### css

1. scoped
在DOM结构以及css样式上加唯一不重复的标记:data-v-hash的方式，以保证唯一（而这个工作是由过PostCSS转译实现的），达到样式私有化模块化的目的
2. :deep(选择器/类名),样式穿透
  `:deep(.con){color: red}`
3. :global(选择器/类名) 全局样式
4. :sloted(选择器/类名) 作用于slot里的类名
5. 动态css
    单文件组件的 \<style\> 标签可以通过 v-bind 这一 CSS 函数将 CSS 的值关联到动态的组件状态上
    见示例

    ```javascript
    <template>
        <div class="con">
          今天天气不错
        </div>
        <div class="wrapper">今天有大太阳</div>
    </template>
    
    <script lang="ts" setup>
    import { ref } from 'vue'
    const colorRed = ref<string>('red')
    let cssObj = ref({
      color: 'red'
    })
    </script>
    
    <style lang="scss" scoped>
    .con{
      color:v-bind(colorRed)
    }
    .wrapper{
      color: v-bind('cssObj.color')
    }
    
    </style>
    ```
