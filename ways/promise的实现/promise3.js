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

  
  then(resolveFn,rejectFn){
    //return一个新的promise
    return new myPromise((resolve,reject)=>{
      //把resolveFn重新包装一下,再push进resolve执行队列,这是为了能够获取回调的返回值进行分类讨论
      let _resolveFn = (val)=>{
        try{
          //执行第一个(当前的)Promise的成功回调,并获取返回值
          let x = resolveFn(val); 
          //分类讨论返回值,如果是Promise,那么等待Promise状态变更,否则直接resolve
          x instanceof myPromise ? x.then(resolve,reject):resolve(x);
        }catch(err){
          reject(err)
        }
      }
      this._resolveQueue.push(_resolveFn); // then之后直接push到各个队列中

      let _rejectFn = (val)=>{
        try{
          let x = rejectFn(val);
          x instanceof myPromise ? x.then(resolve,reject):resolve(x);
        }catch(err){
          reject(err)
        }
      }
      this._rejectQueue.push(_rejectFn)
    })

    
    
  }
}



// 测试
const p1 = new myPromise((resolve, reject) => {
  setTimeout(() => {
    resolve(1)
  }, 500);
})

p1
  .then(res => {
    console.log(res)
    return 2
  })
  .then(res => {
    console.log(res)
    return 3
  })
  .then(res => {
    console.log(res)
  })

//输出 1 2 3