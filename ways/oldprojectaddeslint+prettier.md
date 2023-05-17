# 前言

该项目一开始搭建的时候没有更好的配置eslint和prettier，格式化不是很好，导致同事开发项目push的时候五花八门，所以借此机会为该项目添加eslint和prettier，为后面需求研发提升研发效率，此文也作为一篇技术文展现，记录了步骤以及遇见的问题处理。

## node-sass换为sass

### 步骤

1. 删除node-sass

```bash
yarn remove node-sass -D
```

2. 添加sass，sass-loader

```bash
yarn add sass sass-loader -D
```

### 原因

#### 抛弃node-sass缘由

* node-sass只适用于开发环境的依赖项，每次更新需要切换相应的node版本
* node-sass在不同的开发环境下（window）需要安装相应的语言环境（python）
* node-sass在install的时候因为外网，可能会下载失败，耗费大量的时间

#### 选择dart-sass原因

现在dart-sass已经更名为sass，直接下载sass即可

* 稳定，官方已经将dart-sass作为主要发展方向
* 下载不需要翻墙，速度极快
* 编译成js，易于在node下使用

#### 区别

1. node-sass 是用node(调用cpp编写的libsass) 来编译sass，dart-sass是用 drat VM 来编译sass
2. node-sass 是实时自动编译的，dart-sass 需要保存后才会生效

#### 改动地方

转成sass后，需要对项目里做一些操作，sass目前不支持::deep和>>>
全局搜索，将 __::deep__ 和 __>>>__ 替换成 __::v-deep__

### 错误呈现

当安装sass，sass-loader后，运行项目会发现控制台报错，

```json
this.getOptions is not a function
```

这种情况是可能是sass-loader版本不对的情况导致的,因为直接yarn sass sass-loader取的是当前最新版本的，经过查阅是版本低。

解决方案是

```bash
yarn add sass-loader@10.1.0 -D
```

控制台报错：cannot find module ‘node-sass'
查看一下sass-loader的版本
这种情况是sass-loader版本过低，建议升级sass-loader版本7.1.0以上

## eslint

### 定义

ESLint 是一个可配置的 JavaScript 检查器。它可以帮助你发现并修复 JavaScript 代码中的问题。问题可以指潜在的运行时漏洞、未使用最佳实践、风格问题等。
在提高代码可读性的前提下，减少问题，将问题更多的暴露在开发环境下。

### 作用

* 代码质量问题： 使用/编写的方式可能有问题
* 代码风格问题： 风格不符合一定规则

通过eslint强制规定某一风格，形成统一

## prettier

### 定义

Prettier is an opinionated code formatter for js/jsx/vue/css/scss/...
prettier是一个固执的代码格式化工具。

就是必须按照prettier的特有的方式输出代码， 不管你写的代码是个什么鬼样子，Prettier 会去掉你代码里的所有样式风格，然后用统一固定的格式重新输出。

## eslint与prettier的区别

* eslint是按照规则(Rules)去检查代码的，遇到不符合规则的代码就会提示你，有的规则还能自动帮你解决冲突，有两类规则：
  1. Formatting rules
    例如 ESlint 的max-len规则，设置单行长度不能超过 80 字符
  2. Code-quality rules
    例如 ESLint 的no-unused-vars规则，不允许没用的变量定义出现。

* 而 Prettier 则不会这么麻烦，它根本不管你之前符不符合什么规则，都先把你的代码解析成 AST，然后按照它自己的风格给你重新输出代码。
换句话说，Prettier 对应的是各种eslint的Formatting rules 这一类规则。而且你用了Prettier之后，就不会再违反这类规则了！不需要你自己手动修改代码。

## 整合

Prettier对这类Code-quality规则束手无策。而且这类Code-quality规则也正是各种eslint的重点，因为它们真的能帮你发现很多低级的 Bug。
所以，Prettier并不会取代各种eslint定义的 Formatting rules冲突。eslint检查出来违反Code-quality rules的情况后还需要你自己根据业务逻辑和语法手动修改，Prettier帮你格式化代码，但是不会帮你挑出潜在的错误。

那么既要让Prettier帮你格式化代码，还想让eslint帮你挑出潜在的Code-quality 类错误，怎么办？就需要Prettier和eslint配合使用。
Prettier 和 Linters 的整合需要做两件事：

* 禁用eslint自己的 Formatting rules，让Prettier接管这些职责。
* 让eslint执行时首先能够调用Prettier格式化，然后再检查Code-quality 类规则。

## 步骤

1. 安装依赖
eslint，prettier需要安装在开发环境配置下

```bash
yarn add eslint perttier -D
```

2. 调用eslint,初始化，自动配置eslintrc

```bash
npx eslint --init
```

按照步骤勾选相应的操作，回车，然后会加载相应依赖

会生成一个文件 __.eslintrc.js__

```javascript
module.exports = {
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",//继承Eslint中推荐的（打钩的）规则项http://eslint.cn/docs/rules/
    "plugin:vue/essential"// 此项是用来配置vue.js风格
  ],
  "parserOptions": {
    "ecmaVersion": 13,
    "sourceType": "module"
  },
  "plugins": [
    "vue"
  ],
  "rules": {
  }
};

```

eslint附带了大量的校验规则，
可以在rules里添加，它会依次通过rules去判断代码

```javascript
"semi": [2, "always"],//语句强制分号结尾
"quotes": [2, "double"],//引号类型 ""
"no-alert": 0,//禁止使用alert
"no-console": 2,//禁止使用console
"no-const-assign": 2,//禁止修改const声明的变量
"no-debugger": 2,//禁止使用debugger
"no-duplicate-case": 2,//switch中的case标签不能重复
"no-extra-semi": 2,//禁止多余的冒号
"no-multi-spaces": 1,//不能用多余的空格
```

* 0 代表 关闭
* 1 表示将该规则转换为警告。
* 2 表示将该规则转换为错误。

剩下的可以通过[官网](http://eslint.cn/docs/rules/)去查看
！注意：这个不是ctrl+s后就生效，需要通过命令行才能生效

```bash
npx eslint --ext --fix .js --ext .jsx --ext .vue src/
```

eg: --fix代表自动修复，可以自动修复部分的不符合规范的代码
可以设置到packjson.script中

```bash
scripts:{
  // ...
  "lint": "eslint --ext --fix .js --ext .jsx --ext .vue src/"
}
```

另外编辑器可以通过eslint插件自动检查规范。会自动检查你的代码是否符号规范，并且会在编辑器中标识出来哪里不符合规范，底下终端处还会罗列出问题

3. 使用prettier命令行修复格式化

```bash
scripts:{
  // ...
  "lint": "eslint --ext --fix .js --ext .jsx --ext .vue src/",
  "formate": "npx prettier --write src/"
}
```

4. 配置自定义的prettier规则, 在根目录新建一个文件 __.prettierrc.js__,大部分都是默认值，可以根据情况改写

```js
module.exports = {
  // 一行最多 120 字符
  printWidth: 120,
  // 使用 2 个空格缩进
  tabWidth: 2,
  // 不使用 tab 缩进，而使用空格
  useTabs: false,
  // 行尾需要有分号
  semi: true,
  // 使用单引号代替双引号
  singleQuote: true,
  // 对象的 key 仅在必要时用引号
  quoteProps: 'as-needed',
  // jsx 不使用单引号，而使用双引号
  jsxSingleQuote: false,
  // 末尾使用逗号
  trailingComma: 'all',
  // 大括号内的首尾需要空格 { foo: bar }
  bracketSpacing: true,
  // 箭头函数，只有一个参数的时候，也需要括号
  arrowParens: 'always',
  // 每个文件格式化的范围是文件的全部内容
  rangeStart: 0,
  rangeEnd: Infinity,
  // 不需要写文件开头的 @prettier
  requirePragma: false,
  // 不需要自动在文件开头插入 @prettier
  insertPragma: false,
  // 使用默认的折行标准
  proseWrap: 'preserve',
  // 根据显示样式决定 html 要不要折行
  htmlWhitespaceSensitivity: 'css',
  // 换行符使用 lf
  endOfLine: 'lf',
};
```

编辑器可以安装prettier插件，来实现保存代码是自动格式化代码

5. 冲突

在点击保存的时候，会发现红线不消失，一直闪动，这就是eslint和prettier冲突了。
原因：因为在某些规则下，eslintrc.js有自己的规则，prettierrc.js也有自己的规则，
如：
eslint默认语句结尾不加分号，prettier默认语句结尾加分号；
eslint默认强制使用单引号，prettier默认使用双引号；
eslint默认句末减少不必要的逗号，prettier默认尽可能多使用逗号...

解决方案：
安装以下依赖

* eslint-config-prettier：禁用掉了一些不必要的以及和prettier相冲突的eslint规则；
* eslint-plugin-prettier：将prettier作为eslint的规则来使用，相当于代码不符合prettier的标准时，会报一个eslint错误，同时也可以通过 eslint --fix 来进行格式化；这样就相当于将prettier整合进了eslint中

同样的，在 __.eslintrc.js__ 文件中添加prettier

```js
// 在相同的规则下，在extends里是后者覆盖前者，比如eslint:recommend和plugin:prettier/recommended有相同的规则，是plugin:prettier/recommended规则覆盖前者
extends: [
  'eslint:recommended', //继承Eslint中推荐的（打钩的）规则项http://eslint.cn/docs/rules/
  'plugin:vue/essential', // 此项是用来配置vue.js风格
  'plugin:prettier/recommended', //把plugin:prettier/recommended中设置的规则添加进来，让它覆盖上面设置的规则。这样就不会和上面的规则冲突了
],
```

## 错误呈现

1. 执行 npm run lint 报 'prettier/prettier': context.getPhysicalFilename is not a function,主要是版本不对问题

* 移除以下依赖，项目中不存在的就不用移除

```bash
  yarn remove @vue/cli-plugin-babel @vue/cli-plugin-eslint @vue/eslint-config-prettier eslint eslint-plugin-prettier eslint-plugin-vue prettier
```

* 安装指定版本依赖

```bash
  yarn add -D @vue/cli-plugin-babel@4.4.6 @vue/cli-plugin-eslint@4.4.6 @vue/eslint-config-prettier@7.0.0 eslint@7.15.0 eslint-plugin-prettier@3.4.1 eslint-plugin-vue@7.2.0 prettier@2.5.1
```

2. 执行 npm run lint 报 # Vue error: Parsing error: Unexpected token <

在.eslintrc.js中加入

```js
parser: 'vue-eslint-parser'
```

3. 执行 npm run dev 报 Cannot find module 'core-js/modules/es.array.concat.js'

在babel.config.js添加

```js
module.exports = {
  presets: [['@vue/app',{ useBuiltIns: "entry" }]],
};
```
