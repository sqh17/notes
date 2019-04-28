var fs = require('fs')
console.log('准备打开文件！')
var data = fs.readFileSync('css/works/zhijiaxing.css', 'utf8')
var str = data.replace(/\:\s*/g, ':')
var reg = /(\s*(\d*\.*\d*)rem)*\s*(\d*\.*\d*)rem\;/g
var arr = []
var str1 = str.replace(reg, function (str) {
  arr = str
    .replace(/rem/g, '')
    .replace(/\;/g, '')
    .split(' ');

  var newArr = arr.map((item, index) => {
    item = (Math.ceil(item * 39.06) * 0.01).toFixed(2);
    if(item == '0'){ // 当为 0 时
      item = '0rem'
    }else{
      item = item + ''.slice(-1) + 'rem';
      if (index == arr.length - 1) {
        item = item + ';';
      }
    }
    return item
  })
  str = newArr.join(' ');
  return str
})
str1 = str1.replace(/\:/g,': ').replace(/\:\s\:\s/g,'::')


fs.writeFile('css/works/zhijiaxing.css', str1, function (err, fd) {
  if (err) {
    console.log(err);
  } else {
    console.log('修改成功')
  }
})