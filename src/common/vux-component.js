import Vue from 'vue'

import {
  Toast,
  ToastPlugin,
  Tab,
  TabItem,
  LoadingPlugin,
  Swiper,
  SwiperItem,
  XInput,
  Group,
  XButton,
  Scroller,
  Checker,
  CheckerItem,
  XNumber
} from 'vux'
Vue.component('Toast', Toast)
Vue.component('Tab', Tab)
Vue.component('TabItem', TabItem)
Vue.use(LoadingPlugin)
Vue.component('Swiper', Swiper)
Vue.component('SwiperItem', SwiperItem)
Vue.component('XInput', XInput)
Vue.component('Group', Group)
Vue.component('XButton', XButton)
Vue.component('Scroller', Scroller)
Vue.component('Checker', Checker)
Vue.component('CheckerItem', CheckerItem)
Vue.component('XNumber', XNumber)

Vue.use(ToastPlugin,  {position: 'middle', width: '4rem'})
