#### 前提摘要
  尤大大的vue3.0即将到来，虽然学不动了，但是还要学的啊，据说vue3.0是基于proxy来进行对值进行拦截并操作，所以es6的proxy也是要学习一下的。

#### 一 什么是proxy
  Proxy 对象用于定义基本操作的自定义行为（如属性查找，赋值，枚举，函数调用等） --摘自MDN
  Proxy 用于修改某些操作的默认行为，等同于在语言层面做出修改，所以属于一种“元编程”（meta programming），即对编程语言进行编程。 --摘自阮一峰的ES6入门
  Proxy 这个词的原意是代理，用在这里表示由它来“代理”某些操作，可以译为“代理器”。
  Proxy 也可以理解成，在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写。
  总结来说：Proxy对象就是要在目标对象上设置自定义的规则和方法，让它按照自己定义的规则去实行某些操作。

#### 二 Proxy声明
  ES6 原生提供 Proxy 构造函数，用来生成 Proxy 实例，所以可以按照构造函数创建对象的形式去实例化一个Proxy对象。

    var proxy = new Proxy({},{})
    console.log(proxy) // Proxy{}

  注意点：
    1 实例化一个Proxy对象时，必须要传两个参数对象,否则会报错：Uncaught TypeError: Cannot create proxy with a non-object as target or handler,不能创建没有对象的proxy对象。
    2 传两个空对象时，默认的是简单声明了一个Proxy实例，（好像没啥卵用……）

  参数对象解释：
  * 第一个参数：target，目标对象，是你要代理的对象.它可以是JavaScript中的任何合法对象.如: (数组, 对象, 函数等等) 
    tip: 

        var arr = []
        var obj = {}
        var Person = class{}
        var foo = function (){}
        console.log(Person instanceof Object) // true
        console.log(foo instanceof Object)  // true
        console.log(arr instanceof Object)  // true
        console.log(obj instanceof Object)  // true
  * 第二个参数：handler，配置对象，用来定制拦截行为，对于每一个被代理的操作，需要提供一个对应的处理函数，该函数将拦截对应的操作。
    Proxy支持的拦截操作，有13种，使用方法可以参考 [阮一峰的ES6入门](http://es6.ruanyifeng.com/#docs/proxy)

#### 三 常见情况
##### 3.1 当目标对象为空时
  var proxy = new Proxy({},handler)
  这样直接代表着，拦截的对象是空的，所以直接对proxy对象进行操控。

    var target = {};
    var handler = {
      get(target,propKey,receiver){
        return 'peter'
      }
    };
    var proxy = new Proxy(target, handler);
    proxy.name = 'tom';
    console.log(proxy.name) // tom
    console.log(target.name) // undefined
  上面的代码说明了：target是个空对象，但是操作了proxy，也影响不了target
  ps：要使得Proxy起作用，必须针对Proxy实例进行操作，而不是针对目标对象进行操作

##### 3.2 当拦截对象为空时
  var proxy = new Proxy(target,{})
  handler没有设置任何拦截，那就等同于直接通向原对象。

    var target = {};
    var handler = {};
    var proxy = new Proxy(target, handler);
    proxy.name = 'peter';
    console.log(proxy.name) // peter
    console.log(target.name) // peter
    
  上面的代码说明了：handler是一个空对象，没有任何拦截效果，访问proxy就等同于访问target

#### 四 方法解析
  Proxy实例化的对象默认带有get和set方法。也可以在这些基础上进行拦截操作，其他的13种方法也是如此。
  1. get() 用于拦截某个属性的读取（read）操作，换句话讲，就是在读取目标对象的属性之前，操作该属性。
    参数解释：
      * target：目标对象
      * property：属性名
      * receiver：proxy实例
    例子：

            var person = {
              name: "张三"
            };

            var proxy = new Proxy(person, {
              get: function(target, property) {
                if (property in target) {
                  return target[property];
                } else {
                  throw new ReferenceError("Property \"" + property + "\" does not exist.");
                }
              }
            });

            proxy.name // "张三"
            proxy.age // Property "age" does not exist.
        参考阮一峰的例子，上述说明了，如果输入目标函数不存在的属性，就直接报错。

  2. set() 用来拦截目标对象的赋值（write）操作
    参数解释：
      * target：目标对象
      * propertyName：属性名
      * propertyValue：属性值
      * receiver：Proxy实例本身
    例子：

            var target = {}
            var handler = {
              set(target, propKey, value, receiver) {
                if (typeof value !== 'string') {
                  target[propKey] = String(value);
                }else{
                  target[propKey] = value;
                }
              }
            }
            var proxy = new Proxy(target, handler)
            proxy.name = 'peter'
            proxy.age = 25
            console.log(typeof proxy.name) // string
            console.log(typeof proxy.age) // string
      上面例子就是拦截对象是不是字符串，不是字符串的话会强制转化为字符串。

  3. apply() 用来拦截函数的调用、call和apply操作
    参数解释：
      * target：目标对象
      * context：目标对象的上下文对象(this）
      * arguments：目标对象的参数数组
    例子：

            var target = function(a,b){
              return 10 + a + b
            }
            var handler = {
              apply(target,context,arguments){
                arguments[0] = 10
                arguments[1] = 20
                return arguments.reduce(function(prev, curr, idx, arr){
                    return prev + curr;
                });
              }
            }
            var proxy = new Proxy(target,handler)
            console.log(proxy(1,2)) // 30
      上面的例子，就是目标函数是要传两个参数，并且返回之和，拦截目标做的就是改变目标对象的参数，并且求和，所以这样写触发了apply方法，返回30，而不是13

  4. has() 用来拦截hasProperty操作，即判断对象是否具有某个属性时，这个方法会生效。典型的操作就是in运算符。
    参数解释：
      * target：目标对象
      * key： 需查询的属性名,是一个字符串！！！！！
    例子：

            var target = {
              name: 'peter',
              age:25
            }
            var handler = {
              has(target,key){
                return key in target;
              }
              
            }
            var proxy = new Proxy(target,handler)
            console.log('age' in proxy) // true
            console.log('colors' in proxy) // false
      上面的例子是典型的has的方法，判断所要查询的属性名是不是在目标对象上的属性名，返回布尔值。
  ps：has拦截对for...in循环不生效。
  
  5. construct() 用于拦截new命令，要返回是一个对象，否则会报错
    参数解释：
      * target：目标对象
      * args：构造函数的参数对象
      * newTarget：创造实例对象时，new命令作用的构造函数
    例子：

            var p = new Proxy(function () {}, {
              construct: function(target, args) {
                console.log('called: ' + args.join(', '));
                return { value: args[0] * 10 };
              }
            });

            (new p(1)).value
            // "called: 1"
            // 10
      由此可见，是针对构造函数而言的，对目标对象的构造函数进行拦截。

  6. defineProperty() 拦截了Object.defineProperty操作，在声明时进行拦截，设置的是一个布尔值
      * 参数解释：
        * target：目标对象
        * key：要定义或修改的属性的名称
        * descriptor： 将被定义或修改的属性描述符,是一个对象
      * 拓展：
          Object.defineProperty(),声明对象的属性，参数说明和上述一样
            例子：

            var obj = {}
            Object.defineProperty(obj, "key", {
              enumerable: false,
              configurable: false,
              writable: false,
              value: "static"
            });

      * 例子：

            var target = {
              name: 'peter',
              age:25
            }
            var handler = {
              defineProperty(target,key,descriptor){
                if(key === 'color'){
                  throw new Error('不能定义颜色')
                }
                Object.defineProperty(target, key, descriptor)
                // return true
              }
            }
            var proxy = new Proxy(target,handler)
            var descriptor = {
              writable : true,
              enumerable : true,
              configurable : true
            }
            descriptor.value = 'sport'
            Object.defineProperty(proxy, 'favor', descriptor)
            console.log(proxy.favor) // sport
            descriptor.value = 'red'
            Object.defineProperty(proxy, 'color', descriptor)  // 不能定义颜色
            console.log(proxy.color)
      如果目标对象不可扩展（non-extensible），则defineProperty不能增加目标对象上不存在的属性，否则会报错。另外，如果目标对象的某个属性不可写（writable）或不可配置（configurable），则defineProperty方法不得改变这两个设置。
  
  7. deleteProperty() 用于拦截delete操作，如果这个方法抛出错误或者返回false，当前属性就无法被delete命令删除。
      * 参数解释：
        * target：目标对象
        * key：要删除的属性名
        (delete是关键字，目前用到的就是删除对象的某个属性)
      * 例子：

            var target = { _prop: 'foo' };
            var handler = {
              deleteProperty (target, key) {
                if (key[0] === '_') {
                  throw new Error(`Invalid attempt to ${target} private "${key}" property`);
                }
                delete target[key];
                return true;
              }
            };
            var proxy = new Proxy(target, handler);
            delete proxy._prop // Error: Invalid attempt to delete private "_prop" property
      上面代码中，deleteProperty方法拦截了delete操作符，删除第一个字符为下划线的属性会报错。
    注意，目标对象自身的不可配置（configurable）的属性，不能被deleteProperty方法删除，否则报错。
  
  8. getOwnPropertyDescriptor() 拦截Object.getOwnPropertyDescriptor()，返回一个属性描述对象或者undefined。
      * 参数解释：
        * target：目标对象
        * key： 属性名
      * 拓展：
        Object.getOwnPropertyDescriptor(obj,prop) 返回指定对象上一个自有属性对应的属性描述符
          * 参数解释： 
            * obj：需要查找的目标对象
            * prop: 目标对象内属性名称
          * 返回值：
            如果指定的属性存在于对象上，则返回其属性描述符对象（property descriptor），否则返回 undefined。
          * 例子：

                o = { bar: 42 };
                d = Object.getOwnPropertyDescriptor(o, "bar");
                console.log(d)
                // d {
                //   configurable: true,
                //   enumerable: true,
                //   value: 42,
                //   writable: true
                // }

      * 例子：

            var target = { _foo: 'bar', baz: 'tar' };
            var handler = {
              getOwnPropertyDescriptor (target, key) {
                if (key[0] === '_') {
                  return;
                }
                return Object.getOwnPropertyDescriptor(target, key);
              }
            };
            var proxy = new Proxy(target, handler);
            Object.getOwnPropertyDescriptor(proxy, 'wat')
            // undefined
            Object.getOwnPropertyDescriptor(proxy, '_foo')
            // undefined
            Object.getOwnPropertyDescriptor(proxy, 'baz')
            // { value: 'tar', writable: true, enumerable: true, configurable: true }
      上述说明：对于第一个字符为下划线的属性名会返回undefined。
  
  9. getPrototypeOf() 用来拦截获取对象原型,主要拦截以下操作：
      * 如下：
        * Object.prototype.\__proto__
          -- 该特性已经从 Web 标准中删除
        * Object.prototype.isPrototypeOf() 
          用于测试一个对象是否存在于另一个对象的原型链上。
          * 参数：
            * object 在该对象的原型链上搜寻
          * 返回值：
            * 返回值 表示调用对象是否在另一个对象的原型链上。布尔值
          * 例子：

                function Baz() {}
                var baz = new Baz();
                console.log(Baz.prototype.isPrototypeOf(baz)); // true
        * Object.getPrototypeOf(obj) 返回指定对象的原型（内部\[[Prototype]]属性的值）
          * 参数：
            * obj 返回其原型的对象
          * 返回值：
            给定对象的原型。如果没有继承属性，则返回 null 。
          * 例子：

                var proto = {};
                var obj = Object.create(proto);
                Object.getPrototypeOf(obj) === proto; // true
        * Reflect.getPrototypeOf()
        * instanceof

      * 例子：

            var proto = {};
            var p = new Proxy({}, {
              getPrototypeOf(target) {
                return proto;
              }
            });
            Object.getPrototypeOf(p) === proto // true
        上面代码中，getPrototypeOf方法拦截Object.getPrototypeOf()，返回proto对象。
        ps:
          1. getPrototypeOf方法的返回值必须是对象或者null，否则报错
          2. 如果目标对象不可扩展（non-extensible）， getPrototypeOf方法必须返回目标对象的原型对象。

  10. isExtensible() 拦截Object.isExtensible()操作
      * Object.isExtensible() 判断是否可以为对象添加新的属性
        参数：
          * object 要进行判断的对象
        返回值：
          * 是个布尔值，true是可以添加，false不可以添加
        例子：

                let obj = { 
                  name: 'peter',
                  age:25
                }
                console.log(Object.isExtensible(obj)) // true
          
        对象默认情况下是可以添加新的属性的。
      * 例子：

            var p = new Proxy({}, {
              isExtensible: function(target) {
                console.log("called");
                return true;
              }
            });
            Object.isExtensible(p) // called
      这个方法有一个强限制，它的返回值必须与目标对象的isExtensible属性保持一致，否则就会抛出错误。
      即：Object.isExtensible(proxy) === Object.isExtensible(target)

  11. preventExtensions() 拦截Object.preventExtensions()操作
      * Object.preventExtensions(object) 不能再为此对象添加新的属性或者方法
        * 参数：object，要成为不可扩展的对象的对象
        * 无返回值
        * 例子

              let obj = { 
                name: 'peter',
                age:25
              } 
              Object.preventExtensions(obj)
              obj.color = 'red' // object is not extensible
      * 例子
        ————————————
  12. setPrototypeOf() 拦截Object.setPrototypeOf方法
      * Object.setPrototypeOf(obj,proto) 设置对象的原型
      此方法修改的是对象实例的内部属性[[Prototype]]，也就是__proto__属性所指向的对象，它只是修改了特定对象上的原型对象，对于构造函数的prototype指向的原型对象没有影响      
        * 参数：
          * obj 对其设置原型的对象
          * proto 新的原型对象
        * 例子：
          
          let proto = {
            color: red
          };
          let obj = {
            name: 'peter'
            age: 26
          };
          Object.setPrototypeOf(obj, proto);
          console.log(obj.color); // red
      * 例子

            var handler = {
              setPrototypeOf (target, proto) {
                throw new Error('Changing the prototype is forbidden');
              }
            };
            var proto = {};
            var target = function () {};
            var proxy = new Proxy(target, handler);
            Object.setPrototypeOf(proxy, proto);
            // Error: Changing the prototype is forbidden
        上面代码中，只要修改target的原型对象，就会报错。
      * ps
        1. 该方法只能返回布尔值，否则会被自动转为布尔值
        2. 如果目标对象不可扩展（non-extensible），setPrototypeOf方法不得改变目标对象的原型
  13. ownKeys() 用来拦截对象自身属性的读取操作
      * 如下：
        * Object.getOwnPropertyNames(obj) 获取对象的属性名称，并存储在数组中。
          * 参数解释： obj 要获取属性名称的对象
          * 返回值：存放属性名称的数组
          * 只能拿到对象的自有属性，拿不到原型上的属性，另外，defineProperty的值也可以拿到
          * 例子：

                function Person(){
                  this.name = 'peter'
                  this.age = 26
                }
                Person.prototype={
                  address:"北京"
                }
                let peter=new Person();
                console.log(Object.getOwnPropertyNames(peter)); // ['name','age']

        * Object.getOwnPropertySymbols(obj) 返回一个给定对象自身的所有 Symbol 属性的数组
          * 参数解释： obj 要返回 Symbol 属性的对象
          * 返回值： 在给定对象自身上找到的所有 Symbol 属性的数组。
          * 例子：

                var obj = {};
                var a = Symbol("a");
                var b = Symbol.for("b");

                obj[a] = "localSymbol";
                obj[b] = "globalSymbol";

                var objectSymbols = Object.getOwnPropertySymbols(obj);

                console.log(objectSymbols.length); // 2
                console.log(objectSymbols)         // [Symbol(a), Symbol(b)]
                console.log(objectSymbols[0])      // Symbol(a)
        * Object.keys() 返回一个由一个给定对象的自身可枚举属性组成的数组，数组中属性名的排列顺序和使用 for...in 循环遍历该对象时返回的顺序一致
          * 参数：obj 要返回其枚举自身属性的对象
          * 返回值： 一个表示给定对象的所有可枚举属性的字符串数组
          * 例子：

                var obj = { 0: 'a', 1: 'b', 2: 'c' };
                console.log(Object.keys(obj)); // ['0', '1', '2']
        * for...in循环
          ————————————
      * 例子之一：
      
            var p = new Proxy({}, {
              ownKeys: function(target) {
                return ['a', 'b', 'c'];
              }
            });

            Object.getOwnPropertyNames(p)
            // [ 'a', 'b', 'c' ]

#### 五 Proxy.revocable(target, handler) 
  返回一个可取消的 Proxy 实例
  * 参数解释：
    * target 用Proxy包装的目标对象（可以是任何类型的对象，包括原生数组，函数，甚至另一个代理）。
    * handler 拦截对象，其属性是当执行一个操作时定义代理的行为的函数。
  * 返回值
    返回一个包含了所生成的代理对象本身以及该代理对象的撤销方法的对象
    其结构为： {"proxy": proxy, "revoke": revoke}，其中：
      * proxy
      表示新生成的代理对象本身，和用一般方式 new Proxy(target, handler) 创建的代理对象没什么不同，只是它可以被撤销掉
      * revoke
      撤销方法，调用的时候不需要加任何参数，就可以撤销掉和它一起生成的那个代理对象
  * 例子：

        var revocable = Proxy.revocable({}, {
          get(target, propKey) {
            return propKey + '啦啦啦';
          }
        });
        var proxy = revocable.proxy;
        console.log(proxy.foo) // foo啦啦啦
        revocable.revoke(); // 执行撤销方法
        console.log(proxy.foo); // Uncaught TypeError: Cannot perform 'get' on a proxy that has been revoked

