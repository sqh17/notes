
### ref

* 定义：接受一个内部值，返回一个响应式的、可更改的 ref 对象，此对象只有一个指向其内部值的属性 .value。
* 大白话：将一个任意值转化为响应式对象，进而实现与页面上变量的响应
* 相关示例

```typescript
import {ref, Ref} from 'vue'
let msg:Ref<number> = ref(0)
let msg1:Ref<number[]> = ref([1,2,3,4])
console.log(msg.value) // 0
console.log(msg1.value) // proxy对象 [1,2,3,4]
msg.value ++ 
msg1.value.push(5)
console.log(msg.value) // 2
console.log(msg1.value) // // proxy对象 [1,2,3,5]
```

* 原理：其本质是调用了reactive()转为具有深层层次的响应式对象。
    ref函数，其调用路径是 ref -> createRef -> new RefImpl，RefImpl是一个类，其实现很简单，提供一个value属性和value的访问器get、set。
* 相关源码

```javascript
class RefImpl {
    constructor(value, __v_isShallow) {
        this.__v_isShallow = __v_isShallow;
        this.dep = undefined;
        this.__v_isRef = true;
        this._rawValue = __v_isShallow ? value : toRaw(value);
        this._value = __v_isShallow ? value : toReactive(value);
    }
    get value() {
        trackRefValue(this);
        return this._value;
    }
    set value(newVal) {
        const useDirectValue = this.__v_isShallow || isShallow(newVal) || isReadonly(newVal);
        newVal = useDirectValue ? newVal : toRaw(newVal);
        if (hasChanged(newVal, this._rawValue)) {
            this._rawValue = newVal;
            this._value = useDirectValue ? newVal : toReactive(newVal);
            triggerRefValue(this, newVal);
        }
    }
}
```

ref的实现，是使用对象，将原始类型值包一层，存到对象的value属性上。这也是为什么需要用 value 来访问和设置属性值。最终还是要使用对象的访问器get来收集依赖（track）、set来触发更新（trigger）

* 注意点：
    1. 在函数或方法中，使用ref对象是需要加value的
    2. ref对象在template的标签中是不需要加value的
    3. ref对象也可以支持引用类型的，它会把引用类型转为proxy类型的对象

#### Ref

* 定义：Ref并不是语法，而是为了方便ts识别ref对象的类型
* 相关代码

```typescript
import { ref, Ref } from 'vue'
// 方式1
const year: Ref<string | number> = ref('2020')
year.value = 2020 // 成功！
// 方式2
const year1 = ref<string | number>('2020')
year1.value = 2020 // 成功！
```

#### isRef

* 定义：检查某个值是否为ref对象，返回值是个布尔值
* 相关代码

```typescript
import {isRef,ref}
let a = ref<number>(0)
let b:number = 1
console.log(isRef(a))
console.log(isRef(b))
```

* 应用场景：基本上就是判断某个值是否为ref对象，是的话就使用.value

#### shallowRef

* 定义: ref() 的浅层作用形式。浅响应式：即只监测浅层数据得改变而不监测生成数据得改变，即只有最顶层数据得改变才能被监测到
* 大白话：ref对象的局部属性发生改变不会被检测到，只有最顶部的属性变化才会被检测到，看示例
* 相关代码：

```typescript
import {ref,shallowRef} from 'vue'
let aa = ref<number>(0)
let bb = shallowRef(0)
type Person = {
    name:string,
    age: number,
    color?: any
}
let cc = shallowRef<Person>({name: 'peter', age: 18,color:{
    flowerColor: 'red',
    clothesColor: 'pink'
}})
let dd = shallowRef<number[]>([1,2,3,4])
function fo1():void{
    aa.value ++
    console.log(aa) // 值更新，视图更新
}
function fo2():void{
    bb.value ++
    console.log(bb) // 值更新，视图更新
}
function fo3():void{
    cc.value.color.clothesColor = 'blue'
    console.log(cc) // 值更新，视图未更新
}
function fo4():void{
    dd.value[2] = 1000
    console.log(dd)
}
function fo5():void{
    aa.value ++
    bb.value ++
    cc.value.color.clothesColor = 'blue'
    console.log(aa,bb,cc) // aa,bb,cc全都更新，包括视图也更新
}

```

由此可见，shallowRef对引用类型有用，对基本类型和ref一样无差别

* 原理：调用new RefImpl()这个类，通过传参控制当前对象是否要变成reactive对象，shallowRef当时为true，则不变成reactvie对象，进而不被检测到
* 相关源码

```javascript
function shallowRef(value) {
    return createRef(value, true);
}
function createRef(rawValue, shallow) {
    if (isRef(rawValue)) {
        return rawValue;
    }
    return new RefImpl(rawValue, shallow);
}
// RefImpl相关源码请往上看ref那块
```

* 注意点：
    1. shallowRef对引用类型有用，对基本类型和ref一样无差别
    2. 看示例的fo5()，发现都更新，经过源码查看，是因为RefImpl的set方法，在最后都统一调用了triggerRefValue这个方法，这个方法是把所有的响应式对象给一个个调用，所以就出现都更新的情况

#### triggerRef

* 定义：强制触发依赖于一个浅层 ref 的副作用，这通常在对浅引用的内部值进行深度变更后使用
* 大白话：在一个响应式对象被转化为shallowRef的时候，可以通过triggerRef来使它变成可追踪的响应式对象
* 相关示例：

```typescript
import {shallowRef,triggerRef} from 'vue'
let cc = shallowRef<Person>({name: 'peter', age: 18,color:{
    flowerColor: 'red',
    clothesColor: 'pink'
}})
function fo3():void{
    cc.value.color.clothesColor = 'blue'
    triggerRef(cc) // 强制触发响应
    console.log(cc) // 值更新，视图也更新
}
```

* 原理：触发triggerRefValue方法，再触发triggerEffects方法，最后触发triggerEffect

#### customRef

* 定义： 创建一个自定义的 ref，显式声明对其依赖追踪和更新触发的控制方式，customRef() 预期接收一个工厂函数作为参数，这个工厂函数接受 track 和 trigger 两个函数作为参数，并返回一个带有 get 和 set 方法的对象
* 大白话：感觉有些像vue2的计算属性，根据某种场景去自定义封装一个 ref 对象，在其内部可以使用 get 和 set去跟踪或更新数据，customRef可以认为是vue3加强版的计算属性，因为vue3的computed创建出来的计算属性是只读的，computed 创建出来的属性，只能通过自身的 get 函数去跟踪其他属性来进行自身更新，而customRef可以设置set方法,看示例2
* 相关示例（官网上的）
示例1

```javascript
import { customRef } from 'vue'
export function useDebouncedRef(value, delay = 200) {
  let timeout
    // 自定义 ref 需要提供 customerRef 返回值
    // customer 需要提供一个函数作为参数
    // 该函数默认带参数 track 和 trigger ，都是方法。
  return customRef((track, trigger) => {
    return {
      get() {
        // track 方法放在 get 中，用于提示这个数据是需要追踪变化的
        track()
        return value
      },
      // set 传入一个值作为新值，通常用于取代 value
      set(newValue) {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          value = newValue
          // 记得触发事件 trigger,告诉vue触发页面更新
          trigger()
        }, delay)
      }
    }
  })
}
```

组件上使用

```vue
<script setup>
import { useDebouncedRef } from './debouncedRef'
const text = useDebouncedRef('hello')
</script>

<template>
  <input v-model="text" />
</template>
```

示例2

```vue
<template>
  <input
    v-model="value"
    @change="iptFn"
  />
</template>

<script setup lang="ts">
import { customRef } from 'vue'

function useRef<T> (value: T) {
  return customRef<T>((track, trigger) => ({
    get () {
      track()
      return value
    },
    set (newValue) {
      value = newValue
      trigger()
    }
  }))
}

const value = useRef<number>(0)

function iptFn (e: number) {
  value.value = e
}
</script>
```

* 相关源码

```javascript
class CustomRefImpl {
    constructor(factory) {
        this.dep = undefined;
        this.__v_isRef = true;
        const { get, set } = factory(() => trackRefValue(this), () => triggerRefValue(this));
        this._get = get;
        this._set = set;
    }
    get value() {
        return this._get();
    }
    set value(newVal) {
        this._set(newVal);
    }
}
function customRef(factory) {
    return new CustomRefImpl(factory);
}
```

* 注意点
    1. customRef中get方法里要触发track，set方法里要触发trigger，顺序不限
    2. 可以用于异步化同步的操作，因为setup里是同步操作

### reactive

* 定义：返回一个对象的响应式代理，响应式转换是“深层”的：它会影响到所有嵌套的属性。一个响应式对象也将深层地解包任何 ref 属性，同时保持响应性
* 大白话：将一个对象转为响应式对象，和ref很像，但有个部分区别，只针对于引用类型，而且深度响应，就是子级以及子级的子级的变化都能检测到。并且不需要.value获取
* 相关代码

```typescript
import {reactive} from 'vue'
type Obj = {
    name: string,
    age: number,
    color?: string
}
const peter:Obj = reactive({name:'peter', age: 18, color: 'red'})
console.log(peter) // proxy对象
```

* 相关源码

```javascript
function reactive(target) {
    // if trying to observe a readonly proxy, return the readonly version.
    if (isReadonly(target)) {
        return target;
    }
    return createReactiveObject(target, false, mutableHandlers, mutableCollectionHandlers, reactiveMap);
}
// ....
function createReactiveObject(target, isReadonly, baseHandlers, collectionHandlers, proxyMap) {
    if (!isObject(target)) {
        {
            console.warn(`value cannot be made reactive: ${String(target)}`);
        }
        return target;
    }
    // target is already a Proxy, return it.
    // exception: calling readonly() on a reactive object
    if (target["__v_raw" /* ReactiveFlags.RAW */] &&
        !(isReadonly && target["__v_isReactive" /* ReactiveFlags.IS_REACTIVE */])) {
        return target;
    }
    // target already has corresponding Proxy
    const existingProxy = proxyMap.get(target);
    if (existingProxy) {
        return existingProxy;
    }
    // only specific value types can be observed.
    const targetType = getTargetType(target);
    if (targetType === 0 /* TargetType.INVALID */) {
        return target;
    }
    const proxy = new Proxy(target, targetType === 2 /* TargetType.COLLECTION */ ? collectionHandlers : baseHandlers);
    proxyMap.set(target, proxy);
    return proxy;
}
```

* 原理： 通过源码最后一段代码大致可知：就是将对象转为proxy对象，然后存起来，若proxyMap有该对象这直接返回，若没有就存起来

#### isReactive

* 定义：检查一个对象是否是由 reactive() 或 shallowReactive() 创建的代理

#### shallowReactive

* 定义：reactive() 的浅层作用形式
* 大白话：和shallowRef一个意思，一个浅层响应式对象里只有根级别的属性是响应式的，就是自身属性变化后才会触发响应式，但下层嵌套对象不会被转为响应式
* 相关代码

```typescript
import {shallowReactive} from 'vue'
type Person = {
    name: string,
    age: number,
    color?: any
}
const peter:Person = shallowReactive({
    name: 'peter',
    age: 18,
    color: {
        clothesColor: 'red',
        flowerColor: 'green'
    }
})
function fo(){
    peter.name = 'tom'
    console.log(peter) // 值更新，视图也更新了
}
function fn(){
    peter.color.flowerColor = 'blue'
    console.log(peter) // 值更新，视图没更新
}
```

### readonly

### shallowReadonly

### toRef

### toRefs

### toRaw
