<template>
  <div id="app">
    <transition
      enter-active-class="animated zoomIn faster"
      leave-active-class="animated zoomOut faster">
      <router-view  v-show="$store.state.initFag"/>
    </transition>
    <transition
      enter-active-class="animated zoomIn faster"
      leave-active-class="animated zoomOut faster">
      <div class="com-flex-center loading" v-show="!$store.state.initFag">
        <GridLoader color="#ED7E00" size="10"></GridLoader>
        <p>loading...</p>
      </div>
    </transition>
  </div>
</template>

<script>
import { GridLoader } from '@saeris/vue-spinners'

export default {
  name: 'App',
  /* 该方法中完成项目的初始化工作 */
  async created() {
    let that = this
    console.log("this.$store.state.environment == 'online'",this.$store.state.environment == 'online');
    if (this.$store.state.environment == 'online') {
      await this.$axios.get(that.$store.state.path + '/newmedia/sysCommon/getCommonUrls.action').then(res => {
        this.$store.commit('setHost', res.data.serverHostUrl);
        this.$store.commit('setRelHost', res.data.serverHostUrl);
      })
    }
    this.$axios.get(that.$store.state.host + that.$store.state.path + '/newmedia/mobile/live/addAccessTotal.action', { params: { liveTitleId: that.$store.state.liveTitleId } })
    await this._liveInit()
    await this._getTabProp()
    // await this._getWechatConfig()
    this._optionWeixinShare()
    this.$store.commit('switchInitFag'); //将初始化标志置位true
  },
  components: {
    GridLoader
  },
  methods: {
    /* 获取直播初始化信息 */
    async _liveInit() {
      let that = this;
      await this.$axios.get(that.$store.state.host + that.$store.state.path + '/newmedia/mobile/live/getLive.action', { params: { liveTitleId: that.$utils.getParam('liveTitleId') } }).then(res => {
        console.log('主页相关参数', res.data);
        if (res.data.status == 'Y') {
          this.$store.commit('setTitle', res.data.row.title);
          this.$store.commit('setShopNumber', res.data.shopNumber);
          this.$store.commit('setProductId', res.data.row.productId != undefined ? res.data.row.productId : '');
          this.$store.commit('setIsLive', res.data.row.playback == 0 ? true : false);
          this.$store.commit('setIsStart', res.data.row.status == 0 ? false : true);
          this.$store.commit('setVideoSource', this.$store.state.isLive ? res.data.row.receiveHlsStreamUrl : !res.data.row.otherPalybackUrl ? res.data.row.palybackUrl : res.data.row.otherPalybackUrl);
          this.$store.commit('setVideoCoverpic', res.data.row.logo);
          this.$store.commit('setAccountId', res.data.row.soukongAccountId != undefined ? res.data.row.soukongAccountId : '')
        }
      })
      await this.$axios.get(that.$store.state.host + that.$store.state.path + '/newmedia/mobile/cmpySetting/selectCompanyInFo.action', { params: { cmpyId: that.$store.state.cmpyId } }).then(res => {
        console.log('企业相关参数', res.data);
        this.$store.commit('setCmpyName', res.data.cmpyName);
        this.$store.commit('setLogoUrl', res.data.logoUrl);
        this.$store.commit('setTelephone', res.data.telephone);
      })
    },
    /* 获取页面tab等各种按钮配置信息 */
    _getTabProp() {
      let that = this
      return new Promise(resolve => {
        this.$axios.get(that.$store.state.host + that.$store.state.path + '/newmedia/mobile/live/getLiveSwitch.action', { params: { liveTitleId: that.$store.state.liveTitleId } }).then(res => {
          console.log('获取栏目配置', res.data);
          if (res.data.status == 100) {
            this.$store.commit('setTabProp', res.data.data); //将配置信息存入状态仓库，方便其他组件使用
          }
          resolve();
        })
      })
    },
    /* 获取微信接口相关配置信息 */
    // _getWechatConfig() {
    //   let that = this;
    //   let data = {
    //     url: window.location.href,
    //     cmpyId: that.$store.state.cmpyId
    //   }
    //   return new Promise(resolve => {
    //     this.$axios.get(that.$store.state.host + that.$store.state.path + '/wechatservice/ticket/1.action', { params: data }).then(res => {
    //       console.log('获取微信配置信息', res.data);
    //       const result = res.data
    //       if (!!result.appId) {
    //         that.$store.commit('setAppid', result.appId)
    //         that.$wx.config({
    //           debug: true,
    //           appId: result.appId,
    //           timestamp: result.timestamp,
    //           nonceStr: result.noncestr,
    //           signature: result.signature,
    //           jsApiList:['updateAppMessageShareData','checkJsApi','onMenuShareAppMessage','onMenuShareTimeline']
    //         })
    //       }
    //       resolve();
    //     })
    //   })
    // },
    /* 配置微信分享 */
    _optionWeixinShare() {
      this.$comm.setContext(this);
      this.$comm.doShare();
    }
  }
}
</script>

<style>
  #app {
    width: 100%;
    height: 100%;
    background-color: $--color-333
  }
  .loading {
    width: 100%;
    height: calc(100% - 60px);
    position: absolute;
    z-index: 1000;
    flex-direction: column;
  }
  .loading>p {
    color: #ED7E00;
  }
</style>
