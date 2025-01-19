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
