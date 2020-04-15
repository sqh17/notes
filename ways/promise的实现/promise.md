
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

##### 第三步 细节处理

* 根据Promise/A+规范，如果then()接收的参数不是function，应该忽略，而抛出异常，而不是链式中断。
* 处理状态为resolve/reject的情况，因为有三种状态，那么pending的时候应该push到队列中，如果状态已经确定的话，已为fullfilled或者rejected。then返回的是resolve的promise那么应该直接执行resolve的回调，相同的reject则执行reject的回调。

参考 promise4.js







##### 参考博文：
  [写代码像蔡徐抻 --- 异步编程二三事 | Promise/async/Generator实现原理解析](https://juejin.im/post/5e3b9ae26fb9a07ca714a5cc)