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
初始化直播相关数据
*/
const _liveInit = async function() {
  await context.$axios.get('/api/newmedia/mobile/live/getLive.action', { params: { liveTitleId: context.$utils.getParam('liveTitleId') } }).then(res => {
    console.log('主页相关参数', res.data);
    if (res.data.status == 'Y') {
      context.$store.commit('setTitle', res.data.row.title);
      context.$store.commit('setShopNumber', res.data.shopNumber);
      context.$store.commit('setProductId', res.data.row.productId != undefined ? res.data.row.productId : '');
      context.$store.commit('setIsLive', res.data.row.playback == 0 ? true : false);
      context.$store.commit('setVideoSource', context.$store.state.isLive ? res.data.row.receiveHlsStreamUrl : !res.data.row.otherPalybackUrl ? res.data.row.palybackUrl : res.data.row.otherPalybackUrl);
      context.$store.commit('setVideoCoverpic', res.data.row.logo);
    }
  })
  await context.$axios.get('/api/newmedia/mobile/cmpySetting/selectCompanyInFo.action', { params: { cmpyId: context.$store.state.cmpyId } }).then(res => {
    console.log('企业相关参数', res.data);
    context.$store.commit('setCmpyName', res.data.cmpyName);
    context.$store.commit('setLogoUrl', res.data.logoUrl);
    context.$store.commit('setTelephone', res.data.telephone);
  })
}

/*
初始化home页，该函数为异步函数，严格按照初始化顺序执行，不得随意更换初始化顺序，
否则会发生意外的结果
参数：that 页面this引用
*/
const init = async function(that) {
  context = that;
  getLiveWatched(); //获取直播访问人数
  await _liveInit();
  getInteractionList({ //获取互动列表
    curMaxId: "",
    rows: 4,
    liveId: context.$store.state.liveTitleId
  });
  refreshOrder({ //获取成交订单列表
    autoObjectId: that.$store.state.liveTitleId,
    page: context.$store.state.orderPage,
    rows: 10
  }, true);
  await getTabProp(); //获取tab栏配置信息
  if (context.showAdBar) { //如果需要显示广告条
    context.adBar.content = getTabContent(context.adBarId);
  }
  if (context.$store.state.productId == "") { //没有绑定产品
    context.isShowBuyButton = false;
    context.inputWidth = '7.4rem'
  } else {
    context.isShowBuyButton = true;
    context.inputWidth = '2.5rem'
  }
  setSwiperHeight('6.78rem', '7.98rem');
  context.$store.commit('switchInitFag'); //将初始化标志置位true
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

/*
刷新订单列表
参数：parameter 接口请求参数
     isReset 是否重置列表中已有信息
*/
const refreshOrder = function(parameter, isReset) {
  return new Promise(resolve => {
    context.$axios.get('/api/newmedia/mobile/live/getOrderList.action', { params: parameter }).then(res => {
      console.log('获取成交列表', res.data);
      if (res.data.status == 'Y') {
        if (isReset) {
          context.orderList = new Array();
        }
        for (let item of res.data.rows) {
          context.orderList.push({
            src: !item.headImg ? 'http://q.img.soukong.cn/af.png' : item.headImg,
            nickName: item.userName,
            time: item.createTime,
            count: item.quantity,
            money: item.amount
          })
        }
      }
      resolve(res.data);
    })
  })
}

/*
获取tab栏配置信息，在其他组件中使用状态仓库中的配置变量tapProp时，如果是在组件created或者mounted中使用，
则需要使用utils中的waitTask方法进行阻塞。传入initFag，因为该标志为true则表示所有初始化工作已经完成。
*/
const getTabProp = function() {
  return new Promise(resolve => {
    context.$axios.get('/api//newmedia/mobile/live/getLiveSwitch.action', { params: { liveTitleId: context.$store.state.liveTitleId } }).then(res => {
      console.log('获取栏目配置', res.data);
      if (res.data.status == 100) {
        context.$store.commit('setTapProp', res.data.data); //将配置信息存入状态仓库，方便其他组件使用
        const tabItem = [1, 2, 3, 5 ,10 ,11 ,12] //tab栏switchType
        for (let item of res.data.data) {
          for (let tab of tabItem) { //tab栏配置
            if (item.switchType == tab && item.switchStatus == 1) {
              context.tabItems.push({
                id: item.id,
                typeId: item.switchType,
                text: item.switchName
              })
            }
          }
          if (item.switchType == 4 && item.switchStatus == 1) { //广告条配置
            context.adBar.showAdBar = true
            context.adBar.adBarId = item.id
          }
        }
      }
      resolve();
    })
  })
}

/*
获取直播访问人数
*/
const getLiveWatched = function() {
  return new Promise(resolve => {
    context.$axios.get('/api/newmedia/mobile/live/getAccessTotal.action', { params: { liveTitleId: context.$store.state.liveTitleId } }).then(res => {
      console.log('直播访问人数', res.data);
      if (res.data.status == 100) {
        context.watched = res.data.data.accessTotal;
      }
    })
  })
}

/*
获取广告、tab栏简介、tab栏自定义的内容
参数：id 相应栏目的id
返回：promise成功回调的参数为获取的内容，可直接填入页面
*/
const getTabContent = function(id) {
  return new Promise(resolve => {
    context.$axios.get('/newmedia/mobile/live/getLiveSwitchCountent.action', { params: { switchId: id } }).then(res => {
      console.log('获取tab内容', res.data);
      if (res.data.status == 100) {
        resolve(res.data.data.content)
      }
    })
  })
}

export default {
  init,
  setSwiperHeight,
  getInteractionList,
  getInteractionHistoryList,
  refreshInteraction,
  refreshOrder,
  getTabProp,
  getLiveWatched,
  getTabContent
}
