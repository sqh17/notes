//Promise/A+规范的三种状态
let PENDING = 'pending' // 实行中
let FULLFILLED = 'fullfilled' // 成功
let REJECT = 'rejected' // 拒绝

class myPromise {
  // 构造方法接收一个回调
  constructor(executor){
    this._resolveQueue = []    // then收集的执行成功的回调队列
    this._rejectQueue = [] // then收集的执行失败的回调队列
    this.status = PENDING; // 初始化状态
    let _resolve = (val)=>{
      if(this.status !== PENDING) return; // 保证当前pending状态只能切换到fullfilled或者reject
      this.status = FULLFILLED; 
      // 从成功队列里取出回调依次执行
      while(this._resolveQueue.length){
        let callback = this._resolveQueue.shift();
        callback(val)
      }
    }

    let _reject = (val)=>{
      if(this.status !== PENDING) return; // 保证当前pending状态只能切换到fullfilled或者reject
      this.status = REJECT;
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