#### 前言
&nbsp;&nbsp;&nbsp;&nbsp;在promise出来之前，js常用解决异步方式都是采用回调函数方式，但是如果需求过多，会形成一系列的回调函数，俗称：回调地狱。导致后期阅读和维护代码特别麻烦。所以es6的Promise就是为了解决这个麻烦而出来的新对象，之前早就存在，ES6将其写进了语言标准，统一了用法，原生提供了Promise对象。
#### 定义
`Promise对象是为了简化异步编程。解决回调地狱情况。`
Promise，简单说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。重点是取决与这个事件之后的一系列动作，then()或catch()的等等。
从语法上说，Promise 是一个对象，从它可以获取异步操作的消息。Promise对象用于延迟(deferred) 计算和异步(asynchronous ) 计算。一个Promise对象代表着一个还未完成，但预期将来会完成的操作。这样表示了`一旦用了promise对象，就不能退出，直到出现结果为止（resloved或rejected）`
Promise是一个对象，可以用构造函数来创建一个Promise实例。
```javascript
let promise = new Promise((resolve, reject) =>{
    // .... some coding
    if (true){   // 异步操作成功
        resolve(value);
    } else {
        reject(error);
    }
})
promise.then(value=>{
    // 成功的回调函数
}, error=>{
    // 失败后的回调函数
})
console.log(typeof promise) // object
```
###### 参数解释
params:传参是一个回调函数。这个回调函数有两个参数resolve和reject。
* resolve: 将Promise对象的状态从“未完成”变为“成功”（即从 pending 变为 resolved），在异步操作成功时调用，并将异步操作的结果，作为参数传递出去。(简单来说就是`成功了的执行`)
* reject: 将Promise对象的状态从“未完成”变为“失败”（即从 pending 变为 rejected），在异步操作失败时调用，并将异步操作报出的错误，作为参数传递出去。(简单来说就是`失败了的执行`)
* promise之后then的参数：
    * 第一个参数是成功的回调函数，必选
    * 第二个参数是失败的回调函数,可选
    ```javascript
    // 成功时
    let promise = new Promise((resolve, reject) =>{
        console.log('开始')
        if (2 > 1){   // 异步操作成功
            resolve({name:'peter',age:25});
        } else {
            reject(error);
        }
    })
    promise.then(value=>{
        // 成功的回调函数
        console.log(value)
    }, error=>{
        // 失败后的回调函数
        console.log(error)
    })
    // 开始
    // {name: "peter", age: 25} 
    ```
    ```javascript
    // 失败时
    let promise = new Promise((resolve, reject) =>{
        console.log('开始')
        if (2 > 3){   // 异步操作成功
            resolve(a);
        } else {
            reject('未知错误');
        }
    })
    promise.then(value=>{
        // 成功的回调函数
        console.log(value)
    }, error=>{
        // 失败后的回调函数
        console.log(error)
    })
    // 开始
    // 未知错误
    ```
ps：Promise实例化一个对象后，会立即实行。
```javascript
new Promise((resolve, reject)=>console.log('promise'));
console.log('123');
// promise
// 123
```
这个结果发现，先执行promise后执行123。

##### Promise的特点
* 对象的状态不受外界影响。Promise对象代表一个异步操作，有三种状态：pending（进行中）、fulfilled（已成功）和rejected（已失败）。只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态。
* 一旦状态改变，就不会再变，任何时候都可以得到这个结果。就是成功了就一直是成功的状态fulfilled，失败一直是失败的状态rejected。

`如果改变已经发生了，你再对Promise对象添加回调函数，也会立即得到这个结果。这与事件（Event）完全不同，事件的特点是，如果你错过了它，再去监听，是得不到结果的`

promise先按顺序实行完promise实例中方法再实行then中的resolve或者reject。
```javascript
let promise = new Promise((resolve, reject)=>{
    console.log('promise')
    if (2 > 1){   // 异步操作成功
        resolve({name:'peter',age:25});
    } else {
        reject(error);
    }
    console.log('end')
})
promise.then(
    value=>{
        console.log(value)
    },
    error=>{
        console.log(error)
    }
)
// promise
// end 
// {name: "peter", age: 25}
```
ajax是最常见的异步操作方式，那么用promise封装Ajax的例子
```javascript
const getJSON = function (url) {
    const promise = new Promise(function (resolve, reject) {
        const handler = function () {
            if (this.readyState !== 4) {
                return;
            }
            if (this.status === 200) {
                resolve(this.response);
            } else {
                reject(new Error(this.statusText));
            }
        };
        const client = new XMLHttpRequest();
        client.open("GET", url);
        client.onreadystatechange = handler;
        client.responseType = "json";
        client.setRequestHeader("Accept", "application/json");
        client.send();
    });
    return promise;
};

getJSON("xxxxx").then(function (value) {
    console.log('Contents: ' + value);
}, function (error) {
    console.error('出错了', error);
});
```

##### Promise方法

###### promise.then()
then() 为 Promise 实例添加状态改变时的回调函数,上面已经提起过。
params解释:
* 第一个参数是resolved状态的回调函数， 必选
* 第二个参数是rejected状态的回调函数, 可选

通常情况下，then方法作为成功时的回调方法，catch方法作为失败时回调方法。catch()在后面,可以理解为then方法中的reject参数
```javascript
let promise = new Promise((resolve, rejected)=>{
    if(2<3){
        resolve()
    }else{
        rejected()
    }
})
promise.then(resolve=>{
    console.log('right')
}).catch(reject=>{
    console.log('error')
})
```

`ps: then方法返回的是一个新的Promise实例（注意，不是原来那个Promise实例）。`
```javascript
var aPromise = new Promise(function (resolve) {
    resolve(100);
});
var thenPromise = aPromise.then(function (value) {
    console.log(value);
});
var catchPromise = thenPromise.catch(function (error) {
    console.error(error);
});
console.log(aPromise !== thenPromise); // => true
console.log(thenPromise !== catchPromise);// => true
```
所以每一个then()方法就是一个新promise对象。因此可以采用链式写法，即then方法后面再调用另一个then方法。这样必须要传一个参数过去。
promise的链式编程，就是第一个的Promise实例的返回的值作为下一个Promise实例的参数。
```javascript
function start() {
    return new Promise((resolve, reject) => {
        resolve('start');
    });
}
start()
    .then(data => {
        // promise start
        console.log(data);
        return Promise.resolve(1); // 1
    })
    .then(data => {
        // promise 1
        console.log(data);
    })
// start
// 1
```
从上面例子可知：
* start函数里resolve里传了一个参数‘start’
* 第一个then方法接受了start,然后return 一个成功的值 1
* 第二个then方法接受上一个then传来的值 1

###### Promise.catch()
catch()和then()都是挂载在promise对象的原型上的。
`Promise.prototype.catch`方法是`promise.then(null, rejection`)或`promise.then(undefined, rejection)`的别名，用于指定发生错误时的回调函数。
一般是等价于：（在遇到失败的情况下）
`Promise.catch()` <=> `promise.then(null,e=>reject())`
如果异步操作抛出错误，状态就会变为rejected，就会调用catch方法指定的回调函数，处理这个错误。另外，then方法指定的回调函数，如果运行中抛出错误，也会被catch方法捕获。
```javascript
const promise = new Promise(function(resolve, reject) {
  throw new Error('test');
});
promise.catch(function(error) {
  console.log(error);
});
// Error: test
```
`Promise 对象的错误具有“冒泡”性质，会一直向后传递，直到被捕获为止。也就是说，错误总是会被下一个catch语句捕获。`
```javascript
function throwError(value) {
    // 抛出异常
    throw new Error(value);
}
// <1> onRejected不会被调用
function badMain(onRejected) {
    return Promise.resolve(42).then(throwError, onRejected);
}
// <2> 有异常发生时onRejected会被调用
function goodMain(onRejected) {
    return Promise.resolve(42).then(throwError).catch(onRejected);
}
// 运行示例
badMain(function(){
    console.log("BAD");
});
goodMain(function(){
    console.log("GOOD");
});
// GOOD
```
在上面的代码中， badMain 是一个不太好的实现方式（但也不是说它有多坏）， goodMain 则是一个能非常好的进行错误处理的版本。
为什么说 badMain 不好呢？，因为虽然我们在 .then 的第二个参数中指定了用来错误处理的函数，但实际上它却不能捕获第一个参数 onFulfilled 指定的函数（本例为 throwError ）里面出现的错误。也就是说，这时候即使 throwError 抛出了异常，onRejected 指定的函数也不会被调用（即不会输出"BAD"字样）。
与此相对的是， goodMain 的代码则遵循了 throwError→onRejected 的调用流程。 这时候 throwError 中出现异常的话，在会被方法链中的下一个方法，即 .catch 所捕获，进行相应的错误处理。
.then 方法中的onRejected参数所指定的回调函数，实际上针对的是其promise对象或者之前的promise对象，而不是针对 .then 方法里面指定的第一个参数，即onFulfilled所指向的对象，这也是 then 和 catch 表现不同的原因。（详见Javascript Promise 迷你版）
这个是从别人的博客拿来的代码和解释，了那么多，总结为，`catch能够捕获它之前的异常，而在then()方法中第二个参数是没办法捕获到的，因为实行了resolve方法。`

###### Promise.resolve()
看字面量的意思，是返回一个成功的promise实例。
`Promise.resolve()` <=> `new Promise((resolve,rejected)=>resolve())`
最常见的就是将不是promise对象的异步操作转化为promise对象。
该方法有四个参数：
* 无参数
    直接返回一个resolved状态的 Promise 对象，所谓的字面量意思。
* 参数是一个 Promise 实例
    Promise.resolve将不做任何修改、原封不动地返回这个实例。
* 参数是一个thenable对象
    所谓的thenable对象指的就是具有then方法的对象，类似于类数组具有数组的length，但不是数组一样。
    ```javascript
    let thenable = {
        then: function(resolve, reject) {
            resolve(42);
        }
    };
    var promise = Promise.resolve(thenable)
                .then(value=>console.log(value));// 42
    ```
    上面的例子就是将具有then方法的thenable对象转化为promise对象，并且立即执行resolve方法。
* 参数不是具有then方法的对象，或根本就不是对象
    如果参数是一个原始值，或者是一个不具有then方法的对象，则Promise.resolve方法返回一个新的 Promise 对象，状态为resolved。
    ```javascript
    var str = '17号'
    Promise.resolve(str).then(value=>console.log(value)) // 17号
    ```

###### Promise.reject()
返回一个新的 Promise 实例，该实例的状态为rejected。用法和resolve一样，但是都是以失败返回结果
`Promise.reject()` <=> `new Promise((resolve,reject) = >reject())`

`ps:Promise.reject()方法的参数，会原封不动地作为reject的理由，变成后续方法的参数。这一点与Promise.resolve方法不一致。`
```javascript
const thenable = {
  then(resolve, reject) {
    reject('出错了');
  }
};

Promise.reject(thenable)
        .catch( e=> {
            console.log(e)
        })
// 返回的是thenable对象
```

###### Promise.all()
Promise.all 接收一个 promise对象的数组作为参数，当这个数组里的所有promise对象全部变为resolve或reject状态的时候，它才会去调用 .then() 方法。
* 该方法的参数是一个数组
* 该方法的参数数组是必须含有promise对象的数组
* 只有数组中所有的promise对象都变成resolve或者reject才能进行下一步操作。
```javascript
// `delay`毫秒后执行resolve
function timerPromisefy(delay) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve(delay);
        }, delay);
    });
}
var startDate = Date.now();
// 所有promise变为resolve后程序退出
Promise.all([
    timerPromisefy(1),
    timerPromisefy(32),
    timerPromisefy(64),
    timerPromisefy(128)
]).then(function (values) {
    console.log(Date.now() - startDate + 'ms');
    console.log(values); 
});
// 129ms
// 1,32,64,128
```
从上述结果可以看出，传递给 Promise.all 的promise并不是一个个的顺序执行的，而是同时开始、并行执行的。
假设法：如果这些promise全部串行处理的话，那么需要 等待1ms → 等待32ms → 等待64ms → 等待128ms ，全部执行完毕需要225ms的时间。但实际上不是，而是129ms左右。

###### Promise.race()
和Promise.all()方法一样，参数是一个数组，但是只要有一个promise对象更改状态时就实行下一步。
```javascript
// `delay`毫秒后执行resolve
function timerPromisefy(delay) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve(delay);
        }, delay);
    });
}
// 任何一个promise变为resolve或reject 的话程序就停止运行
Promise.race([
    timerPromisefy(1),
    timerPromisefy(32),
    timerPromisefy(64),
    timerPromisefy(128)
]).then(function (value) {
    console.log(value);    // => 1
});
```
上面的例子是1秒后就resolve了，所以直接then()了。

###### Promsie.finally()
该方法用于指定不管 Promise 对象最后状态如何，都会执行的操作。无论resolve还是reject都会实行的操作，不依赖其他的操作。按照执行顺序。
```javascript
function promise(){
    return new Promise((resolve, reject) => {
        resolve('success');
    })
};
promise().then(data => {
    console.log(data)
    return Promise.reject('fail')
}).finally(() => {
    console.log('end')
}).catch(data =>{
    console.log(data)
})
// success
// end
// fail
```
从上面的例子可知，是按照promise的实行顺序执行的，在then()中，要求返回一个失败的状态，但是却没先实行失败的方法，而是按照顺序实行了finally方法。

###### Promise.done()
Promise 对象的回调链，不管以then方法或catch方法结尾，要是最后一个方法抛出错误，都有可能无法捕捉到（因为 Promise 内部的错误不会冒泡到全局）。因此，我们可以提供一个done方法，总是处于回调链的尾端，保证抛出任何可能出现的错误。
```javascript
Promise.prototype.done = function (resolve, reject) {
    this.then(resolve, reject)
        .catch( function (reason) {
            // 抛出一个全局错误
            setTimeout( () => { throw reason }, 0);
        });
}

// 使用示例
var p = new Promise( (resolve, reject) => {
    resolve('p');
});
p.then(ret => {
    console.log(ret);
    return 'then1';
}).catch( err => {
    console.log(err.toString());
}).then( ret => {
    console.log(ret);
    return 'then2';
}).then( ret => {
    console.log(ret);
    x + 2;
}).done();
```
该例子参考别人的例子。发现到最后直接抛出了 'Uncaught ReferenceError: x is not defined'。说明最后一个then实行时会抛出异常,也可以类似于catch方法吧。



###### 参考资料
[ES6标准入门](http://es6.ruanyifeng.com/#docs/promise)
[Javascript Promise 迷你版](http://liubin.org/promises-book/#introduction)
[学习Promise](https://segmentfault.com/a/1190000007685095)
