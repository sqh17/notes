### 通用属性

#### 尺寸

1. **width**

2. **height**

3. **size** 设置宽高尺寸
   
   ```ets
   Row()
   	.size({
   		height: 10,
   		width: 20
   	})
   ```
   
4. **padding**
   
   ```ets
   Row()
   .padding({
     top: 10,
     left: 20
   })
   
   Row()
   .padding(10) // 代表上下左右都是10vp
   ```
   
5. **margin** 
   书写方式同padding一样

6. **layoutWeight**
   父容器尺寸确定时，设置了layoutWeight属性的子元素与兄弟元素占主轴尺寸按照权重进行分配，忽略元素本身尺寸设置，表示自适应占满剩余空间，但在同一容器中，兄弟组件设置了layoutWeight，自身没有设置，默认是组件按照自身尺寸渲染
   <u>仅在Row/Column/Flex布局中生效</u>

   ```ets
   // 父容器尺寸确定时，设置了layoutWeight的子元素在主轴布局尺寸按照权重进行分配，忽略本身尺寸设置。
   Row() {
     // 权重1，占主轴剩余空间1/3
     Text('layoutWeight(1)')
       .size({ width: '30%', height: 110 }).backgroundColor(0xFFEFD5).textAlign(TextAlign.Center)
       .layoutWeight(1)
     // 权重2，占主轴剩余空间2/3
     Text('layoutWeight(2)')
       .size({ width: '30%', height: 110 }).backgroundColor(0xF5DEB3).textAlign(TextAlign.Center)
       .layoutWeight(2)
     // 未设置layoutWeight属性，组件按照自身尺寸渲染
     Text('no layoutWeight')
       .size({ width: '90%', height: 110 }).backgroundColor(0xD2B48C).textAlign(TextAlign.Center)
   }.size({ width: '90%', height: 140 })
   ```

7. **constraintSize**
   设置约束尺寸，组件布局时，进行尺寸范围限制。constraintSize的优先级高于Width和Height

   ```ets
   ext('today is fine today is finetoday is finetoday is finetoday is finetoday is finetoday is finetoday is finetoday is fine ')
   .width('90%')
   .constraintSize({ maxWidth: 400,minWidth: 100,maxHeight:200, minHeight: 100 })
   ```

#### 位置

1. **align**:  设置元素内容在元素绘制区域内的对齐方式
   参数为Alignment

   1. TopStart 顶部起始端
   2. Top 顶部横向居中
   3. TopEnd 顶部尾端
   4. Start 起始端纵向居中
   5. Center 横向和纵向居中 默认值
   6. End 尾端纵向居中
   7. BottomStart 底部起始端
   8. Bottom 底部横向居中
   9. BottomEnd 底部尾端

   __容器内多个元素会重叠, 只有Stack()有用？__

2. **direction**: 设置元素水平方向的布局。
   参数为Direction

   1. Ltr 元素从左到右布局
   2. Rtl 元素从右到左布局
   3. Auto 使用系统默认布局方向

3. **position**: 绝对定位，设置元素左上角相对于父容器左上角偏移位置
   
   ```ets
   Column(){
   	Text('hello')
   }.position({
   	x: 10,
   	y: 10
   })
   ```
   
4. **offset**: 相对定位，设置元素相对于自身的偏移量，x>0向右偏移，反之向左，y>0向下偏移，反之向上
   
   ```ets
   Column(){
   	Text('hello')
   }.offset({
   	x: 10,
   	y: 10
   })
   ```
   
5. **markAnchor**：设置元素在位置定位时的锚点，以元素左上角作为基准点进行偏移。通常配合position和offset属性使用，单独使用时，效果类似offset __??__

6. **alignRules**: 指定相对容器的对齐规则 __??__



#### 布局

##### 布局约束

1. **aspectRatio**： 指定当前组件的宽高比，aspectRatio = width/height
   一般通过宽度+aspectRatio可以得知高度，宽度也是如此

   ```ets
   Text(item)
   .backgroundColor(0xbbb2cb)
   .fontSize(20)
   .aspectRatio(1.5)
   .height(60)
   .textAlign(TextAlign.Center)
   // 组件宽度 = 组件高度*1.5 = 90
   ```

2. **displayPriority**: 设置当前组件在布局容器中显示的优先级，当父容器空间不足时，低优先级的组件会被隐藏
   仅在Row/Column/Flex(单行)容器组件中生效

##### Flex布局

当父组件是 Flex、Column、Row 时，子组件可以使用以下属性

1. **flexBasis** 设置组件在父容器主轴方向上的基准尺寸，默认值：'auto'（表示组件在主轴方向上的基准尺寸为组件原本的大小），不支持百分比设置
2. **flexGrow** 设置父容器的剩余空间分配给此属性所在组件的比例，默认值：0
3. **flexShrink** 设置父容器压缩尺寸分配给此属性所在组件的比例，父容器为Row、Column时，默认值：0，父容器为flex时，默认值：1
4. **alignSelf** 子组件在父容器交叉轴的对齐格式，会覆盖Flex布局容器中的alignItems设置



#### 文本

针对包含文本元素的组件，设置文本样式

1. **fontColor**

2. **fontSize**

3. **fontStyle**

4. **fontWeight**
   参数可以是数字、字符串、以及枚举类型
   当是数字时，范围是[100, 900]

   当是枚举类型时，参数是FontWeight

   1. Lighter 字体较细
   2. Normal 字体粗细正常
   3. Regular 字体粗细正常
   4. Medium 字体粗细适中
   5. Bold 字体较粗 
   6. Bolder  字体非常粗

5. **fontFamily** 设置字体列表，当前仅支持'HarmonyOS Sans'和自定义字体

   注册自定义字体
   ```ets
   import font from '@ohos.font';
   
   @Entry
   @Component
   struct FontExample {
     @State message: string = '你好，世界'
   
     aboutToAppear() {
       font.registerFont({
         familyName: 'medium', // 设置注册的字体名称
         familySrc: '/font/medium.ttf' // font文件与pages目录同级
       })
     }
   
     build() {
       Column() {
         Text(this.message)
           .align(Alignment.Center)
           .fontSize(20)
           .fontFamily('medium') // medium：注册自定义字体的名字
           .height('100%')
       }.width('100%')
     }
   }
   ```

6. **lineHeight**

7. **decoration** 设置文本装饰线样式及其颜色，是个对象,

   1. type 参数类型为TextDecorationType
      1. Underline 文字下划线修饰
      2. LineThrough 穿过文本的修饰线
      3. Overline 文字上划线修饰
      4. None 不使用文本装饰线
   2. color？【可选】

#### 边框

##### 普通边框

1. **borderStyle** 设置元素的边框样式，参数类型为BorderStyle
   1. Dotted 显示为一系列圆点，圆点半径为borderWidth的一半
   2. Dashed 显示为一系列短的方形虚线
   3. Solid 显示为一条实线 默认
2. **borderWidth** 设置元素的边框宽度，不支持百分比
3. **borderColor** 设置元素的边框颜色
4. **borderRadius** 设置元素的边框圆角半径，不支持百分比
5. **border** 统一边框样式设置,borderStyle、borderWidth、borderColor、borderRadius的组合，

使用方式看以下例子

```ets
Text('hello')
	.border({
		width: 1,
		style: 'Dotted',
		color: 'red',
		radius: 10
	})

Text('hello')
	.border({
		width: {
			left: 2,
			right: 2,
			top: 2,
			bottom: 3
		},
		style: {
			left: BorderStyle.Dotted,
			right: BorderStyle.Dashed,
			top: BorderStyle.Solid,
			bottom: BorderStyle.Dashed
		},
		color: {
			left: 'red',
			right: 'pink',
			top: 'green',
			bottom: 'gray'
		},
		radius: {
			topLeft: 10,
			topRight: 10,
			bottomLeft: 20,
			bottomRight: 20
		}
	})
```

##### 图片边框

1. **borderImage**图片边框或者渐变色边框设置
   1. source 边框图源或者渐变色设置
   2. slice 设置图片边框切割宽度
   3. width
   4. outset 设置边框图片向外延伸距离， __针对于容器，row/column等__
   5. repeat 设置边框图片的重复方式
      参数为RepeatMode
      1. Repeat 被切割图片重复铺平在图片边框上，超出的部分会被剪裁
      2. Stretch 被切割图片以拉伸填充的方式铺满图片边框 默认值
      3. Round 被切割图片以整数次平铺在图片边框上，无法以整数次平铺时压缩被切割图片
      4. Space 被切割图片以整数次平铺在图片边框上，无法以整数次平铺时以空白填充
   6. fill 设置边框图片中心填充，true为覆盖， boolean值

使用方式看例子

```ets
Text('This is gradient color.').textAlign(TextAlign.Center).height(50).width(200)
.borderImage({
  source: {
    angle: 90,
    direction: GradientDirection.Left,
    colors: [[0xAEE1E1, 0.0], [0xD3E0DC, 0.3], [0xFCD1D1, 1.0]]
  },
  slice: 10,
  width: 10,
  repeat: RepeatMode.Stretch,
  fill: false
})
```

```ets
Text('This is gradient color.').textAlign(TextAlign.Center).height(50).width(200)
.borderImage({
  source: {
    angle: 90,
    direction: GradientDirection.Left,
    colors: [[0xAEE1E1, 0.0], [0xD3E0DC, 0.3], [0xFCD1D1, 1.0]]
  },
  slice: { top: 10, bottom: 10, left: 10, right: 10 },
  width: { top: "10px", bottom: "10px", left: "10px", right: "10px" },
  repeat: RepeatMode.Stretch,
  fill: false
})
```



#### 背景

设置组件的背景样式

1. **backgroundColor**

2. **backgroundImage** 

   1. src：图片地址，支持网络图片资源和本地图片资源地址(不支持svg类型的图片)，若是字符串的话，相对路径，针对于pages/开始
   2. repeat：可选，参数为ImageRepeat
      1. X 只在水平轴上重复绘制图片
      2. Y 只在竖直轴上重复绘制图片
      3. XY 在两个轴上重复绘制图片
      4. NoRepeat 不重复绘制图片

3. **backgroundImageSize** 设置背景图像的高度和宽度。当输入为{width: Length, height: Length}对象时，如果只设置一个属性，则第二个属性保持图片原始宽高比进行调整

   一种方式：{width: Length, height: Length}

   也有另一种参数方式： Image

   1. Cover 默认值，保持宽高比进行缩小或者放大，使得图片两边都大于或等于显示边界
   2. Contain 保持宽高比进行缩小或者放大，使得图片完全显示在显示边界内
   3. Auto 保持原图的比例不变

4. **backgroundImagePosition** 设置背景图在组件中显示位置，即相对于组件左上角的坐标

```ets
Row().width('90%').height(50).backgroundColor('red')

Row()
.backgroundImage($r('app.media.bg'), ImageRepeat.X)
.backgroundImageSize({ width: '250px', height: '140px' })
.width('100%')
.height(70)

Row()
.width(200)
.height(150)
.backgroundImage($r('app.media.bg'),

Row()
.width(100)
.height(150)
.backgroundImage($r('app.media.bg'), ImageRepeat.NoRepeat)
.backgroundImageSize({ width: 1000, height: 560 })
.backgroundImagePosition({ x: 100, y: -300 })

```

#### 透明度

设置组件的透明度 **opacity**

元素的不透明度，取值范围为0到1，1表示不透明，0表示完全透明, 达到隐藏组件效果，但是在布局中占位

#### 颜色

##### 渐变

属性介绍：

1. **linearGradient** 线性渐变
   1. angle? [可选] 起始角度，0点方向顺时针为正向，默认180
   2. direction? [可选] 线性渐变的方向，设置angle后不生效
      参数为GradientDirection
      1. Left 从右向左
      2. Top 从下向上
      3. Right 从左到右
      4. Bottom 从上到下
      5. LeftTop 左上到右下
      6. LeftBottom 左下到右上
      7. RightTop 从右上到左下
      8. RightBottom 从右下到左上
      9. None
   3. colors 是颜色数组，从那个颜色到那个颜色
      __是基于Array<[ResourceColor number]>的形式，[['red', 0.0],['green',1.0]] [['#ffffff', 0.1], ['#000000', 0.5], ['pink', 1.0]]__
      __Resource表示填充的颜色，number表示指定颜色所处的位置，取值范围为[0,1.0]，0表示需要设置渐变色的容器的开始处，1.0表示容器的结尾处。想要实现多个颜色渐变效果时，多个数组中number参数建议递增设置，如后一个数组number参数比前一个数组number小的话，按照等于前一个数组number的值处理__
   4. repeating 渐变的颜色重复着色，默认值为false，当颜色数组colors数组末尾元素占比小于1时满足重复着色效果
2. **sweepGradient** 角度渐变
   1. center 角度渐变的中心点，即相对于当前组件左上角的坐标 [x, y]
   2. start?  角度渐变的起点 默认值0
   3. end? 角度渐变的终点
   4. rotation? 角度渐变的旋转角度
   5. colors 渐变的颜色描述,【解释参照线性渐变的colors描述】
   6. repeating? 渐变的颜色重复着色，默认值为false 当颜色数组colors数组末尾元素占比小于1时满足重复着色效果
3. **radialGradient** 径向渐变
   1. center 角度渐变的中心点，即相对于当前组件左上角的坐标 [x, y]
   2. radius 径向渐变的半径
   3. colors 渐变的颜色描述 解释参照线性渐变的colors描述】
   4. repeating？ 渐变的颜色重复着色，默认值为false 当颜色数组colors数组末尾元素占比小于1时满足重复着色效果

```ets
Row()
.width('90%')
.height(50)
.linearGradient({
  angle: 30,
  colors: [[0xff0000, 0.0], [0x0000ff, 0.3], [0xffff00, 1.0]],
  repeating: true
})

Row()
.width(100)
.height(100)
.sweepGradient({
  center: [50, 50],
  start: 0,
  end: 359,
  rotation: 45, // 旋转角度
  repeating: true, // 渐变颜色是否重复
  colors: [[0xff0000, 0.0], [0x0000ff, 0.3], [0xffff00, 0.5]] // 数组末尾元素占比小于1时满足重复着色效果
})

Row()
.width(100)
.height(100)
.radialGradient({
  center: [50, 50],
  radius: 60,
  repeating: true,
  colors: [[0xff0000, 0.0], [0x0000ff, 0.3], [0xffff00, 0.5]] // 数组末尾元素占比小于1时满足重复着色效果
})
```



#### 显隐控制

**visibility** 控制组件是否可见，参数为Visibility

1. None 隐藏，但不参与布局，不进行占位
2. Hidden 隐藏，但参与布局进行占位
3. Visible 显示

```ets
Row().visibility(Visibility.None).width('90%').height(80).backgroundColor(0xAFEEEE)
```



#### 禁用控制

**enabled** 值为true表示组件可交互，响应点击等操作，值为false表示组件不可交互，不响应点击等操作



### 容器组件（常用）

#### Column/Row

线性布局容器：表示按照垂直方向或者水平方向排列子组件的容器

Column:补在垂直方向上的容器，
	主轴在垂直方向上，交叉轴在水平方向上

Row: 补在水平方向上的容器
	主轴在水平方向上，交叉轴在垂直方向上

![image-20240111110941084](/Users/shiqinghao/study/notes/images/image-20240111110941084.png)

##### 统一属性介绍

###### space

布局元素之间的间距

```ets
Column({space: 10}){
	Text('hello')
	Text('hello')
	Text('hello')
} // 代表三个text在垂直方向上的间距是10vp

Row({space: 10}){
	Text('hello')
	Text('hello')
	Text('hello')
} // 代表三个text在水平方向上的间距是10vp
```

当space为负数或者justifyContent设置为FlexAlign.SpaceBetween、FlexAlign.SpaceAround、FlexAlign.SpaceEvenly时不生效



###### justifyContent

设置子组件在主轴方向上的对齐方式

参数为FlexAlign

1. Start 元素在主轴方向首端对齐，第一个元素与行首对齐，同时后续的元素与前一个对齐
   ![](/Users/shiqinghao/study/notes/images/FlexAlign_Start.png)
2. Center 元素在主轴方向中心对齐，第一个元素与行首的距离以及最后一个元素与行尾距离相同
   ![](/Users/shiqinghao/study/notes/images/FlexAlign_Center.png)
3. End 元素在主轴方向尾部对齐，最后一个元素与行尾对齐，其他元素与后一个对齐
   ![](/Users/shiqinghao/study/notes/images/FlexAlign_End.png)
4. SpaceBetween 元素在主轴方向均匀分配弹性元素，相邻元素之间距离相同。 第一个元素与行首对齐，最后一个元素与行尾对齐
   ![](/Users/shiqinghao/study/notes/images/FlexAlign_spacebetween.png)
5. SpaceAround 元素在主轴方向均匀分配弹性元素，相邻元素之间距离相同。 第一个元素到行首的距离和最后一个元素到行尾的距离是相邻元素之间距离的一半
   ![](/Users/shiqinghao/study/notes/images/FlexAlign_SpaceAround.png)
6. SpaceEvenly 元素在主轴方向等间距布局，无论是相邻元素还是边界元素到容器的间距都一样
   ![](/Users/shiqinghao/study/notes/images/FlexAlign_SpaceEvenly.png)

```ets
Column(){
	Text('hello')
	Button('click')
	Text('today is fine day')
}.justifyContent(FlexAlign.Center)

Row(){
	Text('hello')
	Button('click')
	Text('today is fine day')
}.justifyContent(FlexAlign.Center)
```

###### alignItems

子组件在交叉轴方向上的对齐方式

Column容器的主轴是垂直方向，交叉轴是水平方向，其参数类型为HorizontalAlign（水平对齐）

1. Start 设置子组件在水平方向上按照起始端对齐
   ![](/Users/shiqinghao/study/notes/images/HorizontalAlign_Start.png)

2. Center（默认值）：设置子组件在水平方向上居中对齐
   ![](/Users/shiqinghao/study/notes/images/HorizontalAlign_Center.png)

3. End：设置子组件在水平方向上按照末端对齐
   ![](/Users/shiqinghao/study/notes/images/HorizontalAlign_End.png)



Row容器的主轴是水平方向，交叉轴是垂直方向，其参数类型为VerticalAlign（垂直对齐）

1. Top：设置子组件在垂直方向上居顶部对齐
   ![VerticalAlign_Top](/Users/shiqinghao/study/notes/images/VerticalAlign_Top.png)
2. Center（默认值）：设置子组件在竖直方向上居中对齐
   ![](/Users/shiqinghao/study/notes/images/VerticalAlign_Center.png)
   
3. Bottom：设置子组件在竖直方向上居底部对齐
   ![](/Users/shiqinghao/study/notes/images/VerticalAlign_Bottom.png)

```ets
Column({space: 10}){
  Text('hello')
  Button('click')
  Text('today is fine day')
}.alignItems(HorizontalAlign.Start)

Row({space: 10}){
  Text('hello')
  Button('click')
  Text('today is fine day')
}.alignItems(VerticalAlign.Top)
```



##### ColumnSplit/RowSplit

将子组件纵向/横向布局，并在每个子组件之间插入一根横向的分割线

###### 属性

resizeable 分割线是否可拖拽，默认为false

```ets
Column(){
  Text('The secant line can be dragged').fontSize(9).fontColor(0xCCCCCC).width('90%')
  ColumnSplit() {
    Text('1').width('100%').height(50).backgroundColor(0xF5DEB3).textAlign(TextAlign.Center)
    Text('2').width('100%').height(50).backgroundColor(0xD2B48C).textAlign(TextAlign.Center)
    Text('3').width('100%').height(50).backgroundColor(0xF5DEB3).textAlign(TextAlign.Center)
    Text('4').width('100%').height(50).backgroundColor(0xD2B48C).textAlign(TextAlign.Center)
    Text('5').width('100%').height(50).backgroundColor(0xF5DEB3).textAlign(TextAlign.Center)
  }
  .borderWidth(1)
  .resizeable(true) // 可拖动
  .width('90%').height('60%')
}.width('100%')

```



#### Blank

空白填充组件，在容器主轴方向上，空白填充组件具有自动填充容器空余部分的能力。仅当父组件为Row/Column/Flex时生效

1. **min** 空白填充组件在容器主轴上的最小大小，不能设置百分比
2. **color** 设置空白填充的填充颜色

#### Flex

以弹性方式布局子组件的容器组

Flex组件在渲染时存在二次布局过程，因此在对性能有严格要求的场景下建议使用Column，Row代替

参数：

1. **direction** 子组件在Flex容器上排列的方向，即主轴的方向
   参数为FlexDirection
   1. Row 主轴与行方向一致作为布局模式
   2. RowReverse 与Row方向相反方向进行布局
   3. Column 主轴与列方向一致作为布局模式
   4. ColumnReverse 与Column相反方向进行布局
2. **wrap** 是否换行
   参数为FlexWrap
   1. NoWrap 不换行
   2. Wrap 换行
   3. WrapReverse 反向换行
3. **justifyContent** 所有子组件在Flex容器主轴上的对齐格式
   参数可参考[column/row的justifyContent](######justifyContent)
4. **alignItems** 所有子组件在Flex容器交叉轴上的对齐格式
   参数可参考[column/row的alignItems](######alignItems)
5. **alignContent** 交叉轴中有额外的空间时，多行内容的对齐方式
   参数可参考[column/row的justifyContent](######justifyContent)



#### Navigator

路由容器组件，提供路由跳转能力，类似于router的方式，只不过在ui中使用

```ets
Navigator(value?: {target: string, type?: NavigationType}){
	Text('...')
	Column(){
		//...
	}
}
```

##### 参数

1. target 指定跳转目标页面的路径，指的是main_page.json里的路由
2. type 指定路由方式
   1. NavigationType.Push 跳转到应用内的指定页面，默认值
   2. NavigationType.Replace 用应用内的某个页面替换当前页面，并销毁被替换的页面
   3. NavigationType.Back 返回到指定的页面。指定的页面不存在栈中时不响应。未传入指定的页面时返回上一页

##### 属性

1. active 当前路由组件是否处于激活状态，处于激活状态时，会生效相应的路由操作，布尔值
2. params 跳转时要同时传递到目标页面的数据，可在目标页面使用router.getParams()获得
3. target 设置跳转目标页面的路径。 目标页面需加入main_pages.json文件中
4. type 设置路由方式，和参数的type一致

```ets
@Entry
@Component
struct NavigatorExample {
  @State active: boolean = false
  @State Text: object = {name: 'news'}

  build() {
    Flex({ direction: FlexDirection.Column, alignItems: ItemAlign.Start, justifyContent: FlexAlign.SpaceBetween }) {
      Navigator({ target: 'pages/container/navigator/Detail', type: NavigationType.Push }) {
        Text('Go to ' + this.Text['name'] + ' page')
          .width('100%').textAlign(TextAlign.Center)
      }.params({ text: this.Text }) // 传参数到Detail页面

      Navigator() {
        Text('Back to previous page')
      }.active(this.active)
      .onClick(() => {
        this.active = true
      })
    }.height(150).width(350).padding(35)
  }
}
```



### 基础组件

#### Button

按钮组件，有两种写法

1. Button('text', { type: ButtonType.Normal, stateEffect: true })
2. Button( { type: ButtonType.Normal, stateEffect: true }) { Text('text')}

属性：

1. **type** 按钮类型
   参数为ButtonType
   1. Capsule 胶囊型按钮（圆角默认为高度的一半）
   2. Circle 圆形按钮
   3. Normal 普通按钮（默认不带圆角）
2. **stateEffect** 按钮按下时是否开启按压态显示效果，当设置为false时，按压效果关闭，默认是true



#### Image

图片组件，常用于在应用中显示图片。Image支持加载string、PixelMap和Resource类型的数据源，支持png、jpg、bmp、svg和gif类型的图片格式

网络图片需要设置权限：在 modules.json5里的requestPermissions里设置ohos.permission.INTERNET

```ets
Image('xxx.png').width(90).height(90)
Image($r('app.media.xxx')).width(90).height(90)
Image('http//www.xxx.png').width(90).height(90)
```

##### 属性

1. **alt** 加载时显示的占位图，支持本地图片（png、jpg、bmp、svg和gif类型），不支持网络图片，可以是文字

2. **objectFit** 设置图片的填充效果
   参数为ImageFit

   1. Contain 保持宽高比进行缩小或者放大，使得图片完全显示在显示边界内 
   2. Cover 保持宽高比进行缩小或者放大，使得图片两边都大于或等于显示边界，__默认值__
   3. Auto 自适应显示
   4. Fill 不保持宽高比进行放大缩小，使得图片充满显示边界
   5. ScaleDown 保持宽高比显示，图片缩小或者保持不变
   6. None 保持原有尺寸显示

3. **objectRepeat** 设置图片的重复样式。从中心点向两边重复，剩余空间不足放下一张图片时会截断，不支持svg
   参数为ImageRepeat

   1. X 只在水平轴上重复绘制图片
   2. Y 只在竖直轴上重复绘制图片
   3. XY 在两个轴上重复绘制图片
   4. NoRepeat __默认值__

4. **interpolation** 设置图片的插值效果，即减轻低清晰度图片在放大显示时出现的锯齿问题
   参数为ImageInterpolation

   1. None __默认值__
   2. High 高图片插值，插值质量最高，可能会影响图片渲染的速度
   3. Medium 中图片插值
   4. Low 低图片插值

5. **renderMode** 设置图片的渲染模式为原色或黑白
   参数为ImageRenderMode

   1. Original 原色渲染模式
   2. Template 黑白渲染模式

6. **sourceSize** 设置图片解码尺寸，降低图片的分辨率，常用于需要让图片显示尺寸比组件尺寸更小的场景。和ImageFit.None配合使用时可在组件内显示小图,单位为px

   ```ets
   Image('xxx.png').sourceSize({width: 10, height: 10})
   ```

7. **matchTextDirection** 设置图片是否跟随系统语言方向，在RTL语言环境下显示镜像翻转显示效果，__默认false__

8. **fitOriginalSize** 图片组件尺寸未设置时，显示尺寸是否跟随图源尺寸
   组件不设置宽高或仅设置宽/高时，该属性不生效,__默认值：false__

9. **fillColor**  设置填充颜色，设置后填充颜色会覆盖在图片上,__仅对svg图__

10. **autoResize** 设置图片解码过程中是否对图源自动缩放。设置为true时，组件会根据显示区域的尺寸决定用于绘制的图源尺寸，有利于减少内存占用，__默认值true__
    如原图大小为1920x1080，而显示区域大小为200x200，则图片会自动解码到200x200的尺寸，大幅度节省图片占用的内存

11. **syncLoad** 设置是否同步加载图片，默认是异步加载。同步加载时阻塞UI线程，不会显示占位图，__默认false__
12. **copyOption** 设置图片是否可复制
    参数为CopyOptions
    1. None
    2. InApp 支持应用内复制
    3. LocalDevice 支持设备内复制
13. **draggable** 设置组件默认拖拽效果，设置为true时，组件可拖拽，__默认为false__

##### 事件

1. **onComplete** 图片数据加载成功和解码成功时均触发该回调，返回成功加载的图片尺寸

   ```ets
   Image('xxx.png').onComplete(callback: (event?: { width: number, height: number, componentWidth: number, componentHeight: number, loadingStatus: number }) => void)
   // width 图片的宽
   // height 图片的长
   // componentWidth 组件的宽
   // componentHeight 组件的长
   // loadingStatus 图片加载成功的状态值 返回的状态值为0时，表示图片数据加载成功。返回的状态值为1时，表示图片解码成功
   ```

2. **onError** 图片加载异常时触发该回调

   ```ets
   Image('xxx.png').onError(callback: (event?: { componentWidth: number, componentHeight: number , message: string }) => void)
   ```

3. **onFinish** 当加载的源文件为带动效的svg格式图片时，svg动效播放完成时会触发这个回调。如果动效为无限循环动效，则不会触发这个回调，仅支持svg格式的图片

##### 将资源图片转化为PixedlMap对象

```ets
import image from '@ohos.multimedia.image';

let resourceManager = getContext(this).resourceManager;
let imageArray = await resourceManager.getMediaContent($r('app.media.bigPicture').id);
let imageResource = image.createImageSource(imageArray.buffer);
let pixelMap = await imageResource.createPixelMap();
```



#### LoadingProgress

创建加载进展组件

1. **color**



#### Slider

滑动条组件

##### 参数

1. **value** 当前进度值
2. **min ** 设置最小值，默认0
3. **max ** 设置最大值，默认100
4. **step ** 设置Slider滑动步长，[0.01, max]，默认1
5. **style ** 设置Slider的滑块与滑轨显示样式
   参数为SliderStyle
   1. OutSet
   2. InSet
6. **direction ** 设置滑动条滑动方向为水平或竖直方向
   参数为Axis
   1. Vertical 纵向
   2. Horizontal 横向
7. **reverse** 设置滑动条取值范围是否反向，横向Slider默认为从左往右滑动，竖向Slider默认为从上往下滑动，__默认false__

```ets
Slider({value: 10, min:0,max: 100, style: SliderStyle.OuteSet})
```

##### 属性

1. **blockColor** 设置滑块的颜色
2. **trackColor**  设置滑轨的背景颜色
3. **selectedColor** 设置滑轨的已滑动部分颜色
4. **showSteps** 设置当前是否显示步长刻度值 默认值false
5. **showTips** 设置滑动时是否显示百分比气泡提示 默认值false
6. **trackThickness** 设置滑轨的粗细 默认值：当参数style的值设置SliderStyle.OutSet 时为 4.0vp，SliderStyle.InSet时为20.0vp

##### 事件

1. **onChange** Slider滑动时触发事件回调

   ```ets
   Slider().onChange((value: number, mode: SliderChangeMode) => void)
   ```

   1. mode 拖动状态
      参数为SliderChangeMode
      1. Begin 手势/鼠标接触或者按下滑块
      2. Moving 正在拖动滑块过程中
      3. End 手势/鼠标离开滑块
      4. Click 点击滑动条使滑块位置移动

2. **onAppear**

3. **onDisAppear**



#### Text

显示一段文本的组件

##### 参数

```ets
Text('哈哈哈哈哈')
```

##### 属性

1. **textAlign** 设置文本段落在水平方向的对齐方式
   参数为TextAlign

   1. Start 首部
   2. Center
   3. End 尾部

2. **textOverflow ** 设置文本超长时的显示方式

   ```ets
   Text('hhh')
   .textOverflow({
   	overflow: TextOverflow.None // 文本超长时不进行裁剪
   })
   
   Text('hhh')
   .textOverflow({
   	overflow: TextOverflow.Ellipsis // 文本超长时显示不下的文本用省略号代替
   })
   
   Text('hhh')
   .textOverflow({
   	overflow: TextOverflow.Clip // 文本超长时进行裁剪显示 默认值
   })
   ```

3. **maxLines**  设置文本的最大行数
   默认情况下，文本是自动折行的，如果指定此参数，则文本最多不会超过指定的行。如果有多余的文本，可以通过 textOverflow来指定截断方式

4. **lineHeight ** 设置文本的文本行高，设置值不大于0时，不限制文本行高，自适应字体大小，Length为number类型时单位为fp

5. **decoration** 设置文本装饰线样式及其颜色

   ```ets
   Text('啦啦啦啦')
   .decoration({
   	type: TextDecorationType.Underline, // 文字下划线修饰
   	color: 'red'
   })
   
   Text('啦啦啦啦')
   .decoration({
   	type: TextDecorationType.LineThrough, // 穿过文本的修饰线
   })
   
   Text('啦啦啦啦')
   .decoration({
   	type: TextDecorationType.Overline, // 文字上划线修饰
   })
   
   Text('啦啦啦啦')
   .decoration({
   	type: TextDecorationType.None, // 不使用文本装饰线
   })
   ```

   

6. **baselineOffset**  设置文本基线的偏移量，默认值0

7. **letterSpacing ** 设置文本字符间距

8. **minFontSize** 设置文本最小显示字号, 需配合maxFontSize以及maxline或布局大小限制使用，单独设置不生效

9. **maxFontSize** 设置文本最大显示字号, 需配合minFontSize以及maxline或布局大小限制使用，单独设置不生效

10. **textCase** 设置文本大小写

    ```ets
    Text('啦啦啦啦')
    .textCase(TextCase.Normal) // 保持文本原有大小写
    
    Text('啦啦啦啦')
    .textCase(TextCase.LowerCase) // 文本采用全小写
    
    Text('啦啦啦啦')
    .textCase(TextCase.UpperCase) // 文本采用全大写
    ```

    

11. **copyOption** 组件支持设置文本是否可复制粘贴

    参数为CopyOptions

    1. None
    2. InApp 支持应用内复制
    3. LocalDevice 支持设备内复制

​	

#### TextInput

单行文本输入框组件

##### 参数

1. **placeholder** 设置无输入时的提示文本
2. **text** 输入框当前的文本内容 建议通过onChange事件将状态变量与文本实时绑定，避免组件刷新时TextArea中的文本内容异常
3. **controller** 设置TextInput控制器

```ets
controller: TextInputController = new TextInputController()
TextInput({
	placeholder: 'please enter',
	text: this.value,
	controller: this.controller
})
```



##### 属性

1. **type**

   1. InputType.Normal  基本输入模式 支持输入数字、字母、下划线、空格、特殊字符
   2. InputType.Password 密码输入模式。支持输入数字、字母、下划线、空格、特殊字符。密码显示小眼睛图标并且默认会将文字变成圆点
   3. InputType.Email 邮箱地址输入模式。支持数字，字母，下划线，以及@字符（只能存在一个@字符）
   4. InputType.Number 纯数字输入模式
   5. InputType.PhoneNumber 电话号码输入模式,支持输入数字、+ 、-、*、#，长度不限

2. **placeholderColor ** 设置placeholder文本颜色

3. **placeholderFont ** 设置placeholder文本样式

   ```ets
   TextInput().placeholderFont({
   	size: 10,
   	weight: 500,
   })
   ```

   

4. **enterKeyType** 设置输入法回车键类型

   1. EnterKeyType.Go
   2. EnterKeyType.Search
   3. EnterKeyType.Send
   4. EnterKeyType.Next
   5. EnterKeyType.Done __默认值__

5. **caretColor** 设置输入框光标颜色

6. **maxLength** 设置文本的最大输入字符数。

7. **inputFilter** 正则表达式，匹配表达式的输入允许显示，不匹配的输入将被过滤。目前仅支持单个字符匹配，不支持字符串匹配

   ```ets
   TextInput().inputFilter({
   	value: /^[a-z]/g, // 设置正则表达式
   	error?: (value:string)=>void // 正则匹配失败时，返回被过滤的内容
   })
   ```

   

8. **copyOption**

   参数为CopyOptions

   1. None
   2. InApp 支持应用内复制
   3. LocalDevice 支持设备内复制

9. **showPasswordIcon** 密码输入模式时，输入框末尾的图标是否显示，**默认值true**

10. **style** 设置输入框为默认风格或内联输入风格

    1. TextInputStyle.Default 默认风格，光标宽1.5vp，光标高度与文本选中底板高度和字体大小相关
    2. TextInputStyle.Inline 内联输入风格。文本选中底板高度与输入框高度相同

11. **textAlign** 设置输入文本在输入框中的对齐方式

##### 事件

1. **onChange(callback: (value: string) => void)**  输入内容发生变化时，触发该回调
   触发该事件的条件：1、键盘输入，2、粘贴、剪切，3、键盘快捷键Ctrl+v
2. **onSubmit(callback: (enterKey: EnterKeyType) => void)** 按下输入法回车键触发该回调，返回值为当前输入法回车键的类型
3. **onEditChange(callback: (isEditing: boolean) => void)** 输入状态变化时，触发该回调。isEditing为true表示正在输入。
4. **onCopy(callback:(value: string) => void)** 长按输入框内部区域弹出剪贴板后，点击剪切板复制按钮，触发该回调，value：复制的文本内容
5. **onCut(callback:(value: string) => void)** 长按输入框内部区域弹出剪贴板后，点击剪切板剪切按钮，触发该回调，value：剪切的文本内容
6. **onPaste(callback:(value: string) => void)** 长按输入框内部区域弹出剪贴板后，点击剪切板粘贴按钮，触发该回调，value：粘贴的文本内容



```ets
@Entry
@Component
struct TextInputExample {
  @State text: string = ''
  controller: TextInputController = new TextInputController()

  build() {
    Column() {
      TextInput({ text: this.text, placeholder: 'input your word...', controller: this.controller })
        .placeholderColor(Color.Grey)
        .placeholderFont({ size: 14, weight: 400 })
        .caretColor(Color.Blue)
        .margin(20)
        .fontSize(14)
        .fontColor(Color.Black)
        .inputFilter('[a-z]', (e) => {
          console.log(JSON.stringify(e))
        })
        .onChange((value: string) => {
          this.text = value
        })
      Button('Set caretPosition 1')
        .margin(15)
        .onClick(() => {
          // 将光标移动至第一个字符后
          this.controller.caretPosition(1)
        })
      // 密码输入框
      TextInput({ placeholder: 'input your password...' })
        .width(400)
        .height(40)
        .margin(20)
        .type(InputType.Password)
        .maxLength(9)
        .showPasswordIcon(true)
      // 内联风格输入框
      TextInput({ placeholder: 'inline style' })
        .width(400)
        .height(50)
        .margin(20)
        .borderRadius(0)
        .style(TextInputStyle.Inline)
    }.width('100%')
  }
}
```



#### Web

提供具有网页显示能力的Web组件

就是内嵌web网页，web网页可以是本地的web，也可以是网络上的web

```ets
import web_webview from '@ohos.web.webview'

@Entry
@Component
struct WebComponent {
  controller: web_webview.WebviewController = new web_webview.WebviewController()
  controllerLocal: web_webview.WebviewController = new web_webview.WebviewController()
  // 通过WebviewController可以控制Web组件各种行为。一个WebviewController对象只能控制一个Web组件，且必须在Web组件和WebviewController绑定后，才能调用WebviewController上的方法
  build() {
    Column() {
      Web({ src: 'www.example.com', controller: this.controller })
      Web({ src: $rawfile("index.html"), controller: this.controllerLocal })
    }
  }
}
```

##### 属性

1. domStorageAccess 设置是否开启文档对象模型存储接口（DOM Storage API）权限，默认未开启

2. fileAccess 设置是否开启应用中文件系统的访问，默认启用。$rawfile(filepath/filename)中rawfile路径的文件不受该属性影响而限制访问

3. imageAccess 设置是否允许自动加载图片资源，默认允许

4. javaScriptAccess 设置是否允许执行JavaScript脚本，默认允许执行

5. javaScriptProxy 注入JavaScript对象到window对象中，并在window对象中调用该对象的方法 **待测试实现**
   ```ets
   controller: web_webview.WebviewController = new web_webview.WebviewController()
   testObj = {
     test: (data1, data2, data3) => {
       console.log("data1:" + data1)
       console.log("data2:" + data2)
       console.log("data3:" + data3)
       return "AceString"
     },
     toString: () => {
       console.log('toString' + "interface instead.")
     }
   }
   
   Web({ src: 'www.example.com', controller: this.controller })
     .javaScriptProxy({
       object: this.testObj, // 参与注册的对象。只能声明方法，不能声明属性
       name: "objName", // 注册对象的名称，与window中调用的对象名一致
       methodList: ["test", "toString"], // 参与注册的应用侧JavaScript对象的方法
       controller: this.controller, // 控制器
   })
   ```

6. mixedMode 设置是否允许加载超文本传输协议（HTTP）和超文本传输安全协议（HTTPS）混合内容，默认不允许加载HTTP和HTTPS混合内容
   ```ets
   Web({src: 'www.example.com', controller: this.controller})
   	.mixedMode(MixedMode.None) // 不允许加载HTTP和HTTPS混合内容
   	.mixedMode(MixedMode.All) // 允许加载HTTP和HTTPS混合内容。所有不安全的内容都可以被加载
   	.mixedMode(MixedMode.Compatible) // 混合内容兼容性模式，部分不安全的内容可能被加载
   ```

7. onlineImageAccess 设置是否允许从网络加载图片资源（通过HTTP和HTTPS访问的资源），默认允许访问

8. zoomAccess 设置是否支持手势进行缩放，默认允许执行缩放

9. overviewModeAccess 设置是否使用概览模式加载网页，默认使用该方式

10. databaseAccess 设置是否开启数据库存储API权限，默认不开启

11. geolocationAccess 设置是否开启获取地理位置权限，默认开启

12. mediaPlayGestureAccess 设置有声视频播放是否需要用户手动点击，静音视频播放不受该接口管控，默认需要

13. horizontalScrollBarAccess 设置是否显示横向滚动条，包括系统默认滚动条和用户自定义滚动条。默认显示

14. verticalScrollBarAccess 设置是否显示纵向滚动条，包括系统默认滚动条和用户自定义滚动条。默认显示

15. multiWindowAccess 设置是否开启多窗口权限，默认不开启

16. cacheMode 设置缓存模式

17. textZoomRatio 设置页面的文本缩放百分比，默认为100

18. initialScale 设置整体页面的缩放百分比，默认为100

19. userAgent 设置用户代理
    ```ets
    @State userAgent:string = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36'
    Web({ src: 'www.example.com', controller: this.controller })
            .userAgent(this.userAgent)
    ```

20. blockNetwork 设置Web组件是否阻止从网络加载资源 默认false

21. defaultFixedFontSize 设置网页的默认等宽字体大小 默认13，单位为px

22. defaultFontSize 设置网页的默认字体大小 默认16，单位为px

23. minFontSize 设置网页字体大小最小值 默认8，单位为px

24. minLogicalFontSize 设置网页逻辑字体大小最小值 默认8，单位为px

25. webFixedFont 设置网页的fixed font字体库

26. webSansSerifFont 设置网页的sans serif font字体库

27. webSerifFont 设置网页的serif font字体库

28. webStandardFont 设置网页的standard font字体库

29. webFantasyFont 设置网页的fantasy font字体库

30. webCursiveFont 设置网页的cursive font字体库

31. darkMode 设置Web深色模式，默认关闭。当深色模式开启时，Web将启用媒体查询prefer-color-scheme中网页所定义的深色样式，若网页未定义深色样式，则保持原状 ，如需开启强制深色模式，建议配合forceDarkAccess使用
    ```ets
    WebDarkMode.Off Web深色模式关闭
    WebDarkMode.On Web深色模式开启
    WebDarkMode.Auto Web深色模式跟随系统
    ```

32. forceDarkAccess 设置网页是否开启强制深色模式。默认关闭。该属性仅在darkMode开启深色模式时生效

33. pinchSmooth 设置网页是否开启捏合流畅模式，默认不开启

##### 事件

1. onAlert 网页触发alert()告警弹窗时触发回调
   ```ets
   onAlert(callback: (event?: { url: string; message: string; result: JsResult }) => boolean)
   
   url: 当前显示弹窗所在网页的URL
   message: 弹窗中显示的信息
   result: 通知Web组件用户操作行为
   	1. handleCancel()
   	2. handleConfirm()
   	3. handlePromptConfirm()
   ```

   ```ets
    Web({ src: $rawfile("xxx.html"), controller: this.controller })
       .onAlert((event) => {
         AlertDialog.show({
           title: 'onAlert',
           message: 'text',
           primaryButton: {
             value: 'cancel',
             action: () => {
               event.result.handleCancel()
             }
           },
           secondaryButton: {
             value: 'ok',
             action: () => {
               event.result.handleConfirm()
             }
           },
           cancel: () => {
             event.result.handleCancel()
           }
         })
         return true
       })
   }
   ```

2. onBeforeUnload 刷新或关闭场景下，在即将离开当前页面时触发此回调。刷新或关闭当前页面应先通过点击等方式获取焦点，才会触发此回调，参数同上

3. onConfirm 网页调用confirm()告警时触发此回调, 参数同上

4. onPrompt 网页调用prompt()告警时触发此回调, 参数同上

5. onConsole 通知宿主应用JavaScript console消息

6. onDownloadStart 
   ```ets
   onDownloadStart(callback: (event?: { url: string, userAgent: string, contentDisposition: string, mimetype: string, contentLength: number }) => void)
   
   url: 文件下载的URL
   contentDisposition: 服务器返回的 Content-Disposition响应头，可能为空
   mimetype: 服务器返回内容媒体类型（MIME）信息
   contentLength: 服务器返回文件的长度
   ```

7. onErrorReceive 网页加载遇到错误时触发该回调。出于性能考虑，建议此回调中尽量执行简单逻辑。在无网络的情况下，触发此回调

8. onHttpErrorReceive 网页加载资源遇到的HTTP错误（响应码>=400)时触发该回调

9. onPageBegin 网页开始加载时触发该回调，且只在主frame触发

10. onPageEnd 网页加载完成时触发该回调，且只在主frame触发

11. onProgressChange 网页加载进度变化时触发该回调

12. onContextMenuShow 长按特定元素（例如图片，链接）或鼠标右键，跳出菜单

    

### 媒体组件

#### video

播放视频文件并控制其播放状态的组件

```ets
Video(value: {src?: string | Resource, currentProgressRate?: number | string |PlaybackSpeed, previewUri?: string |PixelMap | Resource, controller?: VideoController})
```

视频支持的规格是：mp4、mkv、webm、TS

##### 参数

其中包含四个可选参数，src、currentProgressRate、previewUri和controller

* **src**表示视频播放源的路径，可以支持本地视频路径和网络路径。使用网络地址时，如https，需要注意的是需要在module.json5文件中申请网络权限。在使用本地资源播放时，当使用本地视频地址我们可以使用媒体库管理模块medialibrary来查询公共媒体库中的视频文件，示例代码如下

  ```ets
  import mediaLibrary from '@ohos.multimedia.mediaLibrary';
  
  async queryMediaVideo() {
    let option = {
      // 根据媒体类型检索
      selections: mediaLibrary.FileKey.MEDIA_TYPE + '=?',
      // 媒体类型为视频
      selectionArgs: [mediaLibrary.MediaType.VIDEO.toString()]
    };
    let media = mediaLibrary.getMediaLibrary(getContext(this));
    // 获取资源文件
    const fetchFileResult = await media.getFileAssets(option);
    // 以获取的第一个文件为例获取视频地址
    let fileAsset = await fetchFileResult.getFirstObject();
    this.source = fileAsset.uri
  }
  ```

* **currentProgressRate**表示视频播放倍速，其参数类型为number|string|PlaybackSpeed

  1. 参数类型为number：取值支持0.75，1.0，1.25，1.75，2.0，默认值为1.0倍速
  2. 参数类型为string：取值支持'0.75'，'1.0'，'1.25'，'1.75'，'2.0'
  3. 参数类型为PlaybackSpeed：取值支持PlaybackSpeed.Speed_Forward_0_75_X，PlaybackSpeed.Speed_Forward_1_00_X，PlaybackSpeed.Speed_Forward_1_25_X，PlaybackSpeed.Speed_Forward_1_75_X，PlaybackSpeed.Speed_Forward_2_00_X

* **previewUri** 视频未播放时的预览图片路径

* **controller**表示视频控制器



##### 属性

1. **muted** 是否静音，默认false

2. **autoPlay** 是否自动播放，默认false

3. **controls** 控制视频播放的控制栏是否显示。默认true

4. **objectFit** 设置视频显示模式 默认ImageFit.Cover

   参数为ImageFit

   1. Contain 保持宽高比进行缩小或者放大，使得图片完全显示在显示边界内 
   2. Cover 保持宽高比进行缩小或者放大，使得图片两边都大于或等于显示边界，__默认值__
   3. Auto 自适应显示
   4. Fill 不保持宽高比进行放大缩小，使得图片充满显示边界
   5. ScaleDown 保持宽高比显示，图片缩小或者保持不变
   6. None 保持原有尺寸显示

5. **loop** 是否单个视频循环播放。默认false

##### 事件

Video组件能够支持常规的点击、触摸等通用事件，也支持以下点击事件

* onStart(event:() => void) 播放时触发该事件
* onPause(event:() => void) 暂停时触发该事件
* onFinish(event:() => void) 播放结束时触发该事件
* onError(event:() => void) 播放失败时触发该事件
* onPrepared(callback:(event?: { duration: number }) => void) 视频准备完成时触发该事件，通过duration可以获取视频时长，单位为s
* onSeeking(callback:(event?: { time: number }) => void) 操作进度条过程时上报时间信息，单位为s
* onSeeked(callback:(event?: { time: number }) => void) 操作进度条完成后，上报播放时间信息，单位为s
* onUpdate(callback:(event?: { time: number }) => void) 播放进度变化时触发该事件，单位为s，更新时间间隔为250ms
* onFullscreenChange(callback:(event?: { fullscreen: boolean }) => void) 在全屏播放与非全屏播放状态之间切换时触发该事件
* onError(event:()=>void)  视频播放失败时触发

##### VideoController

```ets
controller: VideoController = new VideoController()
```

1. **start()** 开始播放
2. **pause()** 暂停播放，显示当前帧，再次播放时从当前位置继续播放
3. **stop()** 停止播放，显示当前帧，再次播放时从头开始播放
4. **setCurrentTime(value: number, seekMode?: SeekMode)** 指定视频播放的进度位置，单位是s
   seekMode 指定跳转模式
   1. SeekMode.PreviousKeyframe 跳转到前一个最近的关键帧
   2. SeekMode.NextKeyframe 跳转到后一个最近的关键帧
   3. SeekMode.ClosestKeyframe 跳转到最近的关键帧
   4. SeekMode.Accurate 精准跳转，不论是否为关键帧
5. **requestFullscreen(value: boolean)** 请求全屏播放
6. **exitFullscreen()** 退出全屏播放



### 弹窗

#### 警告弹窗

```ets
AlertDialog.show(
  {
    title: 'title',
    message: 'text',
    autoCancel: true,
    alignment: DialogAlignment.Bottom,
    offset: { dx: 0, dy: -20 },
    gridCount: 3,
    confirm: {
      value: 'button',
      action: () => {
        console.info('Button-clicking callback')
      }
    },
    cancel: () => {
      console.info('Closed callbacks')
    }
  }
)
```

有两种写法，其实都一样，只不过是按钮的声明不一样而已

参数解释

1. **title**?: 弹窗标题

2. **message** 弹窗内容

3. **autoCancel**?: 点击遮障层时，是否关闭弹窗，默认是true

4. **confirm**/**primaryButton** ?: 确认按钮的文本内容、文本色、按钮背景色和点击回调（**要不confirm/cancel要不primaryButton/secondaryButton**）

   ```ets
   confirm: {
     value: 'button',
     action: () => {
       console.info('Button-clicking callback')
     },
     fontColor?: 'red',
     backgroundColor?: 'red'
   }
   ```

5. **cancel**/**secondaryButton** ?: 点击遮障层关闭dialog时的回调，secondaryButton有文本内容、文本色、按钮背景色和点击回调

6. **alignment** ?: 弹窗在竖直方向上的对齐方式

   ```ets
   alignment: DialogAlignment.Bottom
   ```

   参数为DialogAlignment：

   1. Top 垂直顶部对齐
   2. Center 垂直居中对齐
   3. Bottom 垂直底部对齐
   4. Default 默认对齐
   5. TopStart 左上对齐
   6. TopEnd 右上对齐
   7. CenterStart 左中对齐
   8. CenterEnd 右中对齐
   9. BottomStart 左下对齐
   10. BottomEnd 右下对齐

7. **offset** ?: 弹窗相对alignment所在位置的偏移量

   ```ets
   offset: { dx: 0, dy: -20 }
   ```

   

8. **gridCount** ?: 弹窗容器宽度所占用栅格数



#### 列表选择弹窗

```ets
ActionSheet.show({
  title: 'ActionSheet title',
  message: 'message',
  autoCancel: true,
  confirm: {
    value: 'Confirm button',
    action: () => {
      console.log('Get Alert Dialog handled')
    }
  },
  cancel: () => {
    console.log('actionSheet canceled')
  },
  alignment: DialogAlignment.Bottom,
  offset: { dx: 0, dy: -10 },
  sheets: [
    {
      title: 'apples',
      action: () => {
        console.log('apples')
      }
    },
    {
      title: 'bananas',
      action: () => {
        console.log('bananas')
      }
    },
    {
      title: 'pears',
      action: () => {
        console.log('pears')
      }
    }
  ]
})
```

参数：其他参数可以参考[警告弹窗的参数](####警告弹窗)

1. **sheets** 设置选项内容，每个选择项支持设置图片、文本和选中的回调

   ```ets
   sheets: [
     {
       title: 'apples', // 选项的文本内容，可以是Resource
       icon?: '', // 选项的图标，默认无图标显示
       action: () => {
         console.log('apples')
       }
     },
   ]
   ```



#### 日期滑动选择器弹窗

```ets
DatePickerDialog.show({
  start: new Date("2000-1-1"),
  end: new Date("2100-12-31"),
  selected: this.selectedDate,
  onAccept: (value: DatePickerResult) => {
    // 通过Date的setFullYear方法设置按下确定按钮时的日期，这样当弹窗再次弹出时显示选中的是上一次确定的日期
    this.selectedDate.setFullYear(value.year, value.month, value.day)
    console.info("DatePickerDialog:onAccept()" + JSON.stringify(value))
  },
  onCancel: () => {
    console.info("DatePickerDialog:onCancel()")
  },
  onChange: (value: DatePickerResult) => {
    console.info("DatePickerDialog:onChange()" + JSON.stringify(value))
  }
})
```

参数解释：

1. **start**?: 设置选择器的起始日期 

2. **end**?: 设置选择器的结束日期

3. **selected**?: 设置当前选中的日期

4. **lunar**?: 日期是否显示为农历

5. **onAccept**?: 点击弹窗中的“确定”按钮时触发该回调

   ```ets
   onAccept: (value: DatePickerResult) => {console.log(JSON.stringify(value))} // year month day
   ```

   

6. **onCancel**?: 点击弹窗中的“取消”按钮时触发该回调

7. **onChange**?: 滑动弹窗中的滑动选择器使当前选中项改变时触发该回调

   ```ets
   onChange: (value: DatePickerResult) => {console.log(JSON.stringify(value))} // year month day
   ```



#### 时间滑动选择器弹窗

```ets
TimePickerDialog.show({
  selected: this.selectTime,
  useMilitaryTime: true,
  onAccept: (value: TimePickerResult) => {
    this.selectTime.setHours(value.hour, value.minute)
    console.info("TimePickerDialog:onAccept()" + JSON.stringify(value))
  },
  onCancel: () => {
    console.info("TimePickerDialog:onCancel()")
  },
  onChange: (value: TimePickerResult) => {
    console.info("TimePickerDialog:onChange()" + JSON.stringify(value))
  }
})
```

参数解释：

1. selected ?: 设置当前选中的时间
   ```ets
   selected: new Date('2023-01-18')
   ```

   

2. useMilitaryTime?:  展示时间是否为24小时制 默认为false

3. onAccept?: 点击弹窗中的“确定”按钮时触发该回调
   ```ets
   onAccept: (value: TimePickerResult) => {console.log(JSON.stringify(value))} // hour minute
   ```

   

4. onCancel?: 点击弹窗中的“取消”按钮时触发该回调

5. onChange?: 滑动弹窗中的选择器使当前选中时间改变时触发该回调
   ```ets
   onChange: (value: TimePickerResult) => {console.log(JSON.stringify(value))} // hour minute
   ```

#### 文本滑动选择器弹窗

```ets
private select: number | number[] = 2
TextPickerDialog.show({
  range: ['apple1', 'orange2', 'peach3', 'grape4', 'banana5'],
  selected: this.select,
  onAccept: (value: TextPickerResult) => {
    // 设置select为按下确定按钮时候的选中项index，这样当弹窗再次弹出时显示选中的是上一次确定的选项
    this.select = value.index
    console.info("TextPickerDialog:onAccept()" + JSON.stringify(value))
  },
  onCancel: () => {
    console.info("TextPickerDialog:onCancel()")
  },
  onChange: (value: TextPickerResult) => {
    console.info("TextPickerDialog:onChange()" + JSON.stringify(value))
  }
})
```

参数解释：

1. **range** : 设置文本选择器的选择范围

2. **selected**?: 设置选中项的索引值

3. **value**?: 设置选中项的文本内容。当设置了selected参数时，该参数不生效。如果设置的value值不在range范围内，则默认取range第一个元素

4. **defaultPickerItemHeight**?: 设置选择器中选项的高度

5. **onAccept**?: 点击弹窗中的“确定”按钮时触发该回调

   ```ets
   onAccepet: (value:TextPickerResult) => {console.log(value)} // {value,index}
   ```

   

6. **onCancel**?: 点击弹窗中的“取消”按钮时触发该回调

7. **onChange**?: 滑动弹窗中的选择器使当前选中项改变时触发该回调

   ```ets
   onChange: (value:TextPickerResult) => {console.log(value)} // {value,index}
   ```



#### 自定义弹窗

通过CustomDialogController类显示自定义弹窗

```ets
CustomDialogController(value:{builder: CustomDialog, cancel?: () => void, autoCancel?: boolean, alignment?: DialogAlignment, offset?: Offset, customStyle?: boolean, gridCount?: number})
```

参数解释：

1. **builder**?: 自定义弹窗内容构造器

2. **autoCancel**?: 是否允许点击遮障层退出 默认true

3. **alignment**?: 弹窗在竖直方向上的对齐方式
   
   ```ets
   alignment: DialogAlignment.Bottom
   ```
   
   
   
4. **offset**?: 弹窗相对alignment所在位置的偏移量
   
   ```ets
   offset: {
   	dx: 0,
   	dy: -10
   }
   ```
   
5. **customStyle**?:  弹窗容器样式是否自定义。默认值：false，弹窗容器的宽度根据栅格系统自适应，不跟随子节点；高度自适应子节点，最大为窗口高度的90%；圆角为24vp

6. **gridCount**?:  弹窗宽度占栅格宽度)的个数。默认为按照窗口大小自适应，异常值按默认值处理，最大栅格数为系统最大栅格数

```ets
@CustomDialog
struct CustomDialog {
  @Link textValue: string
  @Link inputValue: string
  controller: CustomDialogController
  // 若尝试在CustomDialog中传入多个其他的Controller，以实现在CustomDialog中打开另一个或另一些CustomDialog，那么此处需要将指向自己的controller放在最后
  cancel: () => void
  confirm: (value: string) => void

  build() {
    Column() {
      TextInput({ placeholder: '', text: this.textValue }).height(60).width('90%')
        .onChange((value: string) => {
          this.textValue = value
        })
      Row(){
      	Button('cancel')
          .onClick(() => {
            this.controller.close()
            this.cancel()
          }).backgroundColor(0xffffff).fontColor(Color.Black)
        Button('confirm')
          .onClick(() => {
            this.inputValue = this.textValue
            this.controller.close()
            this.confirm(value)
          }).backgroundColor(0xffffff).fontColor(Color.Red)
      }
    }
    // dialog默认的borderRadius为24vp，如果需要使用border属性，请和borderRadius属性一起使用。
  }
}

@Entry
@Component
struct CustomDialogUser {
  @State textValue: string = ''
  @State inputValue: string = 'click me'
  dialogController: CustomDialogController = new CustomDialogController({
    builder: CustomDialog({
      cancel: ()=>{this.dialogController.close()},
      confirm: (value)=>{console.log(value)},
      textValue: $textValue,
      inputValue: $inputValue
    }),
    cancel: ()=>{
    	this.dialogController.close()
    	console.log('cancel')
    },
    autoCancel: true,
    alignment: DialogAlignment.Bottom,
    offset: { dx: 0, dy: -20 },
    gridCount: 4,
    customStyle: false
  })

  // 在自定义组件即将析构销毁时将dialogController置空
  aboutToDisappear() {
    this.dialogController = undefined // 将dialogController置空
  }
  build() {
    Column() {
      Button(this.inputValue)
        .onClick(() => {
          if (this.dialogController != undefined) {
            this.dialogController.open()
          }
        }).backgroundColor(0x317aff)
    }
  }
}
```



### 动画

#### 属性动画

属性动画，是最为基础的动画，其功能强大、使用场景多，应用范围较广。常用于如下场景中

- 一、页面布局发生变化。例如添加、删除部分组件元素。
- 二、页面元素的可见性和位置发生变化。例如显示或者隐藏部分元素，或者将部分元素从一端移动到另外一端。
- 三、页面中图形图片元素动起来。例如使页面中的静态图片动起来。

属性动画是组件的通用属性发生改变时而产生的属性渐变效果

给组件（**包含基础组件和容器组件**）添加animation属性，设置好参数即可

```ets
Image($r('app.media.image1'))   
   .animation({   
      duration: 1000,    
      tempo: 1.0,    
      delay: 0,    
      curve: Curve.Linear,    
      playMode: PlayMode.Normal,    
      iterations: 1  
   })
```

参数解释：

1. duration ?: 设置动画时长
2. tempo ?: 动画播放速度。数值越大，动画播放速度越快，数值越小，播放速度越慢。值为0时，表示不存在动画，默认1
3. curve ?:  设置动画曲线
   参数类型为Curve
   1. Linear 表示动画从头到尾的速度都是相同的
   2. Ease 表示动画以低速开始，然后加快，在结束前变慢
   3. EaseIn 表示动画以低速开始
   4. EaseOut 表示动画以低速结束
   5. EaseInOut 表示动画以低速开始和结束
   6. FastOutSlowIn 标准曲线
   7. LinearOutSlowIn 减速曲线
   8. FastOutLinearIn 加速曲线
   9. ExtremeDeceleration 急缓曲线
   10. Sharp 锐利曲线
   11. Rhythm 节奏曲线
   12. Smooth 平滑曲线
   13. Friction 阻尼曲线
4. delay ?: 设置动画延迟执行的时长
5. iterations ?: 设置播放次数 默认1
   若为-1代表无限，则不会触发onFinish回调
6. playMode ?: 设置动画播放模式，默认播放完成后重头开始播放
   参数类型为PlayMode
   1. Normal 动画按正常播放
   2. Reverse 动画反向播放
   3. Alternate 动画在奇数次（1、3、5...）正向播放，在偶数次（2、4、6...）反向播放
   4. AlternateReverse 动画在奇数次（1、3、5...）反向播放，在偶数次（2、4、6...）正向播放
7. onFinish ?: 状态回调，动画播放完成时触发

注意：

1. animation属性作用域。animation自身也是组件的一个属性，其作用域为animation之前。即产生属性动画的属性须在animation之前声明，其后声明的将不会产生属性动画。比如，我们期望产生动画的属性为Image组件的width属性，故该属性width需在animation属性之前声明。如果将该属性width在animation之后声明，则不会产生动画效果

2. 产生属性动画的属性变化时需触发UI状态更新，需要事件触发
   ```ets
   @State w:number = 100
   build(){
   	Column(){
   		Image('xxx')
   			.width(this.w)
   			.height(100)
   			.animation({
   				duration: 1000,
   				tempo: 3.0
   			})
   			.onAppear(()=>{
   				this.w = 200
   			})
   	}
   }
   ```

   ```ets
   @State w:number = 100
   build(){
   	Column(){
   		Button('xxx')
   			.width(this.w)
   			.height(100)
   			.animation({
   				duration: 1000,
   				tempo: 3.0
   			})
   			.onClick(()=>{
   				this.w = 200
   			})
   	}
   }
   ```

   

3. 产生属性动画的属性本身需满足一定的要求，并非任何属性都可以产生属性动画。目前支持的属性包括width、height、position、opacity、backgroundColor、scale、rotate、translate等



#### 显式动画

就是通过方法的形式调用动画

```ets
animateTo(value: AnimateParam, event: () => void): void
```

AnimateParam对应的[animation](####属性动画)的参数

```ets
@State widthSize: number = 250
@State heightSize: number = 100
private flag: boolean = true

Button('change size')
  .width(this.widthSize)
  .height(this.heightSize)
  .margin(30)
  .onClick(() => {
    if (this.flag) {
      animateTo({
        duration: 2000,
        curve: Curve.EaseOut,
        iterations: 3,
        playMode: PlayMode.Normal,
        onFinish: () => {
          console.info('play end')
        }
      }, () => {
        this.widthSize = 150
        this.heightSize = 60
      })
    } else {
      animateTo({}, () => {
        this.widthSize = 250
        this.heightSize = 100
      })
    }
    this.flag = !this.flag
  })
```

