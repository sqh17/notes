
class myPromise {
  // 构造方法接收一个回调
  constructor(executor){
    this._resolveQueue = []    // then收集的执行成功的回调队列
    this._rejectQueue = [] // then收集的执行失败的回调队列

    let _resolve = (val)=>{
      // 从成功队列里取出回调依次执行
      // 当 promise 成功状态时，所有 onFulfilled 需按照其注册顺序依次回调
      while(this._resolveQueue.length){
        let callback = this._resolveQueue.shift();
        callback(val)
      }
    }

    let _reject = (val)=>{
      // 从失败队列里取出回调依次执行
      while(this._rejectQueue.length){
        let callback = this._rejectQueue.shift();
        callback(val)
      }
    }

    // new Promise()时立即执行executor,并传入resolve和reject
    executor(_resolve,_reject)
  }

  
  then(resolve,reject){
    // then 方法可以被同一个 promise 对象调用多次
    
    this._resolveQueue.push(resolve); // then之后直接push到各个队列中

    this._rejectQueue.push(reject)
  }
}



// 测试
const p1 = new myPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('啦啦啦啦')
  }, 1000);
})
p1.then(res => console.log(res))
//一秒后输出啦啦啦啦