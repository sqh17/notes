#### 异步操作async
#### 1 含义
关于异步操作，在es6之前，一直都是
回调函数，
事件监听，
发布/订阅
promise对象
（摘自es6的Generator函数的异步应用），这四个为主，再加上es6出来的promise对象以及后来的Generator函数，都可以解决异步编程。es7引入的async函数，使得异步操作变得更加方便

`async函数，就是Generator 函数的语法糖`，基于Generator 函数而来的，只是为了书写代码时更加流畅，增强代码的可读性。`async的返回值就是个promise对象`，进一步说，async函数完全可以看作多个异步操作，包装成的一个 Promise 对象，而await命令就是内部then命令的语法糖。

#### 2基本语法
  async函数返回一个 Promise 对象，可以使用then方法添加回调函数。当函数执行的时候，一旦遇到await就会先返回，等到异步操作完成，再接着执行函数体内后面的语句。

    async function demo(val) {
      let result = await `hello,${val}`;
      return result;
    }
    demo('peter').then((val)=>{console.log(`${val},哈哈哈哈`)}) // hello,peter,哈哈哈哈
    console.log(demo('peter'))  // Promise{<pending>}
  
  上述就是async的最基本语法，这看起来和普通的函数没有什么区别，只是多了两个关键字async和await,以及返回的promise的实例。

  ##### async
  是异步操作的说明，在普通函数名前面加上async代表了是一个异步操作，async函数返回一个 Promise 对象，async函数return语句返回的值，会成为then方法回调函数的参数

    async function f() {
      return 123;
    }

    f().then(val => {
      console.log(val);// 123
    });
  将当于

    async function f() {
        return await new Promise(function(resolve){
            resolve(123)
        })
    }
    f().then(v => console.log(v)) // 123
  
  也将当于

    async function f() {
      return await Promise.resolve('123')
    }
    f().then(v => console.log(v))
  将async的return的值作为参数传递给then函数。

  ##### await
  await 可以理解为是 async wait 的简写。`await 必须出现在 async 函数内部，不能单独使用，否则会报错`。

    function foo() {
      await 123;
    }
    foo();//Uncaught SyntaxError: await is only valid in async function
  这就是没有在函数名前面声明async报的错，相反的，声明了async，没有使用await不会报错

  await 后面可以跟任何的JS 表达式。虽然说 await 可以是很多类型的东西，但是它最主要的意图是用来等待 Promise 对象的状态被 resolved。
  
  * async function foo() {}// 函数声明
  * const foo = async function () {};// 函数表达式
  * let obj = { async foo() {} };
     obj.foo().then(...)// 对象的方法
  * class Foo {// Class 的方法
      constructor() {  }
      async foo(name) { }
    }
  * const foo = async () => {};// 箭头函数

  `如果await的是promise对象会造成异步函数停止执行并且等待promise的解决,如果等的是正常的表达式则立即执行。`

  另外：await命令后面的 Promise 对象如果变为reject状态，则reject的参数会被catch方法的回调函数接收到。

    async function f() {
      await Promise.reject('出错了');
    }

    f()
    .then(v => console.log(v))
    .catch(e => console.log(e)) // 出错了

  ps: `任何一个await语句后面的 Promise 对象变为reject状态，那么整个async函数都会中断执行。`
    
    async function f() {
      await Promise.reject('出错了');
      return await Promise.resolve('hello world');
    }
    f()
    .then(v => console.log(v))
    .catch(e => console.log(e)) // 出错了
  上述代码在await的时候，实行了promise的reject方法，会直接终端执行，直接实行reject的方法

#### 3 错误处理／异常处理

  防止出错的方法，也是将其放在try...catch代码块之中，这样又能实行剩下的部分。
  
    function time(ms){
      if(ms<3000){
        setTimeout(()=>{
          console.log('ms',ms)
          return ms
        },ms)
      }else{
        return Promise.reject('出错了')
      }
    }
    async function f() {
      try {
        let a = await time(1000)
        let b = await time(2000)
        let c = await time(3000)
      } catch(e) {
        console.log('e',e) // 'e' 出错了
      }
      return await('hello world');
    }
    f().then(val=>{
      console.log(val) // hello world
    }).catch(val=>{
      console.log(val)
    })
  先报错‘出错了’，再‘hello world’ 再依次打印出‘1000’，‘2000’
  因为有了reject之后，就无法往下进行,但是最后return是返回一个resolve的值给then()
#### 4 注意点
有的注意点上面已经提到了，先总结如下：
* await 必须出现在 async 函数内部，不能单独使用，否则会报错。
* await命令后面的Promise对象，运行结果可能是rejected，所以最好把await命令放在try...catch代码块中，多个await也是如此。
* 多个await命令后面的异步操作，如果不存在继发关系，最好让它们同时触发,所谓的继发就是，不相互关联的异步操作，比如第一个异步的返回值给第二个异步这样的例子。

      function time(ms){
        return new Promise((resolve,reject)=>{
          setTimeout(function(){
            resolve()
          },ms)
        })
      }
      async function f() {
        try {
          let a = time(1000)
          let b = time(2000)
          await Promise.all([a,b]); // 不加Promise.all()的话，3s才实行完,加上Promise.all()的话，2s实行完
          console.log('~~~')
        } catch(e) {
          console.log('e',e) // 'e' 出错了
        }
      }
      f()
* await必须在async函数的上下文中的作用域中

      //for 循环
      async function a() {
          let arr = [1, 2, 3, 4, 5];
          for (let i = 0; i < arr.length; i ++) {
              await arr[i];
          }
      }
      a();
      // forEach循环
      async function b() {
        let arr = [1, 2, 3, 4, 5];
        arr.forEach(item => {
            await item;
        });
      }
      b();// Uncaught SyntaxError: Unexpected identifier
原因就是forEach就是一个单独的作用域，会报错。

##### 总结
  async-await函数就是为了简化异步操作的一种方式，大部分就是结合promise使用，离开不了promise，就像那个并发实行需要使用promise的方法。妥善使用async-await，会给自己对异步操作带来很大的便利。