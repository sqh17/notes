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
