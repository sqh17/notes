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
