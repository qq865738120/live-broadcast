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
tab栏以及广告条配置项数据格式化并填充界面。
此方法需要等待初始化完成后进行。
*/
const _formateTabData = function() {
  const tabItem = [1, 2, 3, 5 ,10 ,11 ,12] //tab栏switchType
  let onProduct = false; // 是否打产品开关switchType为3
  let onBuyButton = false; // 是否打产品开关switchType为6
  for (let item of context.$store.state.tabProp) {
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
    if (item.switchType == 7 && item.switchStatus == 1) { //返回首页配置
      context.isShowHome = true
    }
    if (item.switchType == 1 && item.switchStatus == 1) { //互动栏配置
      context.hasInteraction = true
    }
    if(item.switchType == 3 && item.switchStatus == 1) { //开启产品开关
      onProduct = true
    }
    if(item.switchType == 6 && item.switchStatus == 1) { //开启购买按钮开关
      onBuyButton = true
    }
  }
  if (onProduct && onBuyButton) { //立即购买按钮配置，只有当后台的立即购买开关和产品开关同时打开才显示
    context.isShowBuyButton = true;
    context.inputWidth = '2.5rem'
  } else {
    context.isShowBuyButton = false;
    context.inputWidth = '7.4rem';
  }
}

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
      }, false)
    }
  }, time)
}

/*
初始化home页，该函数为异步函数，严格按照初始化顺序执行，不得随意更换初始化顺序，
否则会发生意外的结果
参数：that 页面this引用
*/
const init = async function(that) {
  context = that;
  getLiveWatched(); //获取直播访问人数
  // await _liveInit();
  getInteractionList({ //获取互动列表
    curMaxId: "",
    rows: 4,
    liveId: context.$store.state.liveTitleId
  }, true);
  refreshOrder({ //获取成交订单列表
    autoObjectId: that.$store.state.liveTitleId,
    page: context.$store.state.orderPage,
    rows: 10
  }, true);
  await context.$utils.waitTask(context, 'initFag'); //等待初始化任务完成后继续执行下面代码
  _formateTabData();
  if (context.adBar.showAdBar) { //如果需要显示广告条
    getTabContent(context.adBar.adBarId).then(result => {
      context.adBar.content = result
    });
  }
  for (let item of context.tabItems) {
    if (item.typeId == 2) { //如果需要获取简介内容
      getTabContent(item.id).then(result => {
        context.summaryContent = result.replace(/<img/g, '<img style="width: 100%"')
      });
    }
    if (item.typeId == 10) { //如果需要获取自定义1内容
      getTabContent(item.id).then(result => {
        context.customContent1 = result.replace(/<img/g, '<img style="width: 100%"')
      });
    }
    if (item.typeId == 11) { //如果需要获取自定义2内容
      getTabContent(item.id).then(result => {
        context.customContent2 = result.replace(/<img/g, '<img style="width: 100%"')
      });
    }
    if (item.typeId == 12) { //如果需要获取自定义3内容
      getTabContent(item.id).then(result => {
        context.customContent3 = result.replace(/<img/g, '<img style="width: 100%"')
      });
    }
  }
  if (!(context.hasInteraction || context.isShowBuyButton)) {
    // setSwiperHeight('8.01rem', '9.21rem');
    setSwiperHeight('calc(100% - 2.42rem)', 'calc(100% - 1.22rem)');
  } else {
    // setSwiperHeight('6.78rem', '7.98rem');
    setSwiperHeight('calc(100% - 3.65rem)', 'calc(100% - 2.45rem)');
  }
  // context.$store.commit('switchInitFag'); //将初始化标志置位true
}

/*
设置swiper高度
参数：height1 adBar显示时候的高度 height2 adBar隐藏时的高度
*/
const setSwiperHeight = function(height1, height2) {
  context.swiperHeight = context.adBar.showAdBar ? height1 : height2;
}

/*
获取互动初始列表，以及列表刷新
参数：parameter Object 接口所需参数
     isFirst Boolean 初始化时候调用传true，之后调用传false
*/
const getInteractionList = function(parameter, isFirst) {
  context.$store.commit('switchRequestInteraction');
  return new Promise(resolve => {
    context.$axios.get(context.$store.state.host + context.$store.state.path + '/newmedia/mobile/liveMessage/getLeaveMessageNewPass.action', { params: parameter }).then(res => {
      // console.log('互动列表刷新', res.data);
      if (res.data.status == 'Y') {
        context.interactionList.push(..._formateInteractionList(res.data.rows));
        let count = 0;
        let id = setInterval(() => {
          if ( count++ > 2 ) clearInterval(id);
          context.$refs.scrollerEvent[0].reset(); //下拉刷新数据请求成功后需调用此函数刷新界面
        }, 1000)
        if (isFirst) { //如果是第一次调用，则将minInteractionId初始化
          context.$store.commit('setMinInteractionId', res.data.rows[0].id);
        }
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
    context.$axios.get(context.$store.state.host + context.$store.state.path + '/newmedia/mobile/liveMessage/getLeaveMessageOldPass.action', { params: parameter }).then(res => {
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
  }, false)
}

/*
刷新订单列表
参数：parameter 接口请求参数
     isReset 是否重置列表中已有信息
*/
const refreshOrder = function(parameter, isReset) {
  return new Promise(resolve => {
    context.$axios.get(context.$store.state.host + context.$store.state.path + '/newmedia/mobile/live/getOrderList.action', { params: parameter }).then(res => {
      console.log('获取成交列表', res.data);
      if (res.data.status == 'Y') {
        if (isReset) {
          context.orderList = new Array();
        }
        context.hasOrderList = true;
        for (let item of res.data.rows) {
          context.orderList.push({
            src: !item.headImg ? 'http://q.img.soukong.cn/af.png' : item.headImg,
            nickName: item.userName,
            time: item.createTime,
            count: item.count,
            money: item.amount
          })
        }
      } else if (0 == context.orderList.length) {
        context.hasOrderList = false;
      }
      resolve(res.data);
    })
  })
}

/*
获取直播访问人数
*/
const getLiveWatched = function() {
  return new Promise(resolve => {
    context.$axios.get(context.$store.state.host + context.$store.state.path + '/newmedia/mobile/live/getAccessTotal.action', { params: { liveTitleId: context.$store.state.liveTitleId } }).then(res => {
      console.log('直播访问人数', res.data);
      if (res.data.status == 100) {
        context.watched = res.data.data.accessTotal;
      }
      resolve();
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
    context.$axios.get(context.$store.state.host + context.$store.state.path + '/newmedia/mobile/live/getLiveSwitchCountent.action', { params: { switchId: id } }).then(res => {
      console.log('获取tab内容', res.data);
      if (res.data.status == 100) {
        let result = res.data.data.length > 0 ? res.data.data[0].content : '';
        resolve(result)
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
  getLiveWatched,
  getTabContent
}
