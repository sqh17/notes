#### vue-router切换路由时同一组件不更新问题

##### 场景
在研发中有一个场景，创建页和编辑页是同一个组件不同的path同一个router-view，通过query的参数来区分创建页还是编辑页，左边还有个nav栏，创建页和列表页，列表页点击某一项直接切换到编辑页。现在有个问题就是点击nav栏时，组件不重新加载更新。

##### 解决方案
1. 给router-view添加key
    1. 代码示例：
        ```html
        <router-view :key="$route.path"></router-view>
        ```
    2. 方案讲解
        vue本身都有组件复用的能力，该路由对应的组件在路由地址path发生了改变但同一个组件，会复用该组件，不会再重新创建该组件实例，所以对应的写在生命周期钩子函数中的异步请求代码就不会执行，页面也不会重新渲染。想办法让它声明不是同一组件即可
        eg：虽然改变了path，但是引用还是同一组件，所以不能单纯看地址栏的变化。（只有这个猜测之说，后续再调查下）
    3. 不同点（网上查阅）：
        1. 不设置 router-view 的 key 属性
            由于 Vue 会复用相同组件, 即 /page/1 => /page/2 或者 /page?id=1 => /page?id=2 这类链接跳转时, 将不在执行created, mounted之类的钩子, 这时候你需要在路由组件中, 添加beforeRouteUpdate钩子来执行相关方法拉去数据
        2. 设置 router-view 的 key 属性值为 $route.path
            从/page/1 => /page/2, 由于这两个路由的$route.path并不一样, 所以组件被强制不复用, 相关钩子加载顺序为:
            beforeRouteUpdate => created => mounted

            从/page?id=1 => /page?id=2, 由于这两个路由的$route.path一样, 所以和没设置 key 属性一样, 会复用组件, 相关钩子加载顺序为:
            beforeRouteUpdate
        3. 设置 router-view 的 key 属性值为 $route.fullPath
            从/page/1 => /page/2, 由于这两个路由的$route.fullPath并不一样, 所以组件被强制不复用, 相关钩子加载顺序为:
            beforeRouteUpdate => created => mounted

            从/page?id=1 => /page?id=2, 由于这两个路由的$route.fullPath并不一样, 所以组件被强制不复用, 相关钩子加载顺序为:
            beforeRouteUpdate => created => mounted
2. 通过watch监听$route
    1. 代码示例：
        ```
        $route(to,from){
            console.log('to', to);
            if(to.path == 'xxx') {
                // coding
            }
            console.log('from', from);
        },
        ```
    2. 方案讲解
        watch能监听任何data的变化，也包括路由的变化。通过to/from的参数来实行相应的回调。

##### 拓展
1. beforeRouteUpdate不生效
原因：在vue-router官方文档中说到,只有/foo/:id这样形式的才能生效,和我的需求不符。
```
beforeRouteUpdate (to, from, next) {
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
    // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    // 可以访问组件实例 `this`
}
```
2. $route.path 当前路由的路径
3. $route.fullPath 完整的路径

##### 参考资料
[router-view的key属性解决路由更新问题](https://blog.csdn.net/qq379682421/article/details/109892131?spm=1001.2101.3001.6661.1&utm_medium=distribute.pc_relevant_t0.none-task-blog-2%7Edefault%7ECTRLIST%7Edefault-1-109892131-blog-125007651.pc_relevant_multi_platform_whitelistv3&depth_1-utm_source=distribute.pc_relevant_t0.none-task-blog-2%7Edefault%7ECTRLIST%7Edefault-1-109892131-blog-125007651.pc_relevant_multi_platform_whitelistv3&utm_relevant_index=1)