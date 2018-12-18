import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    liveTitleId: '',
    openId: '',
    cmpyId: '',
    maxInteractionId: '', //最大互动消息id
    minInteractionId: '', //最小互动消息id
    isRequestInteraction: false, //是否正在请求互动消息接口
    valve: 2, //阈值
  },
  mutations: {
    setLiveTitleId(state, value) {
      state.liveTitleId = value
    },
    setOpenId(state, value) {
      state.openId = value
    },
    setCmpyId(state, value) {
      state.cmpyId = value
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
    }
  }
})
