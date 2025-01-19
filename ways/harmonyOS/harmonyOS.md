harmonyOS学习笔记

## 应用配置文件

一般创建一个项目，都会有默认的配置文件。

主要有以下：

1. .hvigor (Directory)  

2. .idea (Directory)

3. AppScope (Directory)

   1. resource

   2. app.json5 应用的全局配置信息

      ```json
      {
        "app": {
          "bundleName": "com.application.myapplication", // 标识应用的Bundle名称，用于标识应用的唯一性
          "bundleType": "app", // 标识应用的Bundle类型，用于区分应用或者原子化服务
          "vendor": "example", // 标识对应用开发厂商的描述
          "versionCode": 1000000, // 标识应用的版本号
          "versionName": "1.0.0", // 标识应用版本号的文字描述，用于向用户展示
          "icon": "$media:app_icon", // 标识应用的图标
          "label": "$string:app_name", // 标识应用的名称
          "description": "$string:description_application", // 标识应用的描述信息
          "minAPIVersion": 9, // 标识应用运行需要的SDK的API最小版本
          "targetAPIVersion": 9, // 标识应用运行需要的API目标版本。
          "apiReleaseType": "Release", // 标识应用运行需要的API目标版本的类型
          "multiProjects": false, // 标识当前工程是否支持多个工程的联合开发
          "debug": false, // 标识应用是否可调试，该标签由IDE编译构建时生成
          "car": { // 标识对car设备做的特殊配置
            "minAPIVersion": 8,
            "distributedNotificationEnabled": 
          },
          "tablet": {
            "minAPIVersion": 8,
            "distributedNotificationEnabled": 
          },
          "tv": {
            "minAPIVersion": 8,
            "distributedNotificationEnabled": 
          },
          "phone": {
            "minAPIVersion": 8,
            "distributedNotificationEnabled": 
          }
        },
      }
      ```

4. entry (Directory)  HarmonyOS的工程模块

   1. src

      1. main

         1. ets  (Directory) 存放ArkTS源码，就是编写的功能应用

            1. entryability 应用/服务的入口
            2. pages  应用/服务包含的页面

         2. resources 用于存放应用/服务所用到的资源文件，如图形、多媒体、字符串、布局文件等

         3. module.json5 Stage模型模块配置文件。主要包含HAP包的配置信息、应用/服务在具体设备上的配置信息以及应用/服务的全局配置信息

            ```json
            {
              "module": {
                "name": "entry", // 当前Module的名称
                "type": "entry", // 当前Module的类型 entry feature
                "description": "$string:module_desc", // 当前Module的描述信息
                "mainElement": "EntryAbility", // 当前Module的入口UIAbility名称或者ExtensionAbility名称
                "deviceTypes": [ // 当前Module可以运行在哪类设备上
                  "phone",
                  "tablet"
                ],
                "deliveryWithInstall": true, // 当前Module是否在用户主动安装的时候安装，表示该Module对应的HAP是否跟随应用一起安装
                "installationFree": false, // 当前Module是否支持免安装特性
                "pages": "$profile:main_pages", // 当前Module的profile资源，用于列举每个页面信息，类似于路由,通过profile下的资源文件配置
                "metadata": [{ // 该标签标识HAP的自定义元信息
                  "name": "module_metadata", 
                  "value": "a test demo for module metadata",
                  "resource": "$profile:shortcuts_config",
                }]
                "abilities": [ // 描述UIAbility组件的配置信息
                  {
                    "name": "EntryAbility", // 当前UIAbility组件的名称，该名称在整个应用要唯一
                    "srcEntry": "./ets/entryability/EntryAbility.ts", // 该标签标识入口UIAbility的代码路径
                  "launchType": "singleton", //启动模式，singleton（单实例模式）multiton（多实例模式）specified（指定实例模式）
                    "description": "$string:EntryAbility_desc",
                  "permissions": "", // 当前UIAbility组件自定义的权限信息
                    "icon": "$media:icon",
                    "label": "$string:EntryAbility_label",
                    "startWindowIcon": "$media:icon", // 当前UIAbility组件启动页面图标资源文件的索引
                    "startWindowBackground": "$color:start_window_background", // 当前UIAbility组件启动页面背景颜色资源文件的索引
                  "removeMissionAfterTerminate": false, // 当前UIAbility组件销毁后是否从任务列表中移除任务
                    "exported": true, // 当前UIAbility组件是否可以被其他应用调用
                  "orientation": "unspecified", // 当前UIAbility组件启动时的方向 unspecified：由系统自动判断显示方向。landscape：横屏。portrait：竖屏。landscape_inverted：反向横屏。portrait_inverted：反向竖屏。auto_rotation：随传感器旋转
                  "supportWindowMode": ["fullscreen", "split", "floating"], // 当前UIAbility组件所支持的窗口模式，包含：fullscreen：全屏模式。split：分屏模式。floating：悬浮窗模式
                    "backgroundModes": [ // 当前UIAbility组件的长时任务集合。指定用于满足特定类型的长时任务
                        "dataTransfer",
                        "audioPlayback",
                        "audioRecording",
                        "location",
                        "bluetoothInteraction",
                        "multiDeviceConnection",
                        "wifiInteraction",
                        "voip",
                        "taskKeeping"
                     ],
                "excludeFromMissions": false, // 当前UIAbility组件是否在最近任务列表中显示
                    "skills": [
                     {
                      "actions": [ // 能够接收的Want的Action值的集合
                        "ohos.want.action.home"
                      ],
                      "entities": [ // 能够接收Want的Entity值的集合
                        "entity.system.home"
                      ],
                      "uris": [
                        {
                          "scheme":"http", // http、https、file、ftp
                          "host":"example.com",
                          "port":"80",
                          "path":"path",
                          "type": "text/*"
                        }
                      ]
                    }
                   ]
                  }
                ],
              "requestPermissions": [ // 应用运行时需向系统申请的权限集合
                  {
                    "name": "ohos.abilitydemo.permission.PROVIDER",
                    "reason": "$string:reason",
                    "usedScene": {
                      "abilities": [
                        "EntryFormAbility"
                      ],
                      "when": "inuse"
                    }
                  }
                ]
              }
            }
            ```

      2. ohosTest

   2. .gitignore (File)

   3. build-profile.json5 (File) 当前的模块信息、编译信息配置项，包括buildOption、targets配置等

   4. hvigorfile.ts  (File) 模块级编译构建任务脚本，开发者可以自定义相关任务和代码实现

   5. oh-package.json5  (File)

5. hvigor (Directory)

6. oh_modules (Directory) 用于存放三方库依赖信息

7. .gitignore (File) git提交忽略

8. build-profile.json5 (File)  应用级配置信息，包括签名、产品配置等

9. hvigorfile.ts  (File) 应用级编译构建任务脚本

10. hvigorw  (File)

11. hvigorw.bat  (File)

12. local.properties  (File) 记录运行当前工程的sdk和node的路径

13. oh-package.json5  (File) 类似于package.json文件，里面记录工程名，作者等

14. oh-package-lock.json5  (File)

## ArkTS语言

ArkTS是HarmonyOS优选的主力应用开发语言。ArkTS围绕应用开发在[TypeScript](https://www.typescriptlang.org/)（简称TS）生态基础上做了进一步扩展，继承了TS的所有特性，是TS的超集。这就说明了若有前端经验的，更好的上手ArkTS。

ArkTS在TS的基础上扩展了其他能力，所以学习ArkTS要学会以下知识：

1. [TS](####TS)
2. [基本语法](####基本语法)
3. [状态管理](####状态管理)
4. [渲染控制](####渲染控制)

#### TS

#### 基本语法

##### 文件构成

一个文件以 __.ets__结尾的，基本上要包含

1. 装饰器

   1. @Entry
   2. @Component
   3. @builder
   4. @State
   5. ...

2. 自定义组件
   用@Component装饰的struct Index

3. 变量声明

4. UI描述
   build方法里包含的代码块

5. 系统组件

   ArkUI框架中默认内置的基础和容器组件，可直接被开发者调用。
   就是ArkTS所支持的语法，类似于html中的标签（span，div，p，image），

6. 属性方法
   css属性，链式调用，看以下例子

7. 事件方法

```ets
@Entry  // 装饰器
@Component // 装饰器  自定义组件声明
struct Index{ // 自定义组件
 @State message: string = 'hello arkTS' // 装饰器 变量声明
 private color:string = 'red' // 变量声明
 build(){ // UI描述
  Column(){ // 系统组件
   Text(this.message) // 系统组件
    .fontSize(20)
    .fontWeight(400)
    .onClick(()=>{}) // 事件方法
  }
  .height(100) // 属性方法
 }
}
```

##### 装饰器

###### @Entry

入口文件的标识，@Entry装饰的自定义组件将作为UI页面的入口。在单个UI页面中， __最多可以使用@Entry装饰一个自定义组件__

只能有一个build函数，其build()函数下的根节点唯一且必要，且必须为容器组件，其中ForEach禁止作为根节点

###### @Component

@Component装饰器仅能装饰struct关键字声明的数据结构。struct被@Component装饰后具备组件化的能力，需要实现build方法描述UI，一个struct只能被一个@Component装饰，

一个Component代表一个组件。

###### @Builder

自定义构建函数，相当于@Component里build()的代码块，遵遁build()的函数语法规则，方便复用

遵遁UI语法法则

```ets
// 自定义组件内自定义构建函数
@Component
struct Index{
  @Builder
  ItemBuilder(){
    Row(){
      Text('builder')
      Text('hello')
    }
  }
  build(){
   Column(){
    this.ItemBuilder()
   }
  }
}
```

```ets
// 全局自定义构建函数
@Builder
function ItemBuilder(){
  Row(){
    Text('builder')
    Text('hello')
  }
}
@Component
struct Index{
  build(){
   Column(){
    ItemBuilder()
   }
  }
}
```

自定义组件内自定义构建函数和全局构建函数的区别：

1. 在自定义组件内定义一个或多个@Builder方法，该方法被认为是该组件的私有、特殊类型的成员函数，在自定义函数体中，this指代当前所属组件，组件的状态变量可以在自定义构建函数内访问。建议通过this访问自定义组件的状态变量而不是参数传递
2. 全局的自定义构建函数可以被整个应用获取，不允许使用this和bind方法
3. 如果不涉及组件状态变化，建议使用全局的自定义构建方法，若是要大量使用组件内的变量，可采用自定义组件内自定义构建函数

参数传递：

1. 按引用传值
   传递的参数可为状态变量，且状态变量的改变会引起UI重新渲染。ArkUI提供$$作为按引用传递参数的范式

   ```ets
   @Builder function MyBuilder($$: {msg: string, num: string}){
    Row(){
     Text($$.msg)
     Text($$.num)
    }
   }
   @Component
   struct Index{
    @State msg:string = 'hello'
    @State num:number = 1
    build(){
     Column(){
      MyBuilder({msg: this.msg, num: this.num})
     }
    }
   }
   ```

   注意点：里面的参数类型只能是string ｜ Resource

2. 按值传值
   普通传参数即可，若传的参数为状态变量的话，不会引起UI重新渲染

###### @BuilderParam

？？？

###### @Styles

样式复用，类似于css的类名所创建的css代码块

```ets
// 全局
@Styles function globalFancy  () {
  .width(150)
  .height(100)
  .backgroundColor(Color.Pink)
}

@Entry
@Component
struct FancyUse {
  build() {
    Column({ space: 10 }) {
      // 使用全局的@Styles封装的样式
      Text('FancyA')
        .globalFancy ()
        .fontSize(30)
    }
  }
}
```

```ets
// 组件内
@Entry
@Component
struct FancyUse {
  @State heightValue: number = 100
  // 定义在组件内的@Styles封装的样式
  @Styles fancy() {
    .width(200)
    .height(this.heightValue)
    .backgroundColor(Color.Yellow)
    .onClick(() => {
      this.heightValue = 200
    })
  }

  build() {
    Column({ space: 10 }) {
      // 使用组件内的@Styles封装的样式
      Text('FancyB')
        .fancy()
        .fontSize(30)
    }
  }
}
```

注意点：

1. 不支持参数传递
2. 全局无法根据常量和状态变量去访问，组件内可以通过this去访问常量和状态变量
3. 组件内@Styles高于全局@Styles，组件内找不到会找全局
4. 全局声明时需要function，组件内不需要

###### @Extend

扩展样式，在@Styles基础上扩展__原生组件样式__，意思就是__必须要有原生组件__支撑，比如Column，Row，Text等等，比@Styles更强大

使用规则：

1. 仅支持全局

2. @Extend支持封装指定的组件的私有属性和私有事件和预定义相同组件的@Extend的方法

   ```ets
   // @Extend(Text)可以支持Text的私有属性fontColor
   @Extend(Text) function TextExtends () {
     .fontColor(Color.Red)
   }
   // superTextExtends可以调用预定义的TextExtends
   @Extend(Text) function superTextExtends(size:number) {
       .fontSize(size)
       .TextExtends()
   }
   ```

3. @Extend装饰的方法支持参数/状态变量，开发者可以在调用时传递参数，调用遵循TS方法传值调用，状态变量可以引起重新渲染

   ```ets
   @Extend(Text) function TextExtend (fontSize?: number,fontWeight?: number) {
     .fontColor(Color.Red)
     .fontSize(fontSize)
     .fontWeight(fontWeight)
   }
   
   @Entry
   @Component
   struct FancyUse {
     @State fontWeight:number = 100
     build() {
       Column(){
         Row({ space: 10 }) {
           Text('Fancy')
             .TextExtend()
           Text('Fancy')
             .TextExtend(24)
           Text('Fancy')
             .TextExtend(32,this.fontWeight)
         }
         Button('click')
           .onClick(()=>{
             this.fontWeight = 600
           })
       }
     }
   }
   ```

4. @Extend装饰的方法的参数可以为function，作为Event事件的句柄

   ```ets
   @Extend(Text) function makeMeClick(onClick: () => void) {
     .backgroundColor(Color.Blue)
     .onClick(onClick)
   }
   
   @Entry
   @Component
   struct FancyUse {
     @State label: string = 'Hello World';
     onClickHandler() {
       this.label = 'Hello ArkUI';
     }
     build() {
       Row({ space: 10 }) {
         Text(`${this.label}`)
           .makeMeClick(this.onClickHandler.bind(this))
       }
     }
   }
   ```

###### stateStyles

stateStyles可以依据组件的内部状态的不同，快速设置不同样式

css伪类？stateStyles是属性方法，可以根据UI内部状态来设置样式，类似于css伪类，有四种状态

1. focused 获取焦点
2. normal 正常
3. pressed 按压
4. disabled 禁止

```ets
@Entry
@Component
struct UlImage{
  @State clickColor: string = 'red'
  @Styles pressedStyle() {
    .backgroundColor(Color.Green)
  }
  @State focusedColor: Color = Color.Red;
  build(){
    Column(){
      Text('111')
      Row(){
        Button('Click me')
          .stateStyles({
            focused: {
              .backgroundColor(this.focusedColor)
            },
            pressed: this.pressedStyle,
            normal: {
              .backgroundColor(Color.Yellow)
            }
          })
          .onClick(() => {
            this.focusedColor = Color.Pink
          })
      }

      Button('stateStyles')
        .stateStyles({
          disabled: {
            .backgroundColor(Color.Pink)
          }
        })
    }
  }
}
```

__stateStyles里是对象形式，一直都是focues模式？展现不了normal状态？？__

###### @State

@State装饰的变量，或称为状态变量，一旦变量拥有了状态属性，就和自定义组件的渲染绑定起来。当状态改变时，UI会发生对应的渲染改

@State声明的变量是私有属性，只能从组件内部访问，__声明时必须指定类型和初始值__

能导致ui重新渲染的方式：

1. 基本数据类型： string，number，boolean

2. 当装饰的对象是array时，可以观察到数组本身的赋值和添加、删除、更新数组的变化，但深一级的观察不到，看例子

   ```ets
   @Entry
   @Component
   struct UlImage{
     @State arr: Array<{name: string, age: number}> = [{
       name: 'peter',
       age: 18
     },{
       name: 'peter',
       age: 18
     },{
       name: 'peter',
       age: 18
     }]
     build(){
       Column(){
         Text('111')
         ForEach(this.arr, item=>{
           Row({space:10}){
             Text(item.name)
             Text(item.age + '')
           }
         })
   
         Row(){
           Button('Click me')
             .onClick(() => {
              this.arr.push({name: 'jerry', age: 22}) // 这个能能触发渲染
               this.arr[1] = { // 这个能能触发渲染
                 name: 'tom',
                 age: 20
               }
               this.arr[1].name = 'tom' // 这个触发不了渲染
             })
         }
     }
   }
   
   ```

3. 当装饰的数据类型为class或者Object时，可以观察到自身的赋值的变化，和其属性赋值的变化，即Object.keys(observedObject)返回的所有属性，同样的道理，但深一级的观察不到，看例子

   ```ets
   class Name {
     public value: string;
   
     constructor(value: string) {
       this.value = value;
     }
   }
   
   class Model {
     public value: string;
     public name: Name;
     constructor(value: string, a: Name) {
       this.value = value;
       this.name = a;
     }
   }
   @Entry
   @Component
   struct UlImage{
     @State title: Model = new Model('Hello', new Name('World'));
     build(){
       Column(){
         Text(this.title.value)
         Text(this.title.name.value)
         Row(){
           Button('Click me')
             .onClick(() => {
               // this.arr.push({name: 'jerry', age: 22}) // 能变
               // this.title = new Model('Hi', new ClassA('ArkUI')); // 能变
               // this.title.value = 'Hi'; // 能变
               this.title.name.value = 'ArkUI'; // 不能变
             })
         }
       }
     }
   }
   
   @Component
   struct OP{
     message:string = '00'
     build(){
       Column(){
         Text(this.message)
       }
     }
   }
   
   ```

__如何实现深一级的观察呢？?__答案：@Observe/@ObjectLink

###### @Prop

单向同步，父组件流向子组件，类似于vue的prop，但不同的是@Prop是可操作的，比如修改

@Prop装饰的变量是可变的，子组件变化不会同步回其父组件，就是@Prop变量允许在子组件修改，但修改后的变化不会同步回父组件，父组件的改变会同步给子组件

__注意：@Prop装饰器不能在@Entry装饰的自定义组件中使用__

@Prop没有初始值，都是从父组件那里传来，父组件可以是常规变量，@State，@Link，@Prop...

支持的传参类型：string，number，boolean，enum

```ets
@Entry
@Component
struct Index1{
  msg: string = 'hello world'
  @State name:string = 'peter'
  @State age: number = 18
  isMale: boolean = true
  build(){
    Column(){
      Hello({msg: this.msg,name: this.name,age: this.age, isMale: this.isMale})
      Button('click')
        .onClick(()=>{
          this.msg = 'hello arkTs'
          this.name = 'tom'
          this.age = 30
          this.isMale = false
        })
    }
  }
}

@Component
struct Hello{
  @Prop msg: string
  @Prop name: string
  @Prop age: number
  @Prop isMale: boolean
  build(){
    Column(){
      Text(this.msg)
      Text(this.name)
      Text(this.age + '')
      Text(this.isMale + '')
      HelloHello({msg: this.msg + 'today'})
    }
  }
}

@Component
struct HelloHello{
  @Prop msg: string
  build(){
    Column(){
      Text(this.msg)
    }
  }
}

```

###### @Link

双向同步，两方修改都会同步到另一方

__注意：@Prop装饰器不能在@Entry装饰的自定义组件中使用__

@Link没有初始值，都是从父组件那里传来，父组件可以是@State，@Link，@Prop...，不包含常量，接收方式：@Link子组件从父组件初始化@State的语法为Comp({ aLink: this.aState })和Comp({aLink: $aState})，（目前试的情况只有$aState,这个this.aState会报错）

支持的传参类型：Object、class、string、number、boolean、enum，其中Object，class，array的检测方式和 [@State](######@State)一样，更深一级就无法检测到

原理：1. @Link的数据源的更新：子组件@Link包装类把当前this指针注册给父组件。父组件@State变量变更后，会遍历更新所有依赖它的系统组件（elementid）和状态变量（比如@Link包装类），通知@Link包装类更新后，子组件中所有依赖@Link状态变量的系统组件（elementId）都会被通知更新2. 当子组件中@Link更新：@Link更新后，调用父组件的@State包装类的set方法，将更新后的数值同步回父组件，子组件@Link和父组件@State分别遍历依赖的系统组件，进行对应的UI的更新

有个bug？看例子

```ets
class Age{
  value:number
  constructor(value:number) {
    this.value = value
  }
}
class Person{
  name: string
  age: Age
  constructor(name: string, age: Age) {
    this.name = name
    this.age = age
  }
}

@Entry
@Component
struct LinkIndex{
  @State msg:string = 'hello world'
  @State person: Person = new Person('peter', new Age(18))
  build(){
    Column(){
      LinkChildren({message: $msg,msg: this.msg, person: $person})
      Button('click')
        .onClick(()=>{
          this.msg = 'hello arkTs'
          // this.person.name = 'tom' // 单个的情况下不会渲染age，会渲染name
          this.person.age.value = 30 //  // ！bug！！！！！！！当name和age.value同时更改时，都会重新渲染
        })
    }
  }
}

@Component
struct LinkChildren{
  @Link message: string
  @Prop msg:string
  @Link person: Person
  build(){
    Column(){
      Text('[LinkChildren] ' + this.message)
      Text('[LinkChildren] ' + this.msg)
      Row({space:10}){
        Text(this.person.name)
        Text(this.person.age.value + '')
      }
      LinkChildrenChildren({message: $message, msg: $msg})
      Button('LinkChildren click')
        .onClick(()=>{
          // this.person.age.value = 100 // 单个的情况下不会渲染age，会渲染name
          this.person.name = 'jerry' // ！bug！！！！！！！当name和age.value同时更改时，都会重新渲染
        })
    }
  }
}

@Component
struct LinkChildrenChildren{
  @Link message: string
  @Link msg: string
  build(){
    Column(){
      Text('[LinkChildrenChildren] ' + this.message)
      Text('[LinkChildrenChildren] ' + this.msg)
    }
  }
}
```

###### @Provide/@Consume

与后代组件的双向数据同步,类似于@Link的双向数据同步，只不过省略了嵌套，改成用@Provide去声明，@Consume去获取去修改，拥有@Link的特性和参数传递的方式

__@Provide可以在@Entry声明，有初始值，@Consume也可以在子组件中声明__

```ets
class Age{
  value:number
  constructor(value:number) {
    this.value = value
  }
}
class Person{
  name: string
  age: Age
  constructor(name: string, age: Age) {
    this.name = name
    this.age = age
  }
}

@Entry
@Component
struct LinkIndex{
  @Provide msg:string = 'hello world'
  @Provide person: Person = new Person('peter', new Age(18))
  build(){
    Column({space:20}){
      LinkChildren()
      Text(this.msg)
      Button('click')
        .onClick(()=>{
          this.msg = 'hello arkTs~~~~~~'
          this.person.name = 'tom'
          // this.person.age.value = 30// ！bug！！！！！！！当name和age.value同时更改时，都会重新渲染
        })
    }
  }
}

@Component
struct LinkChildren{
  @Consume msg:string
  build(){
    Column({space:20}){
      Text('[LinkChildren] ' + this.msg)
      LinkChildrenChildren()
      Button('LinkChildren click')
        .onClick(()=>{
          // this.person.age.value = 100
          this.msg = 'hello arkTs'
        })
    }
  }
}

@Component
struct LinkChildrenChildren{
  @Consume person: Person
  build(){
    Column({space:20}){
      Text('[LinkChildrenChildren] ' + this.person.name)
      Text('[LinkChildrenChildren] ' + this.person.age.value)
      Button('LinkChildrenChildren click')
        .onClick(()=>{
          // this.person.age.value = 100
          this.person.name = 'jerry'// ！bug！！！！！！！当name和age.value同时更改时，都会重新渲染
        })
    }
  }
}
```

###### @Observed/@ObjectLink

__使用@Observed装饰class会改变class原始的原型链，@Observed和其他类装饰器装饰同一个class可能会带来问题__

__@ObjectLink装饰器不能在@Entry装饰的自定义组件中使用__

双向数据变化同步__? ?__

- 被@Observed装饰的类，可以被观察到属性的变化；
- 子组件中@ObjectLink装饰器装饰的状态变量用于接收@Observed装饰的类的实例，和父组件中对应的状态变量建立双向数据绑定。这个实例可以是数组中的被@Observed装饰的项，或者是class object中的属性，这个属性同样也需要被@Observed装饰

注意：

1. @ObjectLink装饰的变量不能被赋值，如果要使用赋值操作，请使用@Prop

2. @ObjectLink装饰的数据是可读的，只能允许数据属性赋值，而不能对自身赋值

使用方法：将要监听的属性单独用@Component自定义组件，然后将要监听的属性用@ObjectLink装饰，这样父组件或子组件修改二级属性都会更改渲染，看例子

```ets
// object的二级属性更改渲染
@Observed class Sex{
  value: string;

  constructor(sex: string) {
    this.value = sex
  }
}
@Observed class Person {
  name: string;
  age: number;
  sex?: Sex
  constructor(name: string, age: number,sex?: Sex) {
    this.name = name;
    this.age = age;
    this.sex = sex
  }
}
@Entry
@Component
struct UIImage{
  @State person: Person = {
    name: 'peter',
    age: 18,
    sex: new Sex('male')
  }
  build(){
    Column({space:10}){
      Text(this.person.name)
      Text(this.person.age + '')
      Text(this.person.sex.value)//这个不变，怎么会是双向的呢？？？？？？？？
      // Text(this.person.sex.value)
      Children({sex: this.person.sex})
      Button('click')
        .onClick(()=>{
          // this.person.name = 'tom'
          this.person.sex.value = this.person.sex.value === 'male' ? 'female':'male'
        })
    }
  }

}
@Component
struct Children{
  @ObjectLink sex: Sex
  build(){
    Column(){
      Text(this.sex.value + '')
    }
  }
}
```

```ets
// array的二级属性更改渲染
@Observed
class Item {
  name: string;
  age: number

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age
  }
}
@Observed
class ListData extends Array<Item>{}
@Entry
@Component
struct UlImage {
  @State arr: ListData = new ListData(new Item('peter', 18),new Item('peter', 18),new Item('peter', 18))

  build() {
    Column() {
      Text('111')
      ForEach(this.arr, item => {
        It({item})
        // Row({ space: 10 }) {
        //   Text(item.name)
        //   Text(item.age + '')
        // }
      })

      Row() {
        Button('Click me')
          .onClick(() => {
            // this.arr.push({ name: 'jerry', age: 22 }) // 这个能能触发渲染
            // this.arr[1] = { // 这个能能触发渲染
            //   name: 'tom',
            //   age: 20
            // }
            this.arr[1].name = 'tom' // 这个触发不了渲染
          })
      }
    }
  }
}
@Component
struct It{
  @ObjectLink item: Item
  build(){
    Column(){
      Row({ space: 10 }) {
        Text(this.item.name)
        Text(this.item.age + '')
          .onClick(()=>{
            this.item.age = 100
          })
      }
    }
  }
}
```

问题处理？？？？？？？更改Arr的值，不更新

```ets
@Observed
class Item {
  name: string;
  age: number
  conArr: Arr
  constructor(name: string, age: number, conArr: Arr) {
    this.name = name;
    this.age = age;
    this.conArr = conArr
  }
}
@Observed
class Arr extends Array<number>{}
@Observed
class ListData extends Array<Item>{}
@Entry
@Component
struct UlImage {
  @State arr: ListData = new ListData(new Item('peter', 18,[1,2,3,4]),new Item('peter', 18,[5,6,7,8]),new Item('peter', 18,[10,11,12,13]))

  build() {
    Column() {
      Text('111')
      ForEach(this.arr, item => {
        It({item, arr: this.arr[0].conArr})
        Ar({arr: this.arr[1].conArr})
        // Row({ space: 10 }) {
        //   Text(item.name)
        //   Text(item.age + '')
        // }
      })

      Row() {
        Button('Click me')
          .onClick(() => {
            // this.arr.push({ name: 'jerry', age: 22 }) // 这个能能触发渲染
            // this.arr[1] = { // 这个能能触发渲染
            //   name: 'tom',
            //   age: 20
            // }
            this.arr[1].name = 'tom' // 这个触发不了渲染
            // this.arr[0].conArr[1] = 22
          })
      }
    }
  }
}
@Component
struct It{
  @ObjectLink item: Item
  @ObjectLink arr: Arr
  build(){
    Column(){
      Row({ space: 10 }) {
        Text(this.item.name)
        ForEach(this.arr, item=>{
          Text(item.toString())
        })
        Text(this.item.age + '')
          .onClick(()=>{
            this.item.age = 100
          })
      }
    }
  }
}
@Component
struct Ar{
  @ObjectLink arr: Arr
  build(){
    Column(){
      Row({ space: 10 }) {
        ForEach(this.arr, item=>{
          Text(item.toString())
        })
        Button('conarr click').onClick(()=>{
          this.arr[0] = 1000
        })
      }
    }
  }
}
```



#### 状态管理

装饰器仅能在页面内，即一个组件树上共享状态变量。如果开发者要实现应用级的，或者多个页面的状态数据共享，就需要用到应用级别的状态管理的概念，ArkTS根据不同特性，提供了多种应用状态管理的能力

1. LocalStorage
2. AppStorage
3. PersistentStorage
4. Environment

##### LocalStorage

类似于html5的localstorage

应用程序可以创建多个LocalStorage实例，LocalStorage实例可以在页面内共享，也可以通过GetShared接口，获取在UIAbility里创建的GetShared，实现跨页面、UIAbility内共享

组件树的根节点，即被@Entry装饰的@Component，可以被分配一个LocalStorage实例，此组件的所有子组件实例将自动获得对该LocalStorage实例的访问权限，所有的子组件只能接受父组件的LocalStorage实例，无法创建

一般通过new Localstorage()后，用__@LocalStorageProp__和__@LocalStorageLink__来获取变量，并初始化默认值，类似于@Prop和@Link

@LocalStorageProp装饰的变量和与LocalStorage中给定属性建立单向同步关系，@LocalStorageLink装饰的变量与LocalStorage中给定属性建立双向同步关系

__@LocalStorageProp和@LocalStorageLink装饰的变量必须要初始化默认值__, 当new LocalStorage()未初始化默认值时，被装饰的变量会采用初始化的默认值，如果LocalStorage实例中不存在属性，则作为初始化默认值，并存入LocalStorage中，而且同一的key是有顺序的，只采用第一个

```ets
let storage = new LocalStorage();
// 使LocalStorage可从@Component组件访问
@Entry(storage)
@Component
struct CompA {
  @LocalStorageProp('msg') storageProp: string = 'hello arkTS';

  build() {
    Column({ space: 15 }) {
      Text(this.storageProp)
      Button(`Parent from LocalStorage`)
        .onClick(() => this.storageProp = 'modify hello')
      Divider()
      Child()
    }
  }
}

@Component
struct Child {
  @LocalStorageProp('msg') storageProp1:string = 'hello child arkTS';

  build() {
    Column({ space: 15 }) {
      Text('Child')
      Text(this.storageProp1)
    }
  }
}
```

从上面的例子可知，storage没有声明默认值，所以@LocalStorageProp('msg')给声明了变量并存到storage里，所以打印出来的this.storageProp和this.storageProp1都是'hello arkTS'

两种创建方式：

1. 在UIAbility中创建，在页面中应用， <span style="color:red">暂时没有模拟器，无法实现，后续再实现</span>

   ```ets
   import UIAbility from '@ohos.app.ability.UIAbility';
   import window from '@ohos.window';
   class Person{
    name?: string;
    age?: number;
    isMale?: boolean;
     constructor(name?: string,age?: number, isMale?: true){
      this.name = name;
      this.age = age;
      this.isMale = isMale
     }
   }
   let para:Record<Person> = {
    name: 'peter',
    age: 30,
    isMale: true
   };
   let localStorage: LocalStorage = new LocalStorage(para);
   // let para:Record<string,number> = { 'PropA': 47 };
   // let localStorage: LocalStorage = new LocalStorage(para);
   export default class EntryAbility extends UIAbility {
     storage: LocalStorage = localStorage
     onWindowStageCreate(windowStage: window.WindowStage) {
       windowStage.loadContent('pages/Index', this.storage);
     }
   }
   ```

   ```ets
   // 通过GetShared接口获取stage共享的LocalStorage实例
   let storage = LocalStorage.GetShared()
   class Person{
    name?: string;
    age?: number;
    isMale?: boolean;
     constructor(name?: string,age?: number, isMale?: true){
      this.name = name;
      this.age = age;
      this.isMale = isMale
     }
   }
   @Entry(storage)
   @Component
   struct UIndex {
    // @LocalStorageLink('PropA') varA: number = 1;
     // build() {
     //   Column() {
     //     Text(`${this.varA}`).fontSize(50)
     //   }
     // }
     @LocalStorageLink('para') person: Person = {
     name: 'ali',
       age: 18,
       isMale: false
    };
   
     build() {
       Column() {
         Text('name: ' + this.person.name)
         Text('age: ' + this.person.age)
         Text('性别: '+  this.person.isMale ? '男' : '女')
       }
     }
   }
   ```

2. 在页面根组件中创建，子组件中应用
   @LocalStorageProp单向变化，从LocalStorage的对应属性到组件的状态变量。组件本地的修改是允许的，但是LocalStorage中给定的属性一旦发生变化，将覆盖本地的修改
   @LocalStorageLink双向变化，从LocalStorage的对应属性到自定义组件，从自定义组件到LocalStorage对应属性都会变化

   ```ets
   class Person{
     name?: string;
     age?: number;
     isMale?: boolean;
     constructor(name?: string,age?: number, isMale?: true){
       this.name = name;
       this.age = age;
       this.isMale = isMale
     }
   }
   let para:Person = {
     name: 'peter',
     age: 30,
     isMale: true
   };
   class StringArray extends Array<String>{}
   let arr = ['apple', 'pee', 'watermelon']
   // 创建新实例并使用给定对象初始化
   let storage = new LocalStorage({ 'msg': para, 'data': arr });
   // 使LocalStorage可从@Component组件访问
   @Entry(storage)
   @Component
   struct CompA {
     @LocalStorageProp('msg') storageProp: Person = {
       name: 'tom'
     };
     @LocalStorageLink('data') arr: StringArray = ['banana']
     build() {
       Column({ space: 15 }) {
         Text(this.storageProp.name)
         Text(this.storageProp.age + '')
         Text(this.storageProp.isMale ? '男' : '女')
         Divider()
         ForEach(this.arr, item=>{
           Text(item)
         })
         Button('parent click').onClick(()=>{
           this.storageProp.name = 'carter'
           this.arr.push('tomato')
         })
         Divider()
         Child()
       }
     }
   }
   
   @Component
   struct Child {
     @LocalStorageProp('msg') storageProp1: Person = {
       name: 'ami',
       isMale: false
     };
     @LocalStorageLink('data') arr: StringArray = ['banana-banana']
     build() {
       Column({ space: 15 }) {
         Text('Child')
         Text(this.storageProp1.name)
         Divider()
         ForEach(this.arr, item=>{
           Text(item)
         })
         Button('child click').onClick(()=>{
           this.storageProp1.name = 'carter'
           this.arr[0] = 'tomato-tomato'
         })
       }
     }
   }
   
   ```

声明和使用方式：（key是字符串，value类型包含string，number，boolean，array，object）

```ets
let stroage: LocalStorage = new LocalStorage({'PropA': 47})
```

1. __LocalStorage.GetShared()__
   获取当前stage共享的LocalStorage实例

2. __storage.has(key)__
   判断key对应的属性是否在LocalStorage中存在

3. __storage.get(key)__
   获取key在LocalStorage中对应的属性

4. __storage.set(key, value)__
   在LocalStorage中设置key对应属性的值。如果value的值和key对应属性的值相同，即不需要做赋值操作
   如果LocalStorage不存在ke y对应的属性，或者设置的value是undefined或者null，返回false。设置成功返回true

   ```ets
   let storage: LocalStorage = new LocalStorage({ 'PropA': 1 });
   let res: boolean = storage.set('PropA', 47); // true
   let res1: boolean = storage.set('PropB', 47); // false
   console.log(storage.get('PropA')) // 47
   console.log(storage.get('PropB')) // undefined
   ```

5. __storage.setOrCreate(key,value)__
   如果key已经在LoStorage中存在，并且value和key对应属性的值不同，则设置key对应属性的值为value,如果key不存在，则创建key属性，值为value，返回值是布尔值，设置的value是undefined或null，返回false，若有key，则更新为value，返回true，如果LocalStorage不存在propName，则创建propName，并初始化其值为newValue，返回true

   ```ets
   let storage: LocalStorage = new LocalStorage({ 'PropA': 47 });
   let res: boolean =storage.setOrCreate('PropA', 121); // true
   let res1: boolean =storage.setOrCreate('PropB', 111); // true
   let res2: boolean =storage.setOrCreate('PropB', undefined); // false
   let res3: boolean =storage.setOrCreate('PropB', 222); // true
   ```

6. __storage.link(key)__
   如果给定的ke y在LocalStorage实例中存在，则返回与LocalStorage中key对应属性的双向绑定数据

   ```ets
   let storage: LocalStorage = new LocalStorage({ 'PropA': 47 });
   let linkToPropA1: SubscribedAbstractProperty<number> = storage.link('PropA');
   let linkToPropA2: SubscribedAbstractProperty<number> = storage.link('PropA'); // linkToPropA2.get() == 47
   linkToPropA1.set(48); // 双向同步: linkToPropA1.get() == linkToPropA2.get() == 48
   ```

7. __storage.setAndLink(key,value)__
   与Link接口类似，如果给定的key在LocalStorage存在，则返回该key对应的属性的双向绑定数据。如果不存在，则使用value在LocalStorage创建和初始化value，返回其双向绑定数据

   ```ets
   let storage: LocalStorage = new LocalStorage({ 'PropA': 47 });
   let link1: SubscribedAbstractProperty<number> = storage.setAndLink('PropB', 49); // Create PropB 49
   var link2: SubscribedAbstractProperty<number> = storage.setAndLink('PropA', 50); // PropA exists, remains 47
   ```

8. __storage.prop(key,value)__
   如果给定的key在LocalStorage存在，则返回与LocalStorage中key对应属性的__单向绑定数据__。如果LocalStorage中不存在key，则返回undefined

   ```ets
   let storage: LocalStorage = new LocalStorage({ 'PropA': 47 });
   let prop1: SubscribedAbstractProperty<number> = storage.prop('PropA');
   let prop2: SubscribedAbstractProperty<number> = storage.prop('PropA');
   prop1.set(1); // one-way sync: prop1.get()=1; but prop2.get() == 47
   ```

9. __storage.setAndProp(key, value)__
   Key在LocalStorage存在，则返回该key对应的属性的单向绑定数据。如果不存在，则使用value在LocalStorage创建和初始化propName对应的属性，返回其单向绑定数据

   ```ets
   let storage: LocalStorage = new LocalStorage({ 'PropA': 47 });
   let prop: SubscribedAbstractProperty<number> = storage.setAndProp('PropB', 49); // PropA -> 47, PropB -> 49
   ```

10. __storage.delete(key)__
    在LocalStorage中删除propName对应的属性。删除属性的前提是该属性已经没有订阅者，如果有则返回false。删除成功则返回true
    如果LocalStorage中有对应的属性，且该属性已经没有订阅者，则删除成功返回true。如果属性不存在，或者该属性还存在订阅者，则返回false

    ```ets
    let storage: LocalStorage = new LocalStorage({ 'PropA': 47 });
    storage.link('PropA');
    let res: boolean = storage.delete('PropA'); // false, PropA still has a subscriber
    let res1: boolean = storage.delete('PropB'); // false, PropB is not in storage
    storage.setOrCreate('PropB', 48);
    let res2: boolean = storage.delete('PropB'); // true, PropB is deleted from storage successfully
    ```

11. __storage.keys()__
    返回LocalStorage中所有的属性名。

12. __storage.size()__
    返回LocalStorage中的属性数量

13. __storage.clear()__
    清除LocalStorage的所有的属性。在LocalStorage中清除所有属性的前提是已经没有任何订阅者。如果有则返回false；清除成功返回true

##### SubscribedAbstractProperty

```ets
let storage: LocalStorage = new LocalStorage({ 'PropA': 47 });
let prop: SubscribedAbstractProperty<number> = storage.setAndProp('PropB', 49); // PropA -> 47, PropB -> 49
```

1. __prop.get()__
   读取从AppStorage/LocalStorage同步属性的数据
2. __prop.set(value)__
   设置AppStorage/LocalStorage同步属性的数据

##### AppStorage

和LocalStorage的用法一样，只不过声明和使用名称不一样,AppStorage是应用全局的UI状态存储，是和应用的进程绑定的，由UI框架在应用程序启动时创建，为应用程序UI状态属性提供中央存储

@StorageProp和@StorageLink对应的是LocalStorage的@LocalStorageProp和@LocalStorageLink

声明和使用方式：（key是字符串，value类型包含string，number，boolean，array，object）

1. __AppStorage.SetOrCreate(key, value)__
   如果key不存在，则创建key属性，值为value，
   如果key已经在AppStorage中存在，并且value和key对应属性的值不同，则设置key对应属性的值为value
   没有返回值！

2. __AppStorage.Set(key, value)__
   在AppStorage中设置key对应属性的值。如果value的值和key对应属性的值相同，即不需要做赋值操作,返回值是一个布尔值

3. __AppStorage.Get(key)__
   获取key在AppStorage中对应的属性。如果不存在返回undefined

4. __AppStorage.Has(key)__
   判断key对应的属性是否在AppStorage中存在,返回布尔值

5. __AppStorage.Prop(key)__
   与AppStorage中对应的key建立__单向属性绑定__。如果给定的key在AppStorage中存在，则返回与AppStorage中key对应属性的单向绑定数据。如果AppStorage中不存在key，则返回undefined

   ```ets
   AppStorage.SetOrCreate('PropA', 47);
   let prop1 = AppStorage.Prop('PropA');
   let prop2 = AppStorage.Prop('PropA');
   prop1.set(1); // one-way sync: prop1.get()=1; but prop2.get() == 47
   ```

6. __AppStorage.SetAndProp(key, value)__
   如果给定的key在AppStorage存在，则返回该key对应的属性的单向绑定数据。如果不存在，则使用value在AppStorage创建和初始化value对应的属性，返回其单向绑定数据

   ```ets
   AppStorage.SetOrCreate('PropA', 47);
   let prop: SubscribedAbstractProperty<number> = AppStorage.SetAndProp('PropB', 49); 
   prop.get() // propB 49
   ```

7. __AppStorage.Link(key)__
   与AppStorage中对应的key建立双向数据绑定,如果给定的key在AppStorage中存在，返回与AppStorage中key对应属性的双向绑定数据，若值或者属性名不存在则返回undefined

   ```ets
   AppStorage.SetOrCreate('data', 47);
   let linkToPropA1 = AppStorage.Link('data');
   let linkToPropA2 = AppStorage.Link('data'); // linkToPropA2.get() == 47
   linkToPropA1.set(48); // 双向同步: linkToPropA1.get() == linkToPropA2.get() == 48
   ```

8. __AppStorage.SetAndLink(key, value)__
   如果给定的key在AppStorage中存在，则返回该key对应的属性的__双向绑定数据__。如果不存在，则在AppStorage创建和初始化key和value，返回其双向绑定数据

   ```ets
   AppStorage.SetOrCreate('PropA', 47);
   let link1: SubscribedAbstractProperty<number> = AppStorage.SetAndLink('PropB', 49); // Create PropB 49
   let link2: SubscribedAbstractProperty<number> = AppStorage.SetAndLink('PropA', 50); // PropA exists, remains 47
   ```

9. __AppStorage.Delete(key)__
   在AppStorage中删除key对应的属性,前提是必须保证该属性没有订阅者。如果有订阅者，则返回false。删除成功返回true

   ```ets
   AppStorage.SetOrCreate('PropA', 47);
   AppStorage.Link('PropA');
   let res: boolean = AppStorage.Delete('PropA'); // false, PropA still has a subscriber
   
   AppStorage.SetOrCreate('PropB', 48);
   let res1: boolean = AppStorage.Delete('PropB'); // true, PropB is deleted from AppStorage successfully
   ```

10. __AppStorage.Keys()__
    返回AppStorage中所有的属性名

11. __AppStorage.Clear()__
    清除AppStorage的所有的属性。在AppStorage中清除所有属性的前提是，已经没有任何订阅者。如果有，则什么都不做,返回false；删除成功返回true

12. __AppStorage.Size()__
    返回AppStorage中的属性数量

##### PersistentStorage

持久化存储，PersistentStorage将选定的AppStorage属性保留在设备磁盘上。应用程序通过API，以决定哪些AppStorage属性应借助PersistentStorage持久化。UI和业务逻辑不直接访问PersistentStorage中的属性，所有属性访问都是对AppStorage的访问，AppStorage中的更改会自动同步到PersistentStorage

通常通过AppStorage访问PersistentStorage

PersistentStorage允许的类型和值有：number，string，boolean，enum以及可以被JSON.stringify()和JSON.parse()重构的对象

接口：

1. __PersistProp__
   将AppStorage中key对应的属性持久化到文件中。该接口的调用通常在访问AppStorage之前

   确定属性的类型和值的顺序如下：

   1. 如果PersistentStorage文件中存在key对应的属性，在AppStorage中创建对应的propName，并用在PersistentStorage中找到的key的属性初始化。
   2. 如果PersistentStorage文件中没有查询到key对应的属性，则在AppStorage中查找key对应的属性。如果找到key对应的属性，则将该属性持久化。
   3. 如果AppStorage也没查找到key对应的属性，则在AppStorage中创建key对应的属性。用defaultValue初始化其值，并将该属性持久化。

   ```ets
   PersistentStorage.PersistProp('highScore', '0');
   ```

2. __DeleteProp__
   将key对应的属性从PersistentStorage删除，后续AppStorage的操作，对PersistentStorage不会再有影响

   ```ets
   PersistentStorage.DeleteProp('highScore');
   ```

3. __PersistProps__
   行为和PersistProp类似，不同在于可以一次性持久化多个数据，适合在应用启动的时候初始化

   ```ets
   PersistentStorage.PersistProps([{ key: 'highScore', defaultValue: '0' }, { key: 'wightScore', defaultValue: '1' }]);
   ```

4. __Keys__
   返回所有持久化属性的key的数组

   ```ets
   let keys: Array<string> = PersistentStorage.Keys();
   ```

```ets
PersistentStorage.PersistProp('aProp', 47);

@Entry
@Component
struct Index {
  @State message: string = 'Hello World'
  @StorageLink('aProp') aProp: number = 48

  build() {
    Row() {
      Column() {
        Text(this.message)
        // 应用退出时会保存当前结果。重新启动后，会显示上一次的保存结果
        Text(`${this.aProp}`)
          .onClick(() => {
            this.aProp += 1;
          })
      }
    }
  }
}
```

##### Environment

应用程序运行的设备的环境参数，以此来作出不同的场景判断

单例对象

Environment的所有属性都是不可变的（即应用不可写入），所有的属性都是简单类型

内置参数

1. accessibilityEnabled
   获取无障碍屏幕读取是否启用
2. colorMode
   色彩模型类型：选项为：ColorMode.light: 浅色/ColorMode.Dark: 深色
3. fontScale
   字体大小比例，范围: [0.85, 1.45]
4. layoutDirection
   字体粗细程度，范围: [0.6, 1.6]
5. accessibilityEnabled
   布局方向类型：包括LayoutDirection.LTR: 从左到右/LayoutDirection.RTL: 从右到左
6. languageCode
   当前系统语言值，取值必须为小写字母, 例如zh，us

```ets
// 使用Environment.EnvProp将设备运行languageCode存入AppStorage中；
Environment.EnvProp('languageCode', 'en');
// 从AppStorage获取单向绑定的languageCode的变量
const lang: SubscribedAbstractProperty<string> = AppStorage.Prop('languageCode');

if (lang.get() === 'zh') {
  console.info('你好');
} else {
  console.info('Hello!');
}
```

##### @Watch

可监听__所有装饰器装饰的__状态变量，不允许监听常规变量

监听某个状态变量，若状态变量发生变化，则触发回调

初始化的时候不会调用@Watch装饰的方法，即认为初始化不是状态变量的改变。只有在后续状态改变时，才会调用@Watch回调方法

如果在@Watch的方法里改变了其他的状态变量，也会引起状态变更和@Watch的执行
```ets
@Component
struct TotalView {
  @Prop @Watch('onCountUpdated') count: number;
  @State total: number = 0;
  // @Watch 回调
  onCountUpdated(propName: string): void {
    this.total += this.count;
  }

  build() {
    Text(`Total: ${this.total}`)
  }
}

@Entry
@Component
struct CountModifier {
  @State count: number = 0;

  build() {
    Column() {
      Button('add to basket')
        .onClick(() => {
          this.count++
        })
      TotalView({ count: this.count })
    }
  }
}
```

##### $$语法

内置组件双向同步，$$运算符为系统内置组件提供TS变量的引用，使得TS变量和系统内置组件的内部状态保持同步

使用规则：

1. 当前$$支持基础类型变量，以及@State、@Link和@Prop装饰的变量
2. 当前$$仅支持Refresh组件的refreshing参数
3. $$绑定的变量变化时，会触发UI的同步刷新

```ets
// xxx.ets
@Entry
@Component
struct RefreshExample {
  @State isRefreshing: boolean = false
  @State counter: number = 0

  build() {
    Column() {
      Text('Pull Down and isRefreshing: ' + this.isRefreshing)
        .fontSize(30)
        .margin(10)

      Refresh({ refreshing: $$this.isRefreshing, offset: 120, friction: 100 }) {
        Text('Pull Down and refresh: ' + this.counter)
          .fontSize(30)
          .margin(10)
      }
      .onStateChange((refreshStatus: RefreshStatus) => {
        console.info('Refresh onStatueChange state is ' + refreshStatus)
      })
    }
  }
}
// 当使用了$$符号绑定isRefreshing状态变量时，页面进行下拉操作，isRefreshing会变成true
// 同时，Text中的isRefreshing状态也会同步改变为true，如果不使用$$符号绑定，则不会同步改变。
```



#### 渲染控制

##### if/else

条件渲染

根据应用的不同状态，使用if、else和else if渲染对应状态下的UI内容

每当if或else if条件语句中使用的状态变量发生变化时，条件语句都会更新并重新评估新的条件值。如果条件值评估发生了变化，这意味着需要构建另一个条件分支。此时ArkUI框架将：

1. 删除所有以前渲染的（早期分支的）组件。
2. 执行新分支的构造函数，将生成的子组件添加到其父组件中

```ets
@Entry
@Component
struct MainView {
  @State toggle: boolean = true;

  build() {
    Column() {
      if (this.toggle) {
       Text('on')
      } else {
        Text('off')
      }
      Button(`toggle ${this.toggle}`)
        .onClick(() => {
          this.toggle = !this.toggle;
        })
    }
  }
}
```

##### ForEach

基于数组类型数据来进行循环渲染，需要与容器组件配合使用，且接口返回的组件应当是允许包含在ForEach父容器组件中的子组件（List=>ListItem）

`ForEach(arr, itemGenerator, keyGenerator)`

参数解释：

1. arr 数组

2. itemGenerator组件生成函数
   `(item:any,index?:number)=>void`

   1. item为数组中每个元素

   2. index为数组中元素的索引

   在这个函数里渲染子组件

3. keyGenerator 键值生成函数

   `(item: any, index?: number) => string`

   为数据源arr的每个数组项生成唯一且持久的键值。函数返回值为开发者自定义的键值生成规则，也可以采用默认的生成规则，就是keyGenerator可选的，

   一般数据都是以数据请求回来的id作为键值生成函数的返回值

   若都是同一个item的话，会导致渲染异常

```ets
@Entry
@Component
struct Parent {
  @State simpleList: Array<string> = ['one', 'two', 'three'];

  build() {
    Row() {
      Column() {
        ForEach(this.simpleList, (item: string) => {
          ChildItem({ item: item })
        }, (item: string) => item)
      }
      .width('100%')
      .height('100%')
    }
    .height('100%')
    .backgroundColor(0xF1F3F5)
  }
}

@Component
struct ChildItem {
  @Prop item: string;

  build() {
    Text(this.item)
      .fontSize(50)
  }
}
```

##### LazyForEach

数据懒加载

LazyForEach从提供的数据源中按需迭代数据，并在每次迭代过程中创建相应的组件。当在滚动容器中使用了LazyForEach，框架会根据滚动容器可视区域按需创建组件，当组件滑出可视区域外时，框架会进行组件销毁回收以降低内存占用

`LazyForEach(
    dataSource: IDataSource,             // 需要进行数据迭代的数据源
    itemGenerator: (item: any, index?: number) => void,  // 子组件生成函数
    keyGenerator?: (item: any, index?: number) => string // 键值生成函数
): void`

```ets
// 定义数据源实现并且实现接口
class BaseDataSource implements IDataSource {
  // 定义一个监听器
  private listeners: DataChangeListener[] = [];
  // 存储传递来的数据
  private baseData: string[] = [];


  // 注销数据更改侦听器
  unregisterDataChangeListener(listener: DataChangeListener): void {
    const pos = this.listeners.indexOf(listener);
    if (pos >= 0) {
      console.info('remove listener');
      this.listeners.splice(pos, 1);
    }
  }

  // 注册数据更改侦听器
  registerDataChangeListener(listener: DataChangeListener): void {
    console.info('add listener');
    this.listeners.push(listener);
  }

  // 通知LazyForEach组件需要在index对应索引处添加子组件
  basePushData(index: number): void {
    this.listeners.forEach(listener => {
      listener.onDataAdd(index);
    })
  }

  // 获取数据
  getData(index: number) {
    console.log("base-getData");
    return this.baseData[index];
  }

  // 获取总和
  totalCount(): number {
    return this.baseData.length
  }
}

// 还需定义一个我们自定义的数据源用来数据的传递交互
class DataSource extends BaseDataSource {
  // 暂存数据父类可以拿到
  private dataArray: string[] = [];

  public totalCount(): number {
    return this.dataArray.length;
  }

  public getData(index: number): string {
    return this.dataArray[index];
  }

  // 给监听器组件添加数据
  public pushData(data: string): void {
    this.dataArray.push(data);
    this.basePushData(this.dataArray.length - 1);
  }
}

@Entry
@Component
struct Lazy3 {
  // 数据源
  private data: DataSource = new DataSource();

  aboutToAppear() {
    console.log("生命周期");
    for (let i = 0; i <= 20; i++) {
      // 给父类传递参数
      this.data.pushData(`于斯为盛就是一坨 ${i}`)
    }
  }

  build() {
    List({ space: 3 }) {
      LazyForEach(this.data,
        // 遍历每一个Item
        (item: string) => {
          ListItem() {
            Row() {
              Text(item).fontSize(30).card()

                // 监听 当组件挂载显示器时，将触发此回调
                .onAppear(() => {
                  console.info("appear:" + item)
                })
            }.margin({ left: 10, right: 10 })
          }
        }

        , (item: string) => item)
    }.cachedCount(5)
  }
}

@Styles function card() {
  .width("100%")
  .padding(15)
  .backgroundColor(Color.White)
  .borderRadius(15)
  .shadow({ radius: 6, color: '#361a1919', offsetX: 2, offsetY: 4 })
}
```





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

## UlAbility

在module.json5配置文件的abilities标签中声明UIAbility的名称、入口、标签等相关信息

### 概述

__UIAbility组件是一种包含UI界面的应用组件__，主要用于和用户交互。

UIAbility组件是系统调度的基本单元，为应用提供绘制界面的窗口；一个UIAbility组件中可以通过多个页面来实现一个功能模块。每一个UIAbility组件实例，都对应于一个最近任务列表中的任务。

可以理解为UlAbility就是一个软件，举个例子，在桌面打开一个图库/相册，里面的图片以及多选，删除等等就是UlAbility要做的。

入口有三种：

1. 点击桌面进入应用
2. 一个应用拉起另一个应用
3. 最近任务列表切回应用

### 生命周期

 ![生命周期](/Users/shiqinghao/study/notes/images/0000000000011111111.20231121183809.19031159446360567182369463370403.png)

对应的四个钩子函数：

```ets
import UIAbility from '@ohos.app.ability.UIAbility';
import Window from '@ohos.window';

export default class EntryAbility extends UIAbility {
    onCreate(want, launchParam) {
        // 应用初始化
    }
    onWindowStageCreate(windowStage: Window.WindowStage) {
        // 设置WindowStage的事件订阅（获焦/失焦、可见/不可见）

        // 设置UI界面加载
        windowStage.loadContent('pages/Index', (err, data) => {
            // ...
        });
    }
    onWindowStageDestroy() {
        // 释放UI界面资源
    }
    onForeground() {
        // 申请系统需要的资源，或者重新申请在onBackground中释放的资源
    }

    onBackground() {
        // 释放UI界面不可见时无用的资源，或者在此回调中执行较为耗时的操作
        // 例如状态保存等
    }
    onDestroy() {
        // 系统资源的释放、数据的保存等
    }
}
```

1. onCreate
   Create状态为在应用加载过程中，UIAbility实例创建完成时触发，系统会调用onCreate()回调。可以在该回调中进行应用初始化操作，例如变量定义资源加载等，用于后续的UI界面展示
2. onForeground
   onForeground()回调，在UIAbility的UI界面可见之前，如UIAbility切换至前台时触发。可以在onForeground()回调中申请系统需要的资源，或者重新申请在onBackground()中释放的资源
   eg: 例如应用在使用过程中需要使用用户定位时，假设应用已获得用户的定位权限授权。在UI界面显示之前，可以在onForeground()回调中开启定位功能，从而获取到当前的位置信息
3. onBackground
   onBackground()回调，在UIAbility的UI界面完全不可见之后，如UIAbility切换至后台时候触发。可以在onBackground()回调中释放UI界面不可见时无用的资源，或者在此回调中执行较为耗时的操作，例如状态保存等
   eg:当应用切换到后台状态，可以在onBackground()回调中停止定位功能，以节省系统的资源消耗
4. onDestroy
   Destroy状态在UIAbility实例销毁时触发。可以在onDestroy()回调中进行系统资源的释放、数据的保存等操作
   例如调用terminateSelf()方法停止当前UIAbility实例，从而完成UIAbility实例的销毁；或者用户使用最近任务列表关闭该UIAbility实例，完成UIAbility的销毁
5. onWindowStageCreate
   UIAbility实例创建完成之后，在进入Foreground之前，系统会创建一个WindowStage。WindowStage创建完成后会进入onWindowStageCreate()回调，可以在该回调中设置UI界面加载、设置WindowStage的事件订阅
6. onWindowStageDestroy
   在UIAbility实例销毁之前，则会先进入onWindowStageDestroy()回调，可以在该回调中释放UI界面资源。例如在onWindowStageDestroy()中注销获焦/失焦等WindowStage事件

### 启动模式

在module.json5配置文件中的"launchType"字段对应的。

1. singleton
   singleton启动模式为单实例模式，也是默认情况下的启动模式
   每次调用startAbility()方法时，如果应用进程中该类型的UIAbility实例已经存在，则复用系统中的UIAbility实例。系统中只存在唯一一个该UIAbility实例，即在最近任务列表中只存在一个该类型的UIAbility实例
2. multiton
   multiton启动模式为多实例模式，每次调用startAbility()方法时，都会在应用进程中创建一个新的该类型UIAbility实例。即在最近任务列表中可以看到有多个该类型的UIAbility实例
3. Specified

### 用法

1. 指定UIAbility的启动页面
   应用中的UIAbility在启动过程中，需要指定启动页面，否则应用启动后会因为没有默认加载页面而导致白屏。可以在UIAbility的onWindowStageCreate()生命周期回调中，通过WindowStage对象的loadContent()方法设置启动页面。

2. 获取UIAbility的上下文UlAbilityContext

   1. 在UIAbility中可以通过this.context获取UIAbility实例的上下文信息

   2. 在页面中获取UIAbility实例的上下文信息，包括导入依赖资源context模块和在组件中定义一个context变量两个部分

      ```ets
      import common from '@ohos.app.ability.common';
      
      @Entry
      @Component
      struct Index {
        private context = getContext(this) as common.UIAbilityContext;
      
        startAbilityTest() {
          let want = {
            // Want参数信息
          };
          this.context.startAbility(want);
        }
      
        // 页面展示
        build() {
          // ...
        }
      }
      ```

### UlAbility组件与UI的数据同步

1. EventHub

   ```ets
   import UIAbility from '@ohos.app.ability.UIAbility';
   export default class EntryAbility extends UIAbility{
    onCreate(want, launch) {
           // 获取eventHub
           let eventhub = this.context.eventHub;
           // 执行订阅操作
           eventhub.on('event1', (...data) => {
               // 触发事件，完成相应的业务操作
               console.info(JSON.stringify(data));
           });
       }
   }
   ```

   ```ets
   import common from '@ohos.app.ability.common';
   
   @Entry
   @Component
   struct Index {
     private context = getContext(this) as common.UIAbilityContext;
   
     eventHubFunc() {
       this.context.eventHub.emit('event1', 2, 'test');
     }
   
     // 页面展示
     build() {
       // ...
     }
   }
   ```

2. globalThis
   globalThis既可以UIAbility组件与UI数据同步，也可以UIAbility组件与UIAbility组件数据同步

3. AppStorage/LocalStorage



