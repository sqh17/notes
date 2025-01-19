#### 自定义组件

遵遁前端的规范，一切皆为组件

在ArkUI中，UI显示的内容均为组件，由框架直接提供的称为系统组件，由开发者定义的称为自定义组件

除了@Entry声明的入口组件之外，还有自定义组件，自定义组件的声明方式就是@Component + struct xxx

```ets
@Component
struct Child {
  @State message: string = 'Hello, World!';

  build() {
    Row() {
      Text(this.message)
        .onClick(() => {
          // 状态变量message的改变驱动UI刷新，UI从'Hello, World!'刷新为'Hello, ArkUI!'
          this.message = 'Hello, ArkUI!';
        })
    }
  }
}
export defualt Child
```

```ets
import Child from './Child'
@Entry
@Component
struct Index{
 private name:string = 'peter'
 @State msg:string = 'hello'
 build(){
  Column(){
   Child()
   Text('父组件')
  }
 }
}
```

__如果在另外的文件中引用该自定义组件，需要使用export关键字导出，并在使用的页面import该自定义组件。__

##### 名词解释

1. struct
   自定义组件基于struct实现，struct + 自定义组件名 + {...}的组合构成自定义组件，不能有继承关系。对于struct的实例化，可以省略new
   eg：自定义组件名、类名、函数名不能和系统组件名相同

2. @Component
   @Component装饰器仅能装饰struct关键字声明的数据结构。struct被@Component装饰后具备组件化的能力，需要实现build方法描述UI，一个struct只能被一个@Component装饰

3. build()函数
   build()函数用于定义自定义组件的声明式UI描述，自定义组件必须定义build()函数

   注意点：

   1. 根节点唯一且必要
   2. 不允许声明本地变量
   3. 不允许在UI描述里直接使用console.info，但允许在方法或者函数里使用
   4. 不允许创建本地的作用域
   5. 不允许调用没有用@Builder装饰的方法，允许系统组件的参数是TS方法的返回值
   6. 不允许switch语法，如果需要使用条件判断，请使用if
   7. 不允许使用表达式，可以使用三元表达式，是基于变量而言的

4. private/public/@State/@Link/@Prop
   变量声明，因为是基于class实现的方式，所以在变量声明也可以参考class类来写

5. 通用样式可链式调用

##### 生命周期

![生命周期](/Users/shiqinghao/study/notes/images/arktsUICycle.png)

自定义组件：@Component装饰的UI单元

1. aboutToAppear 组件即将出现时回调该接口，具体时机为在创建自定义组件的新实例后，在执行其build()函数之前执行
2. aboutToDisppear 在自定义组件析构销毁之前执行

页面：即应用的UI页面。__可以由一个或者多个自定义组件组成__，@Entry装饰的自定义组件为页面的入口组件，即页面的根节点，一个页面有且仅能有一个@Entry。只有被@Entry装饰的组件才可以调用页面的生命周期，__也可以使用自定义组件的生命周期__

1. onPageShow 页面每次显示时触发一次，包括路由过程、应用进入前台等场景
2. onPageHide 页面每次隐藏时触发一次，包括路由过程、应用进入后台等场景
3. onBackPress 当用户点击返回按钮时触发
4. aboutToAppear
5. aboutToDisppear

页面和自定义组件的显示顺序

```ets
// Index.ets
import router from '@ohos.router';

@Entry
@Component
struct MyComponent {
  @State showChild: boolean = true;

  // 只有被@Entry装饰的组件才可以调用页面的生命周期
  onPageShow() {
    console.info('Index onPageShow');
  }
  // 只有被@Entry装饰的组件才可以调用页面的生命周期
  onPageHide() {
    console.info('Index onPageHide');
  }

  // 只有被@Entry装饰的组件才可以调用页面的生命周期
  onBackPress() {
    console.info('Index onBackPress');
  }

  // 组件生命周期
  aboutToAppear() {
    console.info('MyComponent aboutToAppear');
  }

  // 组件生命周期
  aboutToDisappear() {
    console.info('MyComponent aboutToDisappear');
  }

  build() {
    Column() {
      // this.showChild为true，创建Child子组件，执行Child aboutToAppear
      if (this.showChild) {
        Child()
      }
      // this.showChild为false，删除Child子组件，执行Child aboutToDisappear
      Button('delete Child').onClick(() => {
        this.showChild = false;
      })
      // push到Page2页面，执行onPageHide
      Button('push to next page')
        .onClick(() => {
          router.pushUrl({ url: 'pages/Page2' });
        })
      Button('push to next page replace')
        .onClick(() => {
          router.replaceUrl({ url: 'pages/Page2' });
        })
    }

  }
}

@Component
struct Child {
  @State title: string = 'Hello World';
  // 组件生命周期
  aboutToDisappear() {
    console.info('[lifeCycle] Child aboutToDisappear')
  }
  // 组件生命周期
  aboutToAppear() {
    console.info('[lifeCycle] Child aboutToAppear')
  }

  build() {
    Text(this.title).fontSize(50).onClick(() => {
      this.title = 'Hello ArkUI';
    })
  }
}

// 结果：
// MyComponent aboutToAppear
// [lifeCycle] Child aboutToAppear
// Index onPageShow
```

```ets
import router from '@ohos.router';
@Entry
@Component
struct Page2{
  // 只有被@Entry装饰的组件才可以调用页面的生命周期
  onPageShow() {
    console.info('Page2 onPageShow');
  }
  // 只有被@Entry装饰的组件才可以调用页面的生命周期
  onPageHide() {
    console.info('Page2 onPageHide');
  }
  // 只有被@Entry装饰的组件才可以调用页面的生命周期
  onBackPress() {
    console.info('Page2 onBackPress');
  }
  // 组件生命周期
  aboutToAppear() {
    console.info('Page2 aboutToAppear');
  }
  // 组件生命周期
  aboutToDisappear() {
    console.info('Page2 aboutToDisappear');
  }
  build(){
    Button('back')
      .onClick(()=>{
        router.back()
      })
    
  }
}
```

1. 初始化：MyComponent aboutToAppear  --> [lifeCycle]Child aboutToAppear --> Index onPageShow

   // MyComponent aboutToAppear --> MyComponent build --> Child aboutToAppear --> Child build --> Child build执行完毕 --> MyComponent build执行完毕 --> Index onPageShow

2. delete Child:  Child aboutToDisappear

3. push to next page： Page2 aboutToAppear--> Index onPageHide --> Page2 onPageShow

   // Page2 aboutToAppear--> Index onPageHide--> page2 build --> Page2 onPageShow

4. push to next page replace: MyComponent aboutToDisappear-->[lifeCycle] Child aboutToDisappear-->Page2 aboutToAppear-->Page2 onPageShow
   //  Index onPageHide --> MyComponent aboutToDisappear --> Child aboutToDisappear --> Page2 aboutToAppear--> page2 build --> Page2 onPageShow

5. Page2点击back Page2 onPageHide-->Index onPageShow-->Page2 aboutToDisappearq（通过push to next page）

6. 点击返回按钮:  Index onBackPress

7. 最小化应用或者应用进入后台： Index onPageHide

8. 退出应用 ： Index onPageHide --> MyComponent aboutToDisappear --> Child aboutToDisappear