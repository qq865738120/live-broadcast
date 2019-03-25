import Vue from 'vue'
import Router from 'vue-router'
// import Home from '@/components/Home'
// import RedPacketPage from '@/components/RedPacketPage'
// import PaySuccessPage from '@/components/PaySuccessPage'
// import PayFailPage from '@/components/PayFailPage'

const Home = () => import('@/components/Home')
const Home2 = () => import('@/components/Home2')
const RedPacketPage = () => import('@/components/RedPacketPage')
const PaySuccessPage = () => import('@/components/PaySuccessPage')
const PayFailPage = () => import('@/components/PayFailPage')
const RegisterPage = () => import('@/components/RegisterPage')

Vue.use(Router)

export default new Router({
  routes: [
    { // 主页
      path: '/',
      name: 'Home',
      component: Home
    },
    { // 竖屏模式主页
      path: '/home2',
      name: 'Home2',
      component: Home2
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
    { // 注册页面
      path: '/register',
      name: 'RegisterPage',
      component: RegisterPage
    },
  ]
})
