import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    initFag: false, //初始化完成标志，false表示未完成程序的初始化操作
    liveTitleId: '',
    openId: '',
    cmpyId: '', //企业id
    cmpyName: '', //企业名称
    logoUrl: '', //企业logUrl
    title: '', //标题
    shopNumber: '', //店铺号
    productId: '', //产品id
    maxInteractionId: '', //最大互动消息id
    minInteractionId: '', //最小互动消息id
    isRequestInteraction: false, //是否正在请求互动消息接口
    valve: 2, //阈值
    isInteractionInputing: false, //是否正在输入互动消息
    interactionTime: 0, //发互动消息间隔时间，10秒发一次，等于0才可以发送
  },
  mutations: {
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
    setTitle(state, value) {
      state.title = value
    },
    setShopNumber(state, value) {
      state.shopNumber = value;
    },
    setProductId(state, value) {
      state.productId = value
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
    addInteractionTime(state) {
      state.interactionTime++
    },
    resetInteractionTime(state) {
      state.interactionTime = 0
    }
  }
})
