const PENDING_STATE = "pending";
const FULFILLED_STATE = "fulfilled";
const REJECTED_STATE = "rejected";

const isFunction = function(fun) {
  return typeof fun === "function";
};

const isObject = function(value) {
  return value && typeof value === "object";
};

class Promise{
  constructor(excutor){
    if (!this || this.constructor !== Promise) {
      throw new TypeError("Promise must be called with new");
    }
    
    if (!isFunction(excutor)) {
      throw new TypeError("Promise constructor's argument must be a function");
    }
  
    this.state = PENDING_STATE; // promise实例的状态
    this.value = void 0; // promise的决议值
  
    this.onFulfilledCallbacks = []; // 保存完成回调
    this.onRejectedCallbacks = []; // 保存拒绝回调


    const resolve = value => {
      resolutionProcedure(this, value);
    };
    const resolutionProcedure = function(promise, x) {
      // 判断x是否是promise自身
      if (x === promise) {
        return reject(new TypeError("Promise can not resolved with it seft"));
      }
  
      // 判断是否是thenable
      if (isObject(x) || isFunction(x)) {
        let called = false;
        try {
          let then = x.then;
          if (isFunction(then)) {
            /**
             * Promises/A+：
             * 2.3.3.3 如果then是一个函数，则用x调用它；第一个参数是 resolvePromise，第二个参数是 rejectPromise；
             * 2.3.3.3.3 如果同时调用 resolvePromise 和 rejectPromise，或者多次调用同一个参数，则第一个调用具有优先权，后续的调用将被忽略。（所以需要使用 called 进行控制）
             */
            then.call(x,
              y => {
                if (called) return;
                called = true;
                // Promises/A+：2.3.3.3.1 如果使用一个值y调用了resolvePromise，则执行[[Resolve]](promise, y)，即我们写的 resolutionProcedure(promise, y);
                resolutionProcedure(promise, y);
              },
              error => {
                if (called) return;
                called = true;
                // Promises/A+：2.3.3.3.2 如果使用一个reason调用了rejectPromise，则以这个reason直接拒绝promise;
                reject(error);
              }
            );
            return;
          }
        } catch (error) {
          if (called) return;
          called = true;
          reject(error);
        }
      }

      if (promise.state === PENDING_STATE) {
        promise.state = FULFILLED_STATE;
        promise.value = x;

        while(promise.onFulfilledCallbacks.length){
          let callback = promise.onFulfilledCallbacks.shift();
          callback()
        }
      }
    };
    const reject = reason => {
      if (this.state === PENDING_STATE) {
        this.state = REJECTED_STATE;
        this.value = reason;
        while(this.onRejectedCallbacks.length){
          let callback = this.onRejectedCallbacks.shift();
          callback()
        }
      }
    };
    try{
      excutor(resolve, reject)
    }
    catch(err){
      reject(err)
    }
  }
  then(onFulfilled, onRejected){

    onFulfilled = isFunction(onFulfilled) ? onFulfilled : value => value;
    onRejected = isFunction(onRejected) ? onRejected: error => {  throw error; };

    // 2. 返回一个新的promise实例promise2
    return new Promise((resolve, reject) => {
      // 2.1 包装onFulfilled和onRejected为异步函数
      let wrapOnFulfilled = () => {
        let run = () => {
          try {
            let x = onFulfilled(this.value);
            resolve(x);
          } catch (error) {
            reject(error);
          }
        }
        setTimeout(run, 0);
      };
      let wrapOnRejected = () => {
        let run = () => {
          try {
            let x = onRejected(this.value);
            resolve(x);
          } catch (error) {
            reject(error);
          }
        }
        setTimeout(run, 0);
      };

      switch(this.state){
        case FULFILLED_STATE:
          wrapOnFulfilled();
          break;
        case REJECTED_STATE:
          wrapOnRejected();
          break;
        default:
          this.onFulfilledCallbacks.push(wrapOnFulfilled);
          this.onRejectedCallbacks.push(wrapOnRejected);
          break;
      }
    });
  }
  catch(callback){
    return this.then(null, callback);
  }
  resolve(value){
    return value instanceof Promise ? value : new Promise(resolve => resolve(value));
  }
  reject(reason){
    return new Promise((resolve, reject) => reject(reason));
  }
  finally(callback){
    return this.then(
      data => {
        callback();
        return data;
      },
      error => {
        callback();
        throw error;
      }
    );
  }
  all(promises) {
    return new Promise((resolve, reject) => {
      if (!promises.length) {
        resolve([]);
      }
  
      let result = [];
      let resolvedPro = 0;
      for (let index = 0, length = promises.length; index < length; index++) {
        Promise.resolve(promises[index]).then(
          data => {
            // 注意，这里要用index赋值，而不是push。因为要保持返回值和接收到的promise的位置一致性。
            result[index] = data;
            if (++resolvedPro === length) {
              resolve(result);
            }
          },
          error => {
            reject(error);
          }
        );
      }
    });
  }
  race(promises) {
    return new Promise((resolve, reject) => {
      promises.forEach(promise => {
        Promise.resolve(promise).then(resolve, reject);
      });
    });
  }
}
// 基于Promise实现一个限制并发请求的函数
Promise.control = function (promises, limit) {
  let len = promises.length
  limit = limit ? limit : 4
  let ress = []
  let running = 0,
    index = -1,
    count = 0
  return new Promise((resolve, reject) => {
    function next() {
      while (running < limit && promises.length) {
        running++
        let i = ++index // 保存当前index
        let task = promises.shift()
        task()
          .then((res) => {
            ress[i] = res
            count++
          })
          .finally(() => {
            if (count === len) resolve(ress)
            running--
            next()
          })
      }
    }
    next()
  })
}

Promise.defer = Promise.deferred = function() {
  let dfd = {};
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
};
module.exports = Promise;



// 测试限制并发请求
let sleep = function(time){
  return ()=>{
      return new Promise((resolve,reject)=>{
          setTimeout(() => {
              resolve(time)
          }, time);
      })
  }
} // 执行函数可返回一个自定义请求事件的函数，用来模拟请求

//创建模拟请求任务
let tasks = [sleep(4000),sleep(2000),sleep(3000),sleep(2000)];
// 发送请求 并发数为2
console.time();
Promise.control(tasks,4).then((value)=>{
    console.log(value)
    console.timeEnd();
})