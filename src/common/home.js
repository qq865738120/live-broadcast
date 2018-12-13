/* home页面方法类 */

let context = "" //home页面this引用

/*
初始化home页
参数：that 页面this引用
*/
const init = function(that) {
  context = that;
  setSwiperHeight('6.78rem', '7.98rem')
}

/*
设置swiper高度
参数：height1 adBar显示时候的高度 height2 adBar隐藏时的高度
*/
const setSwiperHeight = function(height1, height2) {
  context.swiperHeight = context.showAdBar ? height1 : height2;
}

export default {
  init,
  setSwiperHeight
}
