// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store' //引入vuex
import axios from 'axios' //引入axios
import Qs from 'qs' //配合axios使用
import 'normalize.css' //浏览器统一样式
import 'animate.css'
import '@/assets/style/common.scss'
import 'lib-flexible/flexible'
import './common/vux-component.js' //vux按需引入组件
import utils from './common/utils.js' //全局引入自定义工具类
import $ from 'jquery'
import { listPullLoading } from 'list-pull-loading' //一个第三方的上拉加载下拉刷新列表组件
import "list-pull-loading/dist/list-pull-loading.css"
import VueLazyload from 'vue-lazyload' //图片懒加载插件
var wx = require('weixin-js-sdk'); //引入微信js-sdk

Vue.config.productionTip = false

Vue.prototype.$axios = axios.create({
  // baseURL: 'http://fm.soukong.cn',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
});
Vue.prototype.$qs = Qs;
Vue.prototype.$utils = utils;
Vue.prototype.$ = $;
Vue.prototype.$wx = wx;

Vue.component('ListPullLoading', listPullLoading)

Vue.use(VueLazyload, {
  attempt: 1,
  lazyComponent: true,
  error: 'http://q.img.soukong.cn/timg.jpg',
  loading: 'http://q.img.soukong.cn/timg.jpg',
})
Vue.use(require('vue-wechat-title')) //引入动态标题插件

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: `<App v-wechat-title="$store.state.title"/>`,
  created() {
    this.init();
  },
  methods: {
    /* 初始化函数 */
    init() {
      let liveTitleId = this.$utils.getParam('liveTitleId');
      this.$store.commit('setLiveTitleId', this.$utils.getParam('liveTitleId'));
      this.$store.commit('setOpenId', this.$utils.getParam('openId'));
      this.$store.commit('setCmpyId', this.$utils.getParam('cmpyId'));
      console.log('liveTitleId =', this.$store.state.liveTitleId);
      console.log('openId =', this.$store.state.openId);
      console.log('cmpyId =', this.$store.state.cmpyId);
    },

  }
})
