### Want/WantAgent/wantConstant

#### Want

Want是对象间信息传递的载体, 可以用于应用组件间的信息传递

##### 属性

| 名称        | 类型                 | 必填 | 说明                                                         |
| ----------- | -------------------- | ---- | ------------------------------------------------------------ |
| deviceId    | string               | 否   | 表示运行指定Ability的设备ID。                                |
| bundleName  | string               | 否   | 表示包描述。如果在Want中同时指定了BundleName和AbilityName，则Want可以直接匹配到指定的Ability。 |
| abilityName | string               | 否   | 表示待启动的Ability名称。如果在Want中该字段同时指定了BundleName和AbilityName，则Want可以直接匹配到指定的Ability。AbilityName需要在一个应用的范围内保证唯一。 |
| uri         | string               | 否   | 表示Uri描述。如果在Want中指定了Uri，则Want将匹配指定的Uri信息，包括scheme, schemeSpecificPart, authority和path信息。 |
| type        | string               | 否   | 表示MIME type类型描述，打开文件的类型，主要用于文管打开文件。比如：'text/xml' 、 'image/*'等。 |
| flags       | number               | 否   | 表示处理Want的方式。默认传数字，具体参考：[flags说明](https://developer.harmonyos.com/cn/docs/documentation/doc-references-V3/js-apis-app-ability-wantconstant-0000001544583993-V3#ZH-CN_TOPIC_0000001574088589__wantconstantflags)。 |
| action      | string               | 否   | 表示要执行的通用操作（如：查看、分享、应用详情）。在隐式Want中，您可以定义该字段，配合uri或parameters来表示对数据要执行的操作。 |
| parameters  | {[key: string]: any} | 否   | 表示WantParams描述，由开发者自行决定传入的键值对。默认会携带以下key值：- ohos.aafwk.callerPid：表示拉起方的pid。- ohos.aafwk.param.callerToken：表示拉起方的token。- ohos.aafwk.param.callerUid：表示[BundleInfo](https://developer.harmonyos.com/cn/docs/documentation/doc-references-V3/js-apis-bundlemanager-bundleinfo-0000001478341337-V3#ZH-CN_TOPIC_0000001523488926__bundleinfo-1)中的uid，应用包里应用程序的uid。- component.startup.newRules：表示是否启用新的管控规则。- moduleName：表示拉起方的模块名，该字段的值即使定义成其他字符串，在传递到另一端时会被修改为正确的值。- ohos.dlp.params.sandbox：表示dlp文件才会有。 |
| entities    | Array<string>        | 否   | 表示目标Ability额外的类别信息（如：浏览器、视频播放器），在隐式Want中是对action字段的补充。在隐式Want中，您可以定义该字段，来过滤匹配Ability类型。 |
| moduleName  | string               | 否   | 表示待启动的Ability所属的模块（module）。                    |

#### 

