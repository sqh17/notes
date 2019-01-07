#### Arguments 对象
--------------
    在javascript中，函数是没有重载这一项的，所谓的重载，一个函数可以有多个，就是参数的个数和形式不同所以引用的功能不同，而js不存在函数重载，不管传不传参数，函数里面是否引用，关系都不大，一个函数对应一个功能，但是函数可以模拟函数重载，所以有一个Arguments对象。

##### 定义
  arguments是一个对应于传递给函数的参数的`类数组`对象。
  ` 类数组：是数组的形式，有length，但不具有数组的一切方法`。
##### 描述
  arguments对象是所有（非箭头）函数中都可用的局部变量。你可以使用arguments对象在函数中引用函数的参数。此对象包含传递给函数的每个参数，第一个参数在索引0处。
`箭头函数没有arguments对象`
`arguments是函数中必有的对象，用来读取调用该函数的参数`
```javascript
function foo(){
    console.log(arguments[0])  // 1
    console.log(arguments[1])  // 2
    console.log(arguments[2])  // 3
}
foo(1,2,3)

```

arguments对象不是数组，但可以通过其他方式转化为数组，进而使用数组的方法。
`var args = Array.prototype.slice.call(arguments)`
`var args = [].slice.call(arguments);`
`var args = Array.from(arguments)`
`var args = [...arguments]`
```javascript
function foo() {
    var f = Array.prototype.slice.call(arguments);
    // var f = [].slice.call(arguments);
    // var f = Array.from(arguments);
    // var f = [...arguments];
    console.log(f)  // [1,2,3]
    console.log(f instanceof Array) // true
}
foo(1, 2, 3)
```

##### 属性
arguments既然是个对象，也有它的自带的属性。

* length 长度，本次函数调用时传入函数的实参数量.
    * 表示的是实际上向函数传入了多少个参数,这个数字可以比形参数量大,也可以比形参数量小
    * 形参：全称“形参变量”，只有在被调用时才分配内存单元，在调用结束时，即刻释放所分配的内存单元。因此，形参只在函数内部有效。函数调用结束返回主调用函数后则不能再使用该形参变量。
    * 实参：全称为"实际参数"是在调用时传递给函数的参数. 实参可以是常量、变量、表达式、函数等， 无论实参是何种类型的量，在进行函数调用时，它们都必须具有确定的值， 以便把这些值传送给形参。 因此应预先用赋值，输入等办法使实参获得确定值。
`形参就是函数声明的参数，实参是函数调用的参数`
```javascript
function foo(a,b){}  // a,b代表形参
foo(1,2) // 1,2代表实参
```
* callee 当前正在执行的函数
    * 可以用于引用该函数的函数体内当前正在执行的函数（类似于递归）
    * es5之后废弃，但不代表不使用这个callee了
    * callee可以使用在匿名递归函数中。
        * 匿名函数 (通过 函数表达式 或者 函数构造器 创建) 没有名称。因此如果没有可访问的变量指向该函数，唯一能引用它的方式就是通过 arguments.callee。
        ```javascript
        function create() {
            return function (n) {
                if (n <= 1)
                    return 1;
                return n * arguments.callee(n - 1);
            };
        }

        var result = create()(5); 
        console.log(result) // returns 120 (5 * 4 * 3 * 2 * 1)
        ```
        * 但不提倡使用callee来递归，最好形成有名函数，进而使用函数名递归。
        ```javascript
        function create() {
            return function multiply(n) {
                if (n <= 1)
                    return 1;
                return n * multiply(n - 1);
            };
        }

        var result = create()(5); 
        console.log(result) // returns 120 (5 * 4 * 3 * 2 * 1)
        ```
* caller 指向调用当前函数的函数
    * 原先用在函数执行的时候调用自身 
    * 已废弃，不能用
* arguments[@@iterator] 返回一个新的Array迭代器对象，该对象包含参数中每个索引的值。
    * 这个意思就是可以调用for-of循环 - -!
    ```javascript
    function add(){
        for(var i of arguments){
            console.log(i)   //1 2 3 4 5 6 
        }
    }
    add(1,2,3,4,5,6)
    ```
##### 特殊点
  当arguments遇到剩余函数，解构赋值和默认参数的情况：
  * 在严格模式下，剩余参数、默认参数和解构赋值参数的存在不会改变 arguments对象的行为，
  ```javascript
  "use strict"
  function func(...a) {
    a[0] = 11
    console.log(arguments);
  }
  func(1,2,3,4,5); // [1,2,3,4,5]
  function func1(a=4) {
    console.log(arguments);
  }
  func1(1); // [1]
  ```
  * 当非严格模式中的函数没有包含剩余参数、默认参数和解构赋值，那么arguments对象中的值会跟踪参数的值（反之亦然）
  ```javascript
    function func(a) { 
        arguments[0] = 99;   // 更新了arguments[0] 同样更新了a
        console.log(a);
    }
    func(10); // 99
    function func1(a) { 
        a = 99;              // 更新了a 同样更新了arguments[0] 
        console.log(arguments[0]);
    }
    func1(10); // 99
  ```
  * 当非严格模式中的函数有包含剩余参数、默认参数和解构赋值，那么arguments对象中的值不会跟踪参数的值（反之亦然）
  ```javascript
    function func(a = 55) { 
        arguments[0] = 99; // 更新了 arguments[0] 但没更新 a
        console.log(a);
    }
    func(10); // 10
    function func1(a = 55) { 
        a = 99; // 更新了 a 但没更新arguments[0]
        console.log(arguments[0]);
    }
    func1(10); // 10
    function func2(a = 55) { 
        console.log(arguments[0]);
    }
    func2(); // undefined
  ```
  
