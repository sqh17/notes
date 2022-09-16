
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

* 定义：接受一个对象 (不论是响应式还是普通的) 或是一个 ref，返回一个原值的只读代理，对任何嵌套属性的访问都将是只读的
* 大白话：就是将一个对象（无论是响应式还是普通的）变成只读状态，一旦更改这个对象也不会生效，ts也会报警告
* 相关示例

```typescript
import {readonly, reactive, ref} from 'vue'
type Person = {
    name: string,
    age: number,
    color?: any
}
const peter:Person = reactive({
    name: 'peter',
    age: 18,
    color: {
        clothesColor: 'red',
        flowerColor: 'green'
    }
})
const readonlyPeter = readonly(peter)
function fooo():void{
    readonlyPeter.name = 'tom';
    readonlyPeter.color.clothesColor = 'pink'
    console.log(readonlyPeter) // 修改不生效
}
```

* 注意点
    1. readonly对任何嵌套属性都是只读访问的
    2. readonly适用于任何值，响应式，普通的，ref对象，reactive对象

### shallowReadonly

* 定义：readonly() 的浅层作用形式，和 readonly() 不同，这里没有深层级的转换：只有根层级的属性变为了只读
* 大白话，同shallowReactive，shallowRef一样的道理。

### toRef

* 定义：基于响应式对象上的一个属性，创建一个对应的 ref。这样创建的 ref 与其源属性保持同步：改变源属性的值将更新 ref 的值，反之亦然。
* 相关示例

```typescript
import {ref,toRef,Ref} from 'vue'
type Obj = {
    name: string,
    age: number
}
// 难道只是针对reactive对象吗？？？？？？
const o:Ref<Obj> = ref({name: 'peter',age: 18})
let name:Ref<string> = toRef(o.value, 'name');
let name1:Ref<string> = ref(o.value.name)
console.log('name', name)
console.log('name1', name1)
function fo(){
    name.value = 'tom';
    console.log(o,name) // o和name都发生了改变，并且视图也更新了
}
function fo2(){
    name1.value = 'tom';
    console.log(o,name1,name) // o和name没变
}
function fo1(){
    o.value.name = 'tom';
    console.log(o,name,name1) // // o和name都发生了改变，并且视图也更新了，name1未变，未更新
}
```

通过例子可以发现，通过toRef创建的对象同样是个ref对象，只不过依赖于源对象，一具荣一具损

* 注意点：
    1. toRef创建出来的对象和ref创建出来的对象不一样，toRef创建出来的对象依赖于源对象，若源对象变了，那么也会跟着变，而ref创建的对象是一个新值，互不影响
    2. 当使用toRef的时候要注意源对象的声明方式，是reactive还是ref，ref创建的要使用.value
* 相关源码

```javascript
function toRef(object, key, defaultValue) {
    const val = object[key];
    return isRef(val)
        ? val
        : new ObjectRefImpl(object, key, defaultValue);
}
class ObjectRefImpl {
    constructor(_object, _key, _defaultValue) {
        this._object = _object;
        this._key = _key;
        this._defaultValue = _defaultValue;
        this.__v_isRef = true;
    }
    get value() {
        const val = this._object[this._key];
        return val === undefined ? this._defaultValue : val;
    }
    set value(newVal) {
        this._object[this._key] = newVal;
    }
}
```

通过源码可知，首先判断选中的那个属性值是否是ref对象，若是直接返回,因为根据ref对象，嵌套的属性也是ref对象，所以会返回一个ref对象的新对象，若不是，直接new一个ObjectRefImpl对象,

### toRefs

* 定义：将一个响应式对象转换为一个普通对象，这个普通对象的每个属性都是指向源对象相应属性的 ref。每个单独的 ref 都是使用 toRef() 创建的。
* 大白话：批量版的toRef，就是将reactive对象或ref对象里的每个属性化为响应式，并相互依赖。谁变一起变。
* 相关示例

```typescript
import {reactive, toRefs} from 'vue'
const o = reactive({name: 'peter', age: 18})
const {name, age} = toRefs(o)
console.log('o', o)
function fo(){
    o.name = 'tom'
    console.log(name,age,o) // 同时变
}
function fo1(){
    name.value= 'cindy'
    console.log(name, age,o) // 同时变
}
```

通过示例可知，toRefs是把源对象的每个属性都变成了ref对象

* 应用场景
解构更方便，因为ref对象解构后会失去响应，而toRefs解构依然保持响应式

### toRaw

* 定义： 根据一个 Vue 创建的代理返回其原始对象。toRaw() 可以返回由 reactive()、readonly()、shallowReactive() 或者 shallowReadonly() 创建的代理对应的原始对象
* 大白话： 就是将响应式对象转为非响应式对象，返回未转为响应式的原始对象，
* 相关示例

```typescript
import {toRaw, ref, Ref} from 'vue'
const o:Ref<number> = ref(123)
let m = toRaw(o)
console.log(o, m)
console.log(m === o) // true
```

* 应用场景
做一些不想被监听的事情(提升性能)，ref/reactive数据类型的特点:每次修改都会被追踪, 都会更新UI界面, 但是这样其实是非常消耗性能的所以如果我们有一些操作不需要追踪, 不需要更新UI界面, 那么这个时候,我们就可以通过toRaw方法拿到它的原始数据, 对原始数据进行修改这样就不会被追踪, 这样就不会更新UI界面, 这样性能就好了。（例子：输入框不实时请求接口，当点击按钮时请求接口）

### markRaw

* 定义： 将一个对象标记为不可被转为代理。返回该对象本身
* 大白话：将数据标记为永远不能追踪的数据，一般在编写自己的第三方库时使用

### computed

* 定义：接受一个 getter 函数，返回一个只读的响应式 __ref 对象__。该 ref 通过 .value 暴露 getter 函数的返回值。它也可以接受一个带有 get 和 set 函数的对象来创建一个可写的 ref 对象。
* 相关示例

```typescript
import { ref, computed, onMounted } from 'vue'
const name = ref(0)
const fullName = computed<number>(() => {
    return name.value + 1000
})
const llame = computed<number>({
    get: () => {
        return name.value + 1000
    }
})
const newName = computed<number>({
    get: () => {   // 3. 当 name 的值被修改后，触发 get 方法
        return name.value + 10  // 95 + 10 = 105，所以newName 的值是 105
    },
    set: (param) => {  // 2. 下方定时器中赋值的 100 ,会作为参数传递到 set 方法 ，
        name.value = param - 5  //   name.value 被修改 100 - 5 = 95 ，所以 name 的值是95
    },
})

onMounted(() => {
    setTimeout(() => {
        newName.value = 100
    }, 3000)  // 1. 三秒后给 newName 赋值
})
```

```typescript
let name:Ref<number> = ref(0)
const plusOne = computed(() => name.value + 1, {
  onTrack(e) {
    // 当 name.value 被追踪为依赖时触发
    debugger
  },
  onTrigger(e) {
    // 当 name.value 被更改时触发
    debugger
  }
})
// 访问 plusOne，会触发 onTrack
console.log(plusOne.value)
// 更改 name.value，应该会触发 onTrigger
name.value++
```

name是响应式对象，会影响fullName方法，llame方法

* 相关源码

```javascript
var _a;
class ComputedRefImpl {
    constructor(getter, _setter, isReadonly, isSSR) {
        this._setter = _setter;
        this.dep = undefined;
        this.__v_isRef = true;
        this[_a] = false;
        this._dirty = true;
        this.effect = new ReactiveEffect(getter, () => {
            if (!this._dirty) {
                this._dirty = true;
                triggerRefValue(this);
            }
        });
        this.effect.computed = this;
        this.effect.active = this._cacheable = !isSSR;
        this["__v_isReadonly" /* ReactiveFlags.IS_READONLY */] = isReadonly;
    }
    get value() {
        // the computed ref may get wrapped by other proxies e.g. readonly() #3376
        const self = toRaw(this);
        trackRefValue(self);
        if (self._dirty || !self._cacheable) {
            self._dirty = false;
            self._value = self.effect.run();
        }
        return self._value;
    }
    set value(newValue) {
        this._setter(newValue);
    }
}
_a = "__v_isReadonly" /* ReactiveFlags.IS_READONLY */;
function computed(getterOrOptions, debugOptions, isSSR = false) {
    let getter;
    let setter;
    const onlyGetter = isFunction(getterOrOptions);
    if (onlyGetter) {
        getter = getterOrOptions;
        setter = () => {
                console.warn('Write operation failed: computed value is readonly');
            }
            ;
    }
    else {
        getter = getterOrOptions.get;
        setter = getterOrOptions.set;
    }
    const cRef = new ComputedRefImpl(getter, setter, onlyGetter || !setter, isSSR);
    // 是否有debugger
    if (debugOptions && !isSSR) {
        cRef.effect.onTrack = debugOptions.onTrack;
        cRef.effect.onTrigger = debugOptions.onTrigger;
    }
    return cRef;
}
```

### watch

* 定义：监听数据回调，与vue2的差别不大,额外选项多了几个参数flush（调整回调的刷新时机），onTrack / onTrigger（调试侦听器的依赖关系）
* 文档讲解很清楚，[侦听器](https://cn.vuejs.org/guide/essentials/watchers.html)
* 相关代码：
示例1

```javascript
import {watch,ref, Ref} from 'vue'
let message = ref({
    nav:{
        bar:{
            name:""
        }
    }
})
watch(message, (newVal, oldVal) => {
    console.log('新的值----', newVal);
    console.log('旧的值----', oldVal);
},{
    immediate:true,
    deep:true
})
```

示例2

```javascript
import { ref, watch ,reactive} from 'vue'
let message = ref('')
let message2 = ref('')
watch([message,message2], (newVal, oldVal) => {
    console.log('新的值----', newVal);
    console.log('旧的值----', oldVal);
})
```

示例3

```javascript
import { ref, watch ,reactive} from 'vue'
let message = reactive({
    nav:{
        bar:{
            name:""
        }
    }
})
watch(message, (newVal, oldVal) => {
    console.log('新的值----', newVal);
    console.log('旧的值----', oldVal);
})
```

示例4

```javascript
import { ref, watch ,reactive} from 'vue'
let message = reactive({
    name:"",
    name2:""
})
watch(()=>message.name, (newVal, oldVal) => {
    console.log('新的值----', newVal);
    console.log('旧的值----', oldVal);
})
```

* 注意点
    1. 使用reactive监听深层对象开启和不开启deep 效果一样,因为reactive是整个属性都变成了响应式
    2. 监听reactive数据源使用提醒:
        1. 可以直接侦听响应式对象，会隐式地转换成深度监听
        2. 不可以直接侦听响应式对象的属性值(因为newVal和oldVal都是同一个值)，只能通过返回该属性的 getter 函数或者转为deep：true(示例4)

### watchEffect

* 定义： watch() 是懒执行的：仅当数据源变化时，才会执行回调。但在某些场景中，我们希望在创建侦听器时，立即执行一遍回调，watchEffect()就是可以实现
* 文档讲解很清楚，[侦听器](https://cn.vuejs.org/guide/essentials/watchers.html#watcheffect)
