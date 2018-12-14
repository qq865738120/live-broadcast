// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'normalize.css'
import '@/assets/style/common.scss'
import 'lib-flexible/flexible'
import './common/vux-component.js' //vux按需引入组件
import utils from './common/utils.js' //全局引入自定义工具类
import $ from 'jquery'
import { listPullLoading } from 'list-pull-loading' //一个第三方的上拉加载下拉刷新列表组件
import "list-pull-loading/dist/list-pull-loading.css"

Vue.config.productionTip = false

Vue.prototype.$utils = utils;
Vue.prototype.$ = $;
Vue.component('ListPullLoading', listPullLoading)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: `<App/>`
})
