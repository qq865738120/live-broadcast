/* home页面方法类 */

let context = "" //home页面this引用

/*
格式化互动列表信息，将接口中的数据转换成视图可用格式
参数：data 数据
返回：视图数据数组
*/
const _formateInteractionList = function(data) {
  let result = [];
  for (let item of data) {
    result.push({
      id: item.id,
      title: item.name,
      time: item.createTime,
      message: item.content,
      isMaster: 2 == item.type ? true : false,
      icon: item.headImg,
      image: item.contentImg
    })
  }
  return result;
}

/*
初始化home页
参数：that 页面this引用
*/
const init = function(that) {
  context = that;
  setSwiperHeight('6.78rem', '7.98rem');
  getInteractionList({
    curMaxId: "",
    rows: 2,
    liveId: context.$store.state.liveTitleId
  });
}

/*
设置swiper高度
参数：height1 adBar显示时候的高度 height2 adBar隐藏时的高度
*/
const setSwiperHeight = function(height1, height2) {
  context.swiperHeight = context.showAdBar ? height1 : height2;
}

/*
获取互动初始列表
参数：parameter Object 接口所需参数
*/
const getInteractionList = function(parameter) {
  context.$axios.get('/api/newmedia/mobile/liveMessage/getLeaveMessageNewPass.action', { params: parameter }).then(res => {
    console.log('互动列表', res);
    if (res.data.status == 'Y') {
      context.interactionList = _formateInteractionList(res.data.rows);
    } else {
      context.$vux.toast.show({
        text: '互动消息加载失败',
        type: 'text'
      })
    }
  })
}

const getInteractionHistoryList = function(parameter) {
  context.$axios.get('/api/newmedia/mobile/liveMessage/getLeaveMessageOldPass.action', { params: parameter })
}

export default {
  init,
  setSwiperHeight,
  getInteractionList
}
