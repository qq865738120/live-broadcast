/* home页面方法类 */

const time1 = 3000;
const time2 = 12000;

let context = "" //home页面this引用
let timer = { //定时器
  interaction: {
    id: '',//互动消息实时刷新定时器id
    currentTime: 0 //当前定时器时间
  }
}
let interactionFag = 0 //互动消息标志，接口返回数据应进行自减操作即增大请求频率，反之则相反
let currentTime = 0 //当前定时器时间

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
动态定时器，可动态修改定时时间
参数：timerId String 计时器id变量名
      all 计时器回调函数
      time 计时器间隔时间
*/
const _dynamicTimer = function(timerId, call, time) {
  if (timer[timerId].currentTime != time) { //如果当前定时器时间不等于需要设置的时间
    timer[timerId].currentTime = time;
    clearInterval(timer[timerId].id);
    timer[timerId].id = setInterval(call, time);
  }
}

/*
智能互动消息计时器，根据接口返回数据情况动态调整请求频率
参数：hasData Boolean 接口是否有数据返回，有则为true，没有则为false
*/
const _IntelligenceInteractionTimer = function(hasData) {
  let time = time1;
  hasData ? interactionFag-- : interactionFag++;
  if (interactionFag > 0) { //如果大于阈值则接口降低请求频率
    interactionFag--;
    interactionFag = interactionFag < -context.$store.state.valve ? -context.$store.state.valve : interactionFag;
    time = time2;
  } else { //如果小于或等于阈值则增加请求频率
    interactionFag++;
    interactionFag = interactionFag > context.$store.state.valve ? context.$store.state.valve : interactionFag;
    time = time1;
  }
  _dynamicTimer('interaction', () => {
    if(!context.$store.state.isRequestInteraction) { //没有正在请求互动消息接口的操作则进行请求操作
      getInteractionList({
        curMaxId: context.$store.state.maxInteractionId,
        rows: 3,
        liveId: context.$store.state.liveTitleId
      })
    }
  }, time)
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
    rows: 4,
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
获取互动初始列表，以及列表刷新
参数：parameter Object 接口所需参数
*/
const getInteractionList = function(parameter) {
  context.$store.commit('switchRequestInteraction');
  return new Promise(resolve => {
    context.$axios.get('/api/newmedia/mobile/liveMessage/getLeaveMessageNewPass.action', { params: parameter }).then(res => {
      console.log('互动列表刷新', res.data);
      if (res.data.status == 'Y') {
        context.interactionList.push(..._formateInteractionList(res.data.rows));
        context.$store.commit('setMinInteractionId', res.data.rows[0].id);
        context.$store.commit('setMaxInteractionId', res.data.rows[res.data.rows.length - 1].id);
        _IntelligenceInteractionTimer(true);
      } else {
        _IntelligenceInteractionTimer(false);
      }
      context.$store.commit('switchRequestInteraction');
      resolve(res.data)
    })
  })
}

/*
获取互动列表历史信息
参数：parameter Object 接口所需参数
*/
const getInteractionHistoryList = function(parameter) {
  context.$store.commit('switchRequestInteraction');
  return new Promise(resolve => {
    context.$axios.get('/api/newmedia/mobile/liveMessage/getLeaveMessageOldPass.action', { params: parameter }).then(res => {
      console.log('互动列表历史', res.data);
      if (res.data.status == 'Y') {
        let arr = _formateInteractionList(res.data.rows);
        arr.push(...context.interactionList);
        context.interactionList = arr;
        context.$store.commit('setMinInteractionId', arr[0].id);
      }
      context.$store.commit('switchRequestInteraction');
      resolve(res.data)
    })
  })
}

/*
刷新互动消息列表
tip：主要供外部组件刷新使用，内部直接使用getInteractionList方法
*/
const refreshInteraction = function() {
  getInteractionList({
    curMaxId: context.$store.state.maxInteractionId,
    rows: 1,
    liveId: context.$store.state.liveTitleId
  })
}

export default {
  init,
  setSwiperHeight,
  getInteractionList,
  getInteractionHistoryList,
  refreshInteraction
}
