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
