import Vue from 'vue'

import {
  Toast,
  Tab,
  TabItem,
  LoadingPlugin,
} from 'vux'
Vue.component('Toast', Toast)
Vue.component('Tab', Tab)
Vue.component('TabItem', TabItem)
Vue.use(LoadingPlugin)
