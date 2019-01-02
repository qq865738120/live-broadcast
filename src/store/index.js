import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {

    environment: '', //环境配置，本地为local，线上为online
    host: '', //域名配置
    path: '', //接口路径前缀
    relHost: '', //实际真实域名，该配置会影响对接老项目的url跳转

    appid: 'wxfb8665f40c96d92c',
    initFag: false, //初始化完成标志，false表示未完成程序的初始化操作
    liveTitleId: '',
    openId: '',
    cmpyId: '', //企业id
    cmpyName: '', //企业名称
    logoUrl: '', //企业logUrl
    telephone: '', //企业电话
    title: '', //标题
    shopNumber: '', //店铺号
    productId: '', //产品id
    accountId: '', //分销商id
    maxInteractionId: '', //最大互动消息id
    minInteractionId: '', //最小互动消息id
    isRequestInteraction: false, //是否正在请求互动消息接口
    valve: 2, //阈值
    isInteractionInputing: false, //是否正在输入互动消息
    interactionTime: 0, //发互动消息间隔时间，10秒发一次，等于0才可以发送
    redActivityId: '', //红包id
    orderPage: 1, //表示订单列表目前刷新到第几页
    productDetail: '没有产品', //产品详情富文本
    tabProp: '', //tab栏配置
    isLive: '', //是否是直播
    isStart: '', //是否开始播放了，开始之后又分为直播还是回看
    videoSource: '', //视频源
    videoCoverpic: '', //视频首图
    redOrderNo: '', //红包订单
  },
  mutations: {
    setEnvironment(state, value) {
      state.environment = value
    },
    setHost(state, value) {
      state.host = value
    },
    setPath(state, value) {
      state.path = value
    },
    setRelHost(state, value) {
      state.relHost = value
    },
    setAppid(state, value) {
      state.appId = value
    },
    switchInitFag(state) {
      state.initFag = !state.initFag;
    },
    setLiveTitleId(state, value) {
      state.liveTitleId = value
    },
    setOpenId(state, value) {
      state.openId = value
    },
    setCmpyId(state, value) {
      state.cmpyId = value
    },
    setCmpyName(state, value) {
      state.cmpyName = value;
    },
    setLogoUrl(state, value) {
      state.logoUrl = value
    },
    setTelephone(state, value) {
      state.telephone = value;
    },
    setTitle(state, value) {
      state.title = value
    },
    setShopNumber(state, value) {
      state.shopNumber = value;
    },
    setProductId(state, value) {
      state.productId = value
    },
    setAccountId(state, value) {
      state.accountId = value
    },
    setMaxInteractionId(state, value) {
      state.maxInteractionId = value;
    },
    setMinInteractionId(state, value) {
      state.minInteractionId = value;
    },
    switchRequestInteraction(state) {
      state.isRequestInteraction = !state.isRequestInteraction
    },
    setValve(state, value) {
      state.value = value
    },
    switchInteractionInputing(state) {
      state.isInteractionInputing = !state.isInteractionInputing
    },
    setInteractionInputing(state, value) {
      state.isInteractionInputing = value
    },
    addInteractionTime(state) {
      state.interactionTime++
    },
    resetInteractionTime(state) {
      state.interactionTime = 0
    },
    setRedActivityId(state, value) {
      state.redActivityId = value;
    },
    addOrderPage(state) {
      state.orderPage++
    },
    resetOrderPage(state) {
      state.orderPage = 1
    },
    setProductDetail(state, value) {
      state.productDetail = value;
    },
    setTabProp(state, value) {
      state.tabProp = value;
    },
    setIsLive(state, value) {
      state.isLive = value;
    },
    setIsStart(state, value) {
      state.isStart = value
    },
    setVideoSource(state, value) {
      state.videoSource = value
    },
    setVideoCoverpic(state, value) {
      state.videoCoverpic = value;
    },
    setRedOrderNo(state, value) {
      state.redOrderNo = value;
    }
  }
})
