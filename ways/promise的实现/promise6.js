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
    this.value = null; // 存储当前的value值
    let _resolve = (val)=>{
      let run = ()=>{
        if(this.status !== PENDING) return; // 保证当前pending状态只能切换到fullfilled或者reject
        this.status = FULLFILLED; 
        this.value = val;
        // 从成功队列里取出回调依次执行
        while(this._resolveQueue.length){
          let callback = this._resolveQueue.shift();
          callback(val)
        }
      }
      setTimeout(run)
    }

    let _reject = (val)=>{
      let run = ()=>{
        if(this.status !== PENDING) return; // 保证当前pending状态只能切换到fullfilled或者reject
        this.status = REJECT;
        this.value = val;
        // 从失败队列里取出回调依次执行
        while(this._rejectQueue.length){
          let callback = this._rejectQueue.shift();
          callback(val)
        }
      }
      setTimeout(run)
    }

    // new Promise()时立即执行executor,并传入resolve和reject
    executor(_resolve,_reject)
  }

  
  then(resolveFn,rejectFn){
    // 根据规范，如果then的参数不是function，则我们需要忽略它, 让链式调用继续往下执行
    typeof resolveFn !== 'function' ? resolveFn = value => value : null
    typeof rejectFn !== 'function' ? rejectFn = value => {
      throw new Error(value)
    }:null;
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
      

      let _rejectFn = (val)=>{
        try{
          let x = rejectFn(val);
          x instanceof myPromise ? x.then(resolve,reject):resolve(x);
        }catch(err){
          reject(err)
        }
      }
      


      switch(this.status){
        case PENDING :
          this._resolveQueue.push(_resolveFn); // then之后直接push到各个队列中
          this._rejectQueue.push(_rejectFn);
          break;

        // 当状态已经变为resolve/reject时,直接执行then回调
        case FULLFILLED:
          _resolveFn(this.value);
          break;
        
        case REJECT:
          _rejectFn(this.value);
      }
    })

    
    
  }

  //catch方法其实就是执行一下then的第二个回调
  catch(rejectFn) {
    return this.then(undefined, rejectFn)
  }

  static resolve(value) {
    if(value instanceof myPromise) return value // 根据规范, 如果参数是Promise实例, 直接return这个实例
    return new myPromise(resolve => resolve(value))
  }

  static reject(value) {
    return new myPromise((resolve, reject) => reject(value))
  }

  static all(arr){
    return new myPromise((resolve,reject)=>{
      let values = [];
      let count = 0;
      for(let [p,i] of arr.entries()){
        myPromise.resolve(p).then(res=>{
          values[i] = res;
          count++;
          if(count == arr.length) resolve(values)
        },err=>{
          reject(err)
        })
      }
    })
  }

  static race(arr){
    return new myPromise((resolve,reject)=>{
      for(let p of arr.entries()){
        this.resolve(p).then(res=>{
          resolve(res)
        },err=>{
          reject(err)
        })
      }
    })
  }

  finally(callbak){
    return this.then(res=>{
      return myPromise.resolve(callbak()).then(()=>res)
    },err=>{
      return myPromise.resolve(callbak()).then(()=>{throw er})
    })
  }
}



// 测试
const p1 = new myPromise((resolve, reject) => {
  resolve(1)          //同步executor测试
})

p1
  .then(res => {
    console.log(res)
    return 2          //链式调用测试
  })
  .then()             //值穿透测试
  .then(res => {
    console.log(res)
    return new myPromise((resolve, reject) => {
      resolve(3)      //返回Promise测试
    })
  })
  .then(res => {
    console.log(res)
    throw new Error('reject测试')   //reject测试
  })
  .then(() => {}, err => {
    console.log(err)
  })

// 输出 
// 1 
// 2 
// 3 
// Error: reject测试