/*工具类*/

/*
判断设备系统类型
返回值：0表示安卓，1表示ios，2表示其它
*/
const driverType = function() {
  const ua = navigator.userAgent;
  return ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1 ? 0 : (!!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) ? 1 : 2)
}

const exitFullscreen = function() {
  if(document.exitFullscreen) {
    document.exitFullscreen();
  } else if(document.mozExitFullScreen) {
    document.mozExitFullScreen();
  } else if(document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

export default {
  driverType,
  exitFullscreen
}
