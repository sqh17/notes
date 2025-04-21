
### ?. 链判断运算符

左侧的对象是否为null或undefined，若是则不再往下运算，而是返回undefined，否则一直运算下去，直到返回最后一个值。
链判断运算符?.读取深度嵌套在对象链中的属性值，而不必验证每个值。当值为空时，表达式停止计算并返回 undefined。

```javascript
let person = {
    name: '拾柒',
    body: {
        color: 'yellow',
        height: 179,
        weight: 70,
        sex: null
    },
    action: function(name){
        console.log(name)
    }
}
let res = person?.body?.age; // => undefined 
// 等价于
let res = person&& person.body&& person.body.location // 作用就是判断person下的body下的age是否为null或者undefined，当其中一链为null或者undefined时就直接返回undefined

let res2 = person?.sex; // => undefined
```

链判断运算符?.有三种写法。

* obj?.prop // 对象属性是否存在（例子如上）
* obj?.\[expr] // 同上
* func?.(...args) // 函数或对象方法是否存在

```javascript
person ?. action ?. ('peter'); // peter
```

### ?? 空值合并运算符

忽略错误值（如 0 和空字符串）的同时指定默认值。
左侧的对象是否为 undefined 或 null，若是的话，直接返回下一个值，若不是的话，则直接返回前一个值。
判断方式和 || 一样
区别就是:

* ?? 只判断 undefined 和 null

```javascript
function query(item) {
    return item ?? {}
}
// 等价于
function query(item) {
    if (item == null || item == undefined) {
        return {}
    } else {
        return item;
    }
}
```

* || 判断假值 undefined、null、''、false、0

```javascript
function query(item) {
    return item || {}
}
// 等价于
function query(item) {
    if (item === 0 || item === "" || item === false || item === null || item === undefined) {
        return {}
    } else {
        return item;
    }
}
```

### ??= 空赋值运算符

仅当值为 null 或 undefined 时，此赋值运算符才会赋值（没想出来和??比有什么适用场景...）

```javascript
function config(options) {
    options.duration ??= 100;
    options.speed ??= 25;
    return options;
}

config({ duration: 125 }); // { duration: 125, speed: 25 }
config({}); // { duration: 100, speed: 25 }
```

### &&= 与赋值运算符

当前者不是假值时，可赋值后者的值,若是假值时，直接赋值假值

```javascript
let A = 'abc';
let a = 1;
let b = 0;
let c = false;
let d = null;
let e = undefined;
let f = '';
A &&= '拾柒'; // '拾柒'
a &&= '拾柒'; // '拾柒'
b &&= '拾柒'; // 0
c &&= '拾柒'; // false
d &&= '拾柒'; // null
e &&= '拾柒'; // undefined
f &&= '拾柒'; // ''
```

### !! 双非

用来做类型判断，在第一步!（变量）之后再做逻辑取反运算

```javascript
var a;
if(a != null && typeof(a) != undefined && a != ''){
    //a有内容才执行的代码  
}
```

等价于

```javascript
if(!!a){
    //a有内容才执行的代码...  
}
```
