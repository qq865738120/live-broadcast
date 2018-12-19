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
    let arrSource = unescape(location.href).split("?")[1].split("&"), i = 0;
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
    }, 50);
  })
}

export default {
  driverType,
  getParam,
  waitTask
}
