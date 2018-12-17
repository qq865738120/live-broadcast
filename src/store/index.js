import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    liveTitleId: '',
    openId: '',
    cmpyId: '',
    maxInteractionId: '', //最大互动消息id
    minInteractionId: '' //最小互动消息id
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
    }
  }
})
