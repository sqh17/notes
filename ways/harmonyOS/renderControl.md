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
