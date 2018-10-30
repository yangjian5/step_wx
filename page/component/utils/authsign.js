var md5util = require('MD5.js')  
var CusBase64 = require('base64.js') 


function auth_sign(params) {
  var queryStr = objKeySort(params);
  queryStr = queryStr.replace(/\s+/g, "");
  return md5util.hexMD5(encodeURIComponent(queryStr) +"y21gsdi35zas0921ksjxu3la5noiwns5ak821#2*ds+")
}

//排序的函数
function objKeySort(arys) {
  var first = true;
  //先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
  var newkey = Object.keys(arys).sort();
  //console.log('newkey='+newkey);
  var newObj = {}; //创建一个新的对象，用于存放排好序的键值对
  var newStr = "";
  for (var i = 0; i < newkey.length; i++) {
    if (first) {
      newStr += newkey[i] + "=" + arys[newkey[i]];
      first = false;
    } else {
      newStr += "&" + newkey[i] + "=" + arys[newkey[i]];
    }
    //遍历newkey数组
    newObj[newkey[i]] = arys[newkey[i]];
    //向新创建的对象中按照排好的顺序依次增加键值对
  }
  return newStr; //返回排好序的新对象
}

function getFormatDateMin() {
  var date = new Date();
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentDate = date.getFullYear() + "-" + month + "-" + strDate
    + " " + date.getHours() + ":" + date.getMinutes();
  return currentDate;
}

module.exports = {
  getFormatDateMin: getFormatDateMin,
  auth_sign: auth_sign
}  