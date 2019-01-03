/*工具类*/

/*
判断设备系统类型
返回值：0表示安卓，1表示ios，2表示其它
*/
const driverType = function() {
  const ua = navigator.userAgent;
  return ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1 ? 0 : (!!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) ? 1 : 2)
}

/*
获取指定的URL参数值
参数：paramName URL参数
返回值：tyler
 */
function getParam(paramName) {
  let paramValue = "";
  let isFound = !1;
  if (location.href.indexOf("?") != 0 && location.href.indexOf("=") > 1) {
    let hrefArr = unescape(location.href).split("?");
    let arrSource = hrefArr[hrefArr.length - 1].split("&"), i = 0;
    while (i < arrSource.length && !isFound) {
      arrSource[i].indexOf("=") > 0 && arrSource[i].split("=")[0].toLowerCase() == paramName.toLowerCase() && (paramValue = arrSource[i].split("=")[1], isFound = !0), i++
    }
  }
  return paramValue == "" && (paramValue = null), paramValue
}

/*
等待某个任务执行完后继续执行后面的代码。需要在store中注册一个标志
，并且需要使用异步函数或者是promise。
*/
function waitTask(context, valueName) {
  return new Promise(function(resolve) {
    const id = setInterval(() => {
      if (context.$store.state[valueName]) {
        clearInterval(id)
        resolve()
      }
    }, 100);
  })
}

/*
将字符串转换成Date对象，支持安卓和ios
参数：str String 日期字符串
返回：日期对象
*/
function string2Date(str) {
  let arr = str.split(/[- : \/]/);
  // let date = util.switchTime(new Date().getTime() - new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4]).getTime());
  return new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4]);
}

/*
计算两个时间的时间差
参数：now Date 当前时间对象 old Date 历史时间对象
返回：间隔时间戳，毫秒数
*/
function timeDifference(now, old) {
  return now.getTime() - old.getTime();
}

/*
将时间戳（两日期差）转换成日期数组
参数：difference 时间差，毫秒数
返回：日期数组
*/
function timeStemp2DateArr(difference) {
  var years = Math.floor(difference / (365 * 24 * 3600 * 1000));
  var leave4 = difference % (365 * 24 * 3600 * 1000);
  var month = Math.floor(leave4 / (30 * 24 * 3600 * 1000));
  var leave5 = leave4 % (30 * 24 * 3600 * 1000);
  var days = Math.floor(leave5 / (24 * 3600 * 1000));
  var leave1 = leave5 % (24 * 3600 * 1000);
  var hours = Math.floor(leave1 / (3600 * 1000));
  var leave2 = leave1 % (3600 * 1000)
  var minutes = Math.floor(leave2 / (60 * 1000));
  var leave3 = leave2 % (60 * 1000)
  var seconds = Math.round(leave3 / 1000);
  return [years, month, days, hours, minutes, seconds];
}

/*
格式化金额
参数：val 金额
     isCut Boolean 是否需要逗号分隔，不传默认不使用分割符
*/
function formateMoney(val, isCut) {
  val = val.toString().replace(/\$|\,/g,'');
  if(isNaN(val)) {
    val = "0";
  }
  let sign = (val == (val = Math.abs(val)));
  val = Math.floor(val*100+0.50000000001);
  let cents = val%100;
  val = Math.floor(val/100).toString();
  if(cents<10) {
    cents = "0" + cents
  }
  if (isCut) {
    for (var i = 0; i < Math.floor((val.length-(1+i))/3); i++) {
      val = val.substring(0,val.length-(4*i+3))+',' + val.substring(val.length-(4*i+3));
    }
  }
  return (((sign)?'':'-') + val + '.' + cents);
}

export default {
  driverType,
  getParam,
  waitTask,
  string2Date,
  timeDifference,
  timeStemp2DateArr,
  formateMoney
}
