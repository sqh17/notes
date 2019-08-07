// 初始化
setHtmlFontSize(1920,1024,19.2);
// 当屏幕宽度发生变化时，触发
if(window.addEventListener){
  window.addEventListener('resize',function(){
    setHtmlFontSize(1920,1024,19.2);
  },false);
}
/**
 * 
 * @param {*} maxWidth 最大宽度
 * @param {*} minWidth 最小宽度
 * @param {*} piex 适配比例
 */
function setHtmlFontSize(maxWidth,minWidth,piex) {
  var screenWidth = document.documentElement.clientWidth,
      deviceWidth;
  if(screenWidth >= 1500){
    deviceWidth = maxWidth;
  }else if(screenWidth < minWidth){
    deviceWidth = minWidth;
  }else {
    deviceWidth = screenWidth;
  }
  document.getElementsByTagName("html")[0].style.cssText = 'font-size:' + deviceWidth / piex + 'px !important';
}