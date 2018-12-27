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
  XNumber,
  Actionsheet,
  XDialog,
  Qrcode,
  Popup,
  AlertPlugin,
  ConfirmPlugin,
  Icon,
  LoadMore
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
Vue.component('Actionsheet', Actionsheet)
Vue.component('XDialog', XDialog)
Vue.component('Qrcode', Qrcode)
Vue.component('Popup', Popup)
Vue.use(AlertPlugin)
Vue.use(ConfirmPlugin)
Vue.component('Icon', Icon)
Vue.component('LoadMore', LoadMore)

Vue.use(ToastPlugin,  {position: 'middle', width: '4rem'})
