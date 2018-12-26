import Vue from 'vue'
import Router from 'vue-router'
// import Home from '@/components/Home'
// import RedPacketPage from '@/components/RedPacketPage'
// import PaySuccessPage from '@/components/PaySuccessPage'
// import PayFailPage from '@/components/PayFailPage'

const Home = () => import('@/components/Home')
const RedPacketPage = () => import('@/components/RedPacketPage')
const PaySuccessPage = () => import('@/components/PaySuccessPage')
const PayFailPage = () => import('@/components/PayFailPage')

Vue.use(Router)

export default new Router({
  routes: [
    { // 主页
      path: '/',
      name: 'Home',
      component: Home
    },
    { // 发红包页面
      path: '/red',
      name: 'RedPacketPage',
      component: RedPacketPage
    },
    { // 支付成功页面
      path: '/pay/success',
      name: 'PaySuccessPage',
      component: PaySuccessPage
    },
    { // 支付失败页面
      path: '/pay/fail',
      name: 'PayFailPage',
      component: PayFailPage
    },
  ]
})
