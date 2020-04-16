
promise的学习
------
为了研究es6的promise，手写promise。

##### 第一步 初步实现
  
  采用了观察者模式，then收集依赖 -> 异步触发resolve -> resolve执行依赖

* Promise的构造方法接收一个executor()，在new Promise()时就立刻执行这个executor回调
* executor()内部的异步任务被放入宏/微任务队列，等待执行
* then()被执行，收集成功/失败回调，放入成功/失败队列
* executor()的异步任务被执行，触发resolve/reject，从成功/失败队列中取出回调依次执行
  
简单实现promise，参考promise1.js

##### 第二步 promise A+

ES6的Promise实现需要遵循Promise/A+规范，是规范对Promise的状态控制做了要求：
* 状态的变更是单向的，只能从Pending -> Fulfilled 或 Pending -> Rejected，状态变更不可逆  ===> 参考promise2.js
* then方法接收两个可选参数，分别对应状态改变时触发的回调。
* then方法返回一个promise。then 方法可以被同一个 promise 调用多次。  ===> 参考promise3.js

##### 第三步 细节处理1

* 根据Promise/A+规范，如果then()接收的参数不是function，应该忽略，而抛出异常，而不是链式中断。
* 处理状态为resolve/reject的情况，因为有三种状态，那么pending的时候应该push到队列中，如果状态已经确定的话，已为fullfilled或者rejected。then返回的是resolve的promise那么应该直接执行resolve的回调，相同的reject则执行reject的回调。

1、如果 onFulfilled 或者 onRejected 返回一个值 x ，则运行下面的 Promise 解决过程：[[Resolve]](promise2, x)

若 x 不为 Promise ，则使 x 直接作为新返回的 Promise 对象的值， 即新的onFulfilled 或者 onRejected 函数的参数.
若 x 为 Promise ，这时后一个回调函数，就会等待该 Promise 对象(即 x )的状态发生变化，才会被调用，并且新的 Promise 状态和 x 的状态相同。

参考 promise4.js

##### 第四步 细节处理2

promise是为了异步，假设excutor是同步情况则不符合要求，则将变为异步实行 

参考 promise5.js

##### 第五步 添加方法

promise还包含其中的方法，比如catch,resolve,finally,all,race

参考 promise6.js



##### 总结

promise参考版有两个，总体来说都是一样的思路，学习为已用就是最好的。




##### 参考博文：
  [写代码像蔡徐抻 --- 异步编程二三事 | Promise/async/Generator实现原理解析](https://juejin.im/post/5e3b9ae26fb9a07ca714a5cc)
  [Promise实现原理（附源码）](https://www.jianshu.com/p/43de678e918a)