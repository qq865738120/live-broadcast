import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import RedPacketPage from '@/components/RedPacketPage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/red',
      name: 'RedPacketPage',
      component: RedPacketPage
    }
  ]
})
