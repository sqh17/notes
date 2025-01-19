### Http

```ets
// 引入包名
import http from '@ohos.net.http';

// 每一个httpRequest对应一个HTTP请求任务，不可复用
let httpRequest = http.createHttp();
// 用于订阅HTTP响应头，此接口会比request请求先返回。可以根据业务需要订阅此消息
// 从API 8开始，使用on('headersReceive', Callback)替代on('headerReceive', AsyncCallback)。 8+
httpRequest.on('headersReceive', (header) => {
    console.info('header: ' + JSON.stringify(header));
});
httpRequest.request(
    // 填写HTTP请求的URL地址，可以带参数也可以不带参数。URL地址需要开发者自定义。请求的参数可以在extraData中指定
    "EXAMPLE_URL",
    {
        method: http.RequestMethod.POST, // 可选，默认为http.RequestMethod.GET
        // 开发者根据自身业务需要添加header字段
        header: {
            'Content-Type': 'application/json'
        },
        // 当使用POST请求时此字段用于传递内容
        extraData: {
            "data": "data to send",
        },
        expectDataType: http.HttpDataType.STRING, // 可选，指定返回数据的类型
        usingCache: true, // 可选，默认为true
        priority: 1, // 可选，默认为1
        connectTimeout: 60000, // 可选，默认为60000ms
        readTimeout: 60000, // 可选，默认为60000ms
        usingProtocol: http.HttpProtocol.HTTP1_1, // 可选，协议类型默认值由系统自动指定
    }, (err, data) => {
        if (!err) {
            // data.result为HTTP响应内容，可根据业务需要进行解析
            console.info('Result:' + JSON.stringify(data.result));
            console.info('code:' + JSON.stringify(data.responseCode));
            // data.header为HTTP响应头，可根据业务需要进行解析
            console.info('header:' + JSON.stringify(data.header));
            console.info('cookies:' + JSON.stringify(data.cookies)); // 8+
            // 取消订阅HTTP响应头事件
            httpRequest.off('headersReceive');
            // 当该请求使用完毕时，调用destroy方法主动销毁
            httpRequest.destroy();
        } else {
            console.info('error:' + JSON.stringify(err));
            // 取消订阅HTTP响应头事件
            httpRequest.off('headersReceive');
            // 当该请求使用完毕时，调用destroy方法主动销毁。
            httpRequest.destroy();
        }
    }
);
```

每一个httpRequest对象对应一个http请求任务，不可复用，意思就是get请求就是一个httpRequest，post请求也是一个httpRequest。

创建httpRequest.request有两种方式，一个是回调函数形式，如上代码，另一个是promise形式：

```ets
let promise = httpRequest.request("EXAMPLE_URL", {
    method: http.RequestMethod.GET,
    connectTimeout: 60000,
    readTimeout: 60000,
    header: {
        'Content-Type': 'application/json'
    }
});
promise.then((data) => {
    console.log(data)
}).catch((err) => {
    console.info('error:' + JSON.stringify(err));
});
```

#### 请求参数

1. method 
   请求方式
   1. http.RequestMethod.OPTIONS 
   2. http.RequestMethod.GET
   3. http.RequestMethod.HEAD
   4. http.RequestMethod.POST
   5. http.RequestMethod.PUT
   6. http.RequestMethod.DELETE
   7. http.RequestMethod.TRACE
   8. http.RequestMethod.CONNECT 
2. extraData 发送请求的额外数据
   1. 当HTTP请求为POST、PUT等方法时，此字段为HTTP请求的content。当'Content-Type'为'application/x-www-form-urlencoded'时，请求提交的信息主体数据应在key和value进行URL转码后按照键值
   2. 当HTTP请求为GET、OPTIONS、DELETE、TRACE、CONNECT等方法时，此字段为HTTP请求的参数补充，参数内容会拼接到URL中进行发送
3. expectDataType 指定返回数据的类型。如果设置了此参数，系统将优先返回指定的类型
   1. HttpDataType.STRING 字符串
   2. HttpDataType.OBJECT 对象
   3. HttpDataType.ARRAY_BUFFER
4. usingCache 是否使用缓存，默认为true
5. priority 优先级，范围[1,1000]，默认是1
6. header HTTP请求头字段。默认{'Content-Type': 'application/json'}
7. readTimeout 读取超时时间。单位为毫秒（ms），默认为60000ms
8. connectTimeout 连接超时时间。单位为毫秒（ms），默认为60000ms
9. usingProtocol 使用协议。默认值由系统自动指定
   1. HttpProtocol.HTTP1_1
   2. HttpProtocol.HTTP2



#### 方法

1. destroy() 中断请求任务
   ```ets
   httpRequest.destroy(); // httpRequest为创建的http
   ```

2. on('headersReceive', callback) 订阅HTTP Response Header 事件
   用来自定义响应头

   ```ets
   httpRequest.on('headersReceive', (header) => {
       console.info('header: ' + JSON.stringify(header));
   });
   ```

3. off(type: 'headersReceive', callback?:)  取消订阅HTTP Response Header 事件
   ```ets
   httpRequest.off('headersReceive');
   ```



### 数据管理

#### 用户首选项

`@ohos.data.preferences`

##### 什么是首选项

首选项为应用提供Key-Value键值型的数据存储能力，支持应用持久化轻量级数据，并对其进行增删改查等。该存储对象中的数据会被缓存在内存中，因此它可以获得更快的存取速度

每个文件唯一对应到一个Preferences实例，系统会通过静态容器将该实例存储在内存中，直到主动从内存中移除该实例或者删除该文件

##### 约束限制

- Key键为string类型，要求非空且长度不超过80个字节。
- 如果Value值为string类型，可以为空，不为空时长度不超过8192个字节。
- 内存会随着存储数据量的增大而增大，所以存储的数据量应该是轻量级的，建议存储的数据不超过一万条，否则会在内存方面产生较大的开销

##### 实例接口

一般用于EntryAbility

1. 获取
   ```ets
   // promise
   let context = featureAbility.getContext();
   let promise = dataPreferences.getPreferences(context, 'mystore');
   
   // callback
   dataPreferences.getPreferences(this.context, 'mystore', function (err, val) {})
   
   ```

2. 删除
   ```ets
   let promise = dataPreferences.deletePreferences(context, 'mystore');
   
   dataPreferences.deletePreferences(this.context, 'mystore', function (err) {}
   ```

3. 移除
   从内存中移除指定的Preferences实例，
   若Preferences实例有对应的持久化文件，则同时删除其持久化文件

   ```ets
   let promise = dataPreferences.deletePreferences(context, 'mystore');
   
   
   dataPreferences.deletePreferences(this.context, 'mystore', function (err) {})
   ```

##### 存储实例

提供获取和修改存储数据的接口

说明请看例子：

```ets
import dataPreferences from '@ohos.data.preferences';
import Logger from '../utils/Logger';
class GlobalContext {
  private constructor() { }
  private static instance: GlobalContext;
  private _objects = new Map<string, Object>();

  public static getContext(): GlobalContext {
    if (!GlobalContext.instance) {
      GlobalContext.instance = new GlobalContext();
    }
    return GlobalContext.instance;
  }

  getObject(value: string): Object | undefined {
    return this._objects.get(value);
  }

  setObject(key: string, objectClass: Object): void {
    this._objects.set(key, objectClass);
  }
}
const TAG = '[PreferencesUtil]';
const PREFERENCES_NAME = 'myPreferences';
const KEY_APP_FONT_SIZE = 'appFontSize';

/**
 * The PreferencesUtil provides preferences of create, save and query.
 */
export class PreferencesUtil {
	// 这块儿先声明实例，所以在EntryAbility.ets中onCreate应用，并初始化
	// EntryAbility.ets中onCreate ： PreferencesUtil.createFontPreferences(this.context);
	// 是promise结构，所以后续都用then回调
  createFontPreferences(context: Context) { 
    let fontPreferences: Function = (() => {
      let preferences: Promise<dataPreferences.Preferences> = dataPreferences.getPreferences(context,
        PREFERENCES_NAME);
      return preferences;
    });
    GlobalContext.getContext().setObject('getFontPreferences', fontPreferences);
  }

  saveDefaultFontSize(fontSize: number) {
    let getFontPreferences: Function = GlobalContext.getContext().getObject('getFontPreferences') as Function;
    getFontPreferences().then((preferences: dataPreferences.Preferences) => { // 先获取Preferences实例
    	// 接口1 检查Preferences实例是否包含名为给定Key的存储键值对
    	// 参数： key 要检查的存储key名称，不能为空
      preferences.has(KEY_APP_FONT_SIZE).then(async (isExist: boolean) => { 
        Logger.info(TAG, 'preferences has changeFontSize is ' + isExist);
        if (!isExist) {
        	// 接口2 将数据写入Preferences实例，
        	// 参数：key 要修改的存储的Key，不能为空
        	// 参数：value 存储的新值。支持number、string、boolean、Array<number>、Array<string>、Array<boolean>类型
          await preferences.put(KEY_APP_FONT_SIZE, fontSize);
          // 将当前Preferences实例的数据异步存储到用户首选项的持久化文件中
          let f = preferences.flush();
          f.then(()=>{
          
          }).catch(()=>{
          
          })
        }
      }).catch((err: Error) => {
        Logger.error(TAG, 'Has the value failed with err: ' + err);
      });
    }).catch((err: Error) => {
      Logger.error(TAG, 'Get the preferences failed, err: ' + err);
    });
  }

  saveChangeFontSize(fontSize: number) {
    let getFontPreferences: Function = GlobalContext.getContext().getObject('getFontPreferences') as Function;
    getFontPreferences().then(async (preferences: dataPreferences.Preferences) => {
    	let observer = function (key) {
          console.info("The key " + key + " changed.");
      }
      // 接口7 订阅数据变更，订阅的Key的值发生变更后，在执行flush方法后，触发callback回调
      preferences.on('change', observer);
      let p = await preferences.put(KEY_APP_FONT_SIZE, fontSize);
      p.then(()=>{
        preferences.flush(function (err) {
            if (err) {
                console.error("Failed to flush. Cause: " + err);
                return;
            }
            console.info("Succeeded in flushing.");
        });
        // 接口8 取消订阅数据变更
        preferences.off('change', observer);
      })
    }).catch((err: Error) => {
      Logger.error(TAG, 'put the preferences failed, err: ' + err);
    });
  }

  async getChangeFontSize() {
    let fontSize: number = 0;
    let getFontPreferences: Function = GlobalContext.getContext().getObject('getFontPreferences') as Function;
    // 接口3 获取键对应的值，如果值为null或者非默认值类型，返回默认数据defValue，
    // 参数 key 要获取的存储Key名称，不能为空
    // 参数 defvalue 默认返回值。支持number、string、boolean、Array<number>、Array<string>、Array<boolean>类型
    // 此部分给简化了Preferences声明
    fontSize = await (await getFontPreferences()).get(KEY_APP_FONT_SIZE, fontSize);
    return fontSize;
  }

  async deleteChangeFontSize() {
    let getFontPreferences: Function = GlobalContext.getContext().getObject('getFontPreferences') as Function;
    const preferences: dataPreferences.Preferences = await getFontPreferences();
    // 接口4 从Preferences实例中删除名为给定Key的存储键值对
    // 参数 key 要删除的存储Key名称，不能为空
    let deleteValue = preferences.delete(KEY_APP_FONT_SIZE);
    deleteValue.then(() => {
      Logger.info(TAG, 'Succeeded in deleting the key appFontSize.');
    }).catch((err: Error) => {
      Logger.error(TAG, 'Failed to delete the key appFontSize. Cause: ' + err);
    });
  }
  
  async clearFontSize(){
  	let getFontPreferences: Function = GlobalContext.getContext().getObject('getFontPreferences') as Function;
    const preferences: dataPreferences.Preferences = await getFontPreferences();
    // 接口5 清除此Preferences实例中的所有存储
    let clear = preferences.clear()
    clear.then(()=>{}).catch(err=>{console.log(err)})
  }
  
  async getAll(){
  	let getFontPreferences: Function = GlobalContext.getContext().getObject('getFontPreferences') as Function;
    const preferences: dataPreferences.Preferences = await getFontPreferences();
    // 接口6 获取含有所有键值的Object对象
    let getAll = preferences.getAll()
    getAll.then((value) => {
        let allKeys = Object.keys(value);
        console.info('getAll keys = ' + allKeys);
        console.info("getAll object = " + JSON.stringify(value));
    }).catch((err) => {
        console.error("Failed to get all key-values. code =" + err.code + ", message =" + err.message);
    })
  }
}

export default new PreferencesUtil();
```

### 通知和提醒

应用可以通过通知接口发送通知消息，用户可以通过通知栏查看通知内容，也可以点击通知来打开应用，通知主要有以下使用场景：

- 显示接收到的短消息、即时消息等。
- 显示应用的推送消息，如广告、版本更新等。
- 显示当前正在进行的事件，如下载等。

##### 通知结构

![通知结构](/Users/shiqinghao/study/notes/images/notifier.png)、

1. 通知小图标：表示通知的功能与类型。
2. 通知名称：应用名称或功能名称。
3. 时间：发送通知的时间，系统默认显示。
4. 展开箭头：点击标题区，展开被折叠的内容和按钮。若无折叠的内容和按钮，不显示此箭头。
5. 内容标题：描述简明概要。
6. 内容详情：描述具体内容或详情。

##### 创建通知

在创建通知前需要先导入notificationManager模块，该模块提供通知管理的能力，包括发布、取消发布通知，创建、获取、移除通知通道等能力

```ets
import NotificationManager from '@ohos.notificationManager';
```

##### 通知请求参数解释

| 名称                 | 类型                                                         | 可读 | 可写 | 说明                                                  |
| -------------------- | ------------------------------------------------------------ | ---- | ---- | ----------------------------------------------------- |
| **content**          | [NotificationContent](######发布基础类型通知)                | 是   | 是   | 通知内容。                                            |
| **id**               | number                                                       | 是   | 是   | 通知ID。                                              |
| **slotType**         | [SlotType](######SlotType)                                   | 是   | 是   | 通道类型。                                            |
| isOngoing            | boolean                                                      | 是   | 是   | 是否进行时通知。                                      |
| isUnremovable        | boolean                                                      | 是   | 是   | 是否可移除。                                          |
| **deliveryTime**     | number                                                       | 是   | 是   | 通知发送时间。                                        |
| tapDismissed         | boolean                                                      | 是   | 是   | 通知是否自动清除。                                    |
| autoDeletedTime      | number                                                       | 是   | 是   | 自动清除的时间。                                      |
| **wantAgent**        | WantAgent                                                    | 是   | 是   | WantAgent封装了应用的行为意图，点击通知时触发该行为。 |
| extraInfo            | {[key: string]: any}                                         | 是   | 是   | 扩展参数。                                            |
| color                | number                                                       | 是   | 是   | 通知背景颜色。预留能力，暂未支持。                    |
| colorEnabled         | boolean                                                      | 是   | 是   | 通知背景颜色是否使能。预留能力，暂未支持。            |
| isAlertOnce          | boolean                                                      | 是   | 是   | 设置是否仅有一次此通知提醒。                          |
| isStopwatch          | boolean                                                      | 是   | 是   | 是否显示已用时间。                                    |
| isCountDown          | boolean                                                      | 是   | 是   | 是否显示倒计时时间。                                  |
| isFloatingIcon       | boolean                                                      | 是   | 是   | 是否显示状态栏图标。                                  |
| label                | string                                                       | 是   | 是   | 通知标签。                                            |
| badgeIconStyle       | number                                                       | 是   | 是   | 通知角标类型。                                        |
| **showDeliveryTime** | boolean                                                      | 是   | 是   | 是否显示分发时间。                                    |
| **actionButtons**    | [Array[NotificationActionButton]](######NotificationActionButton) | 是   | 是   | 通知按钮，最多三个按钮。                              |
| smallIcon            | image.PixelMap                                               | 是   | 是   | 通知小图标。可选字段，大小不超过30KB。                |
| largeIcon            | image.PixelMap                                               | 是   | 是   | 通知大图标。可选字段，大小不超过30KB。                |
| creatorBundleName    | string                                                       | 是   | 否   | 创建通知的包名。                                      |
| creatorUid8+         | number                                                       | 是   | 否   | 创建通知的UID。                                       |
| creatorPid           | number                                                       | 是   | 否   | 创建通知的PID。                                       |
| creatorUserId        | number                                                       | 是   | 否   | 创建通知的UserId。                                    |
| hashCode             | string                                                       | 是   | 否   | 通知唯一标识。                                        |
| **groupName**        | string                                                       | 是   | 是   | 组通知名称。                                          |
| **template**         | [NotificationTemplate](######NotificationTemplate)           | 是   | 是   | 通知模板。                                            |
| distributedOption    | DistributedOptions                                           | 是   | 是   | 分布式通知的选项。                                    |
| notificationFlags    | NotificationFlags                                            | 是   | 否   | 获取NotificationFlags。                               |
| **removalWantAgent** | WantAgent                                                    | 是   | 是   | 当移除通知时，通知将被重定向到的WantAgent实例。       |
| **badgeNumber**      | number                                                       | 是   | 是   | 应用程序图标上显示的通知数。                          |

###### SlotType

| 名称                 | 说明       |
| -------------------- | ---------- |
| UNKNOWN_TYPE         | 未知类型。 |
| SOCIAL_COMMUNICATION | 社交类型。 |
| SERVICE_INFORMATION  | 服务类型。 |
| CONTENT_INFORMATION  | 内容类型。 |
| OTHER_TYPES          | 其他类型。 |

###### NotificationTemplate

| 名称 | 类型                   | 说明       |
| ---- | ---------------------- | ---------- |
| name | string                 | 模板名称。 |
| data | {[key:string]: Object} | 模板数据。 |

###### NotificationActionButton

| 名称      | 类型                   | 说明                      |
| --------- | ---------------------- | ------------------------- |
| title     | string                 | 按钮标题                  |
| wantAgent | WantAgent              | 点击按钮时触发的WantAgent |
| extras    | { [key: string]: any } | 按钮扩展信息              |
| userInput | NotificationUserInput  | 用户输入对象实例          |





##### 发布通知

###### 发布基础类型通知

基础类型通知主要应用于发送短信息、提示信息、广告推送等，支持普通文本类型、长文本类型、多行文本类型和图片类型，可以通过contentType指定通知的内容类型

1. 普通文本类型通知
   由标题、文本内容和附加信息三个字段组成，其中标题和文本内容是必填字段

   ```ets
   let notificationRequest = {
     id: 1,
     content: {
       contentType: NotificationManager.ContentType.NOTIFICATION_CONTENT_BASIC_TEXT, // 普通文本类型通知!!
       normal: {
         title: 'test_title', // 标题
         text: 'test_text', // 文本内容
         additionalText: 'test_additionalText', // 附加信息
       }
     }
   }
   // 方式1 callback形式
   NotificationManager.publish(notificationRequest, (err) => {
       if (err) {
           console.error(`[ANS] failed to publish, error[${err}]`);
           return;
       }
       console.info(`[ANS] publish success`);
   });
   // 方式2 promise形式
   Notification.publish(notificationRequest).then(() => {
       console.info("publish success");
   });
   ```

2. 长文本类型通知
   继承了普通文本类型的字段，同时新增了长文本内容、内容概要和通知展开时的标题。通知默认显示与普通文本相同，展开后，标题显示为展开后标题内容，内容为长文本内容

   ```ets
   let notificationRequest = {
     id: 1,
     content: {
       contentType: NotificationManager.ContentType.NOTIFICATION_CONTENT_LONG_TEXT, // 长文本类型通知
       longText: {
         title: 'test_title', // 标题
         text: 'test_text', // 文本内容
         additionalText: 'test_additionalText', // 附加信息
         longText: 'test_longText', // 展开后文本内容
         briefText: 'test_briefText', // 通知概要内容，是对通知内容的总结
         expandedTitle: 'test_expandedTitle', // 展开后的标题
       }
     }
   }
   
   // 发布通知
   NotificationManager.publish(notificationRequest, (err) => {});
   ```

3. 多行文本类型通知
   继承了普通文本类型的字段，同时新增了多行文本内容、内容概要和通知展开时的标题。通知默认显示与普通文本相同，展开后，标题显示为展开后标题内容，多行文本内容多行显示

   ```ets
   let notificationRequest = {
     id: 1,
     groupName: 'longGroup' // 这个代表这个类型的都归为longGroup组
     content: {
       contentType: NotificationManager.ContentType.NOTIFICATION_CONTENT_MULTILINE, // 多行文本类型通知
       multiLine: {
         title: 'test_title', // 标题
         text: 'test_text', // 文本内容
         briefText: 'test_briefText', // 附加信息
         longTitle: 'test_longTitle', // 展开后的标题
         lines: ['line_01', 'line_02', 'line_03', 'line_04'], // 展开后文本内容
       }
     }
   }
   // 发布通知
   NotificationManager.publish(notificationRequest, (err) => {});
   ```
   
4. 图片类型通知
   继承了普通文本类型的字段，同时新增了图片内容、内容概要和通知展开时的标题，图片内容为PixelMap型对象，其大小不能超过2M

   ```ets
   import image from '@ohos.multimedia.image';
   // 将资源图片转化为PixelMap对象
   let resourceManager = getContext(this).resourceManager;
   let imageArray = await resourceManager.getMediaContent($r('app.media.bigPicture').id);
   let imageResource = image.createImageSource(imageArray.buffer);
   let imagePixelMap: PixelMap = await imageResource.createPixelMap();
   let notificationRequest: NotificationManager.NotificationRequest = {
     id: 1,
     content: {
       contentType: notificationManager.ContentType.NOTIFICATION_CONTENT_PICTURE,
       picture: {
         title: 'test_title',
         text: 'test_text',
         additionalText: 'test_additionalText',
         briefText: 'test_briefText',
         expandedTitle: 'test_expandedTitle',
         picture: imagePixelMap
       }
     }
   };
   
   // 发布通知
   NotificationManager.publish(notificationRequest, (err) => {});
   
   ```
   



###### 发布进度类型通知

进度条通知也是常见的通知类型，主要应用于文件下载、事务处理进度显示。HarmonyOS提供了进度条模板，发布通知应用设置好进度条模板的属性值，如模板名、模板数据，通过通知子系统发送到通知栏显示。

需要先做判断，查询系统是否支持进度条模板，查询结果为支持downloadTemplate模板类通知

```ets
let supportTemplate = await Notification.isSupportTemplate('downloadTemplate')
if(supportTemplate){
	// ....
}
```

```ets
let template = {
  name:'downloadTemplate',
  data: {
    title: '标题：',
    fileName: 'music.mp4',
    progressValue: 30,
    progressMaxValue:100,
  }
}
//构造NotificationRequest对象
let notificationRquest = {
  id: 1,
  slotType: notify.SlotType.OTHER_TYPES, // 通道类型
  template: template,
  content: {
    contentType: notify.ContentType.NOTIFICATION_CONTENT_BASIC_TEXT,
    normal: {
      title: template.data.title + template.data.fileName,
      text: "sendTemplate",
      additionalText: "30%"
    }
  },
  deliveryTime: new Date().getTime(),
  showDeliveryTime: true
}
NotificationManager.publish(notificationRquest).then(() => {
  console.info(`[ANS] publish success `);
}).catch((err) => {
  console.error(`[ANS] failed to publish, error[${err}]`);
});
```





###### 为通知添加行为意图

行为意图主要是指拉起指定的应用组件及发布公共事件等能力

发布通知的应用向应用组件管理服务AMS（Ability Manager Service）申请WantAgent，然后随其他通知信息一起发送给桌面，当用户在桌面通知栏上点击通知时，触发WantAgent动作

```ets
import wantAgent from '@ohos.app.ability.wantAgent';
```

```ets
// 通过WantAgentInfo的operationType设置动作类型。
let wantAgentInfo = {
    wants: [
        {
            deviceId: '',
            bundleName: 'com.example.test',
            abilityName: 'com.example.test.MainAbility',
            action: '',
            entities: [],
            uri: '',
            parameters: {}
        }
    ],
    operationType: wantAgent.OperationType.START_ABILITY,
    requestCode: 0,
    wantAgentFlags:[wantAgent.WantAgentFlags.CONSTANT_FLAG]
}

wantAgent.getWantAgent(wantAgentInfo, (err, data) => {
    if (err) {
        console.error('[WantAgent]getWantAgent err=' + JSON.stringify(err));
    } else {
        console.info('[WantAgent]getWantAgent success');
        wantAgentObj = data;
    }
});

let notificationRequest = {
    content: {
        contentType: NotificationManager.ContentType.NOTIFICATION_CONTENT_BASIC_TEXT,
        normal: {
            title: 'Test_Title',
            text: 'Test_Text',
            additionalText: 'Test_AdditionalText',
        },
    },
    id: 1,
    label: 'TEST',
    wantAgent: wantAgentObj,
}
NotificationManager.publish(notificationRequest, (err) => {
    if (err) {
        console.error(`[ANS] failed to publish, error[${err}]`);
        return;
    }
    console.info(`[ANS] publish success `);
});
```

