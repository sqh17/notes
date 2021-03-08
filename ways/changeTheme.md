### vue实现深浅色换肤

换肤主要采用了css3的变量。

```javascript
// 浅色的背景或者颜色
const lightModifyVars = {
  '--bg':'lightblue',
  '--font':'black',
  '--iconfont':'green'
}
// 深色的背景或者颜色
const darkModifyVars = {
  '--bg':'rgb(100,100,100)',
  '--font':'white',
  '--iconfont':'red'
}
// 需要安装ponyfill依赖来支持css3的var
import cssVars from "css-vars-ponyfill";

const key = "data-theme";

// 获取当前主题
export const getTheme = (mode) => {
  const localTheme = localStorage.getItem(key); // 使用localstorage存取当前的深浅色，颜色什么的也可以存取，可拓展
  const dataTheme = localTheme
    ? JSON.parse(localTheme)
    : {
        mode: mode || "light"
      };
  return dataTheme;
};

// 初始化主题
export const initTheme = (mode) => {
  const dataTheme = getTheme(mode);
  document.documentElement.setAttribute("data-theme", dataTheme.mode);
  cssVars({
    watch: true,// 当添加，删除或修改其<link>或<style>元素的禁用或href属性时，ponyfill将自行调用
    variables: dataTheme.mode === 'light' ? lightModifyVars : darkModifyVars, // variables 自定义属性名/值对的集合
    onlyLegacy: false // false  默认将css变量编译为浏览器识别的css样式  true 当浏览器不支持css变量的时候将css变量编译为识别的css
  });
};

// 变更主题
export const changeTheme = (mode) => {
  const dataTheme = {
    mode: mode || "light"
  };
  localStorage.setItem(key, JSON.stringify(dataTheme));
  document.documentElement.setAttribute("data-theme", dataTheme.mode);
  cssVars({
    watch: true,
    variables: mode === 'light' ? lightModifyVars : darkModifyVars,
    onlyLegacy: false
  });
};


```
