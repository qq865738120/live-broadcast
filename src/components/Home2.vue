<template>
  <div class="root">
    <VideoVertical :title="$store.state.title" @x5-enter-fullscreen="x5EnterFullscreen" @x5-exit-fullscreen="x5ExitFullscreen">
    </VideoVertical>

    <!-- 底部菜单开始 -->
    <div class="bottom-bar" v-if="hasInteraction || isShowBuyButton">
      <div class="input" v-if="hasInteraction">
        <span class="com-over-length iconfont icon-bianji" :style="{width: inputWidth}" @click="onInputClick">
          {{ inputWord }}
        </span>
      </div>
      <div class="buy-button" v-if="isShowBuyButton"  @click="onClickBuyButton">立即购买</div>
    </div>
    <!-- 底部菜单结束 -->

    <!-- 悬浮按钮开始 -->
    <div class="suspension">
      <SuspensionButton></SuspensionButton>
      <SuspensionTabs :introduction="summaryContent" :cus1="customContent1" :cus2="customContent2" :cus3="customContent3"></SuspensionTabs>
    </div>
    <!-- 悬浮按钮结束 -->

    <!-- 互动开始 -->
    <div class="interaction">
      <Scroller
        lock-x
        height="100%"
        ref="scrollerEvent"
        use-pulldown
        :pulldown-config="pulldownConfig"
        @on-pulldown-loading="loadingHistoryInteraction">
        <div class="interaction-body">
          <div class="interaction-item" v-if="item.message" v-for="item in interactionList">
            <img :src="item.icon"/>
            <div class="interaction-badge" v-if="item.isMaster"></div>
            <span class="com-over-length">{{ item.message }}</span>
          </div>
        </div>
      </Scroller>
    </div>
    <!-- 互动结束 -->

    <!-- 消息输入框开始 -->
    <transition
      enter-active-class="animated slideInUp faster"
      leave-active-class="animated slideOutDown faster"
      @enter="messageInputEnter">
      <div class="message-input" :style="{ bottom: inputButtom }" v-show="$store.state.isInteractionInputing">
        <MessageInputBar ref="messageBar"></MessageInputBar>
      </div>
    </transition>
    <!-- 消息输入框结束 -->

    <!-- 视频中的悬浮按钮开始 -->
    <div class="iconfont icon-home home-button com-flex-center" :style="{ top: top + 'rem' }" v-if="isShowHome" @click="goHome"></div>
    <div class="live-state com-flex-center" :style="{ top: top + 'rem' }"><img v-lazy="'http://xmt.soukong.cn/newmedia/pages/mobile/MicroWebsite/livebroadcast/img/play.gif'" />{{ $store.state.isStart ? ($store.state.isLive ? '直播中' : '回看') : '未开始' }}</div>
    <div class="iconfont icon-chakan looked com-flex-center" :style="{ top: top + 1 + 'rem' }">{{ watched }}人</div>
    <!-- 视频中的悬浮按钮结束 -->

    <!-- 产品提交订单开始 -->
    <transition
      enter-active-class="animated slideInUp faster"
      leave-active-class="animated slideOutDown faster">
      <div class="product-order">
        <ProductOrder class="product-order-com" v-show="isShowProductOrder" @on-close="isShowProductOrder = false"></ProductOrder>
      </div>
    </transition>
    <!-- 产品提交订单结束 -->
  </div>
</template>

<script>
import VideoVertical from '@/components/VideoVertical'
import InteractionList from '@/components/InteractionList'
import MessageInputBar from '@/components/MessageInputBar'
import ProductOrder from '@/components/ProductOrder'
import SuspensionButton from '@/components/SuspensionButton'
import OrderListItem from '@/components/OrderListItem'
import SuspensionTabs from '@/components/SuspensionTabs'
import methods from '@/common/home.js'

let isFirstTapInput // 是否是第一次点击底部输入框
let fontSize = 37.5 // html元素font-size属性

export default {
  name: 'Home2',
  created() {
    methods.init(this);
    isFirstTapInput = true;
  },
  mounted() {
    let that = this;
    fontSize = parseInt(this.$('html').css('font-size').replace('px', ''));
    let lastBodyResize = window.innerHeight // 最后一次窗口高度改变的值
    window.onresize = function () { // 解决安卓键盘手动隐藏的问题。ios不会生效
      console.log(lastBodyResize);
      if (lastBodyResize < 500) {
        that.$store.commit('setInteractionInputing', false)
      }
      console.log('input', window.innerHeight - lastBodyResize);
      // that.$data.inputButtom = Math.abs(window.innerHeight - lastBodyResize) + 'px'
      that.$data.inputButtom = 0
      lastBodyResize = window.innerHeight;
    }

    if (this.$utils.driverType() == 1) { // 兼容ios键盘输入
      that.$data.inputButtom = 0;
      document.body.addEventListener('focusin', () => {
          //软键盘弹出的事件处理
          // that.$('body').scrollTop(0)
      })
      document.body.addEventListener('focusout', () => {
           //软键盘收起的事件处理
           that.$('body').scrollTop(0)
       })
    }
    if (this.hasOrderList) { //成交栏相关bug修复
      setTimeout(() => {
        this.$('.scroll-pull-container').css({
          'line-height': '60px',
          'color': '#999'
        })
        that.itemIndex = 0;
      }, 700)
    }
  },
  data () {
    return {
      itemIndex: 1, //tab栏索引，切换tabItem
      tabItems: [ //tab栏列表项数据
        // { id: 0, typeId: '1', text: '互动' },
        // { id: 1, typeId: '3', text: '详情' },
        // { id: 2, typeId: '5', text: '成交' },
        // { id: 3, typeId: '2', text: '简介' },
        // { id: 4, typeId: '10', text: '自定义' },
      ],
      swiperHeight: '', //swiper高度
      adBar: { id: '', showAdBar: false, content: ''},
      summaryContent: '', //tab栏简介内容
      customContent1: '', //tab栏自定义1内容
      customContent2: '', //tab栏自定义2内容
      customContent3: '', //tab栏自定义3内容
      inputWord: "来说几句", //输入框占位符
      inputWidth: "5rem", //输入框宽度
      interactionList: [ //互动列表数据
        // { id: 0, title: '标题啊标题啊0', time: '1小时', message: '这是一条消息这是一条消息这是一条消息', isMaster: false, icon: 'http://img2.imgtn.bdimg.com/it/u=3197537752,2095789724&fm=26&gp=0.jpg', image: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1544776923060&di=31b3a9fd116050fa5baf6dfbe7231233&imgtype=0&src=http%3A%2F%2Fh.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2Ff2deb48f8c5494eec7036a5f20f5e0fe99257e56.jpg' },
        // { id: 1, title: '标题啊标题啊0', time: '1小时', message: '这是一条消息这是一条消息这是一条消息', isMaster: false, icon: 'http://img2.imgtn.bdimg.com/it/u=3197537752,2095789724&fm=26&gp=0.jpg', image: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1544776923060&di=31b3a9fd116050fa5baf6dfbe7231233&imgtype=0&src=http%3A%2F%2Fh.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2Ff2deb48f8c5494eec7036a5f20f5e0fe99257e56.jpg' }
      ],
      pulldownConfig: { //Scroll组件上拉配置
        downContent: '下拉加载',
        upContent: '释放刷新',
        loadingContent: '加载中...',
        clsPrefix: 'scroll-pull-'
      },
      isShowProductOrder: false, //是否展示产品提交订单组件
      isShowBuyButton: true, //是否显示立即购买按钮
      isShowSheet: false,
      isShowSuspension: true, //是否展示悬浮按钮
      sheetMenus: {
        menu1: '分享二维码',
        menu2: '分享链接',
      },
      orderList: [],
      watched: '',
      hasOrderList: true, // 是否有成交记录，没有则为false，即不显示成交栏目中的scoller
      isShowHome: false, //是否显示返回首页按钮
      hasInteraction: false, //是否有互动栏
      inputButtom: (200 / fontSize) + 'rem',
      top: 10 / fontSize //距离页面顶部的距离
    }
  },
  components: {
    VideoVertical,
    InteractionList,
    MessageInputBar,
    ProductOrder,
    SuspensionButton,
    OrderListItem,
    SuspensionTabs
  },
  methods: {
    switchTabBody(index) {
      console.log(index);
    },

    x5EnterFullscreen() { //安卓机进入x5同层播放触发事件函数
      // methods.setSwiperHeight('7.33rem', '8.53rem');
      this.top = 60 / fontSize
    },

    x5ExitFullscreen() { //安卓机退出x5同层播放触发事件函数
      // methods.setSwiperHeight('6.78rem', '7.98rem');
      this.top = 10 / fontSize
    },

    onClickBuyButton() { //购买按钮点击事件
      let that = this;
      this.isShowProductOrder = true;
      let parameter = {
        openId: that.$store.state.openId,
        // cmpyId: that.$store.state.cmpyId
      }
      this.$axios.get(this.$store.state.host + this.$store.state.path + '/newmedia/mobile/wechatAccount/getSoukongAccountIdByOpenId.action', { params: parameter }).then(res => {
        console.log('判断是否注册', res.data);
        if (res.data.soukongAccountId == 'null') { //没有注册
          that.$router.push('register')
        }
      })
    },

    async loadingHistoryInteraction() { //下拉更新历史记录事件函数
      let that = this;
      await methods.getInteractionHistoryList({
        curMinId: that.$store.state.minInteractionId,
        rows: 20,
        liveId: that.$store.state.liveTitleId
      });
      this.$nextTick(() => {
        this.$refs.scrollerEvent.donePulldown(); //下拉刷新数据请求成功后需调用此函数刷新界面
      })
    },

    onInputClick() { //输入框点击事件
      let that = this;

      if (isFirstTapInput) {
        that.$axios.get(that.$store.state.host + that.$store.state.path + '/newmedia/mobile/wechatuserinfo/getWchatInfoByOpenId.action', { params: { openId: that.$store.state.openId } }).then(res => {
          console.log('获取用户信息', res.data);
          isFirstTapInput = false;
          if(res.data.data.isSilent == 1) {
  					// var search = encodeURIComponent(window.location.href.split('#')[0]);
            var search = encodeURIComponent(window.location.href);
  					window.location.href = that.$store.state.relHost + '/wechatservice/sns/sookingBaseAuthorize.action'+"?returnUrl="+search +"&cmpyId="+that.$store.state.cmpyId;
  				}
        })
      }

      if (this.$store.state.interactionTime == 0) { //interactionTime为0则表示可以发送消息
        this.$store.commit('switchInteractionInputing');
      } else {
        this.$vux.toast.show({
          text: '休息一下，还差' + (10 - that.$store.state.interactionTime) + 's',
          type: 'text'
        })
      }
    },

    messageInputEnter() { //消息输入框进入动画开始事件
      this.$refs.messageBar.$refs.inputEvent.focus()
    },

    onSheet(menuKey) { //分享按钮弹出框选择触发事件
      let that = this;
      switch(menuKey) {
        case 'menu1':

          break;
        case 'menu2':
          console.log('分享');
          that.$wx.updateAppMessageShareData({
            title: '111', // 分享标题
            desc: '222', // 分享描述
            link: that.$store.state.host+'/wechatservice/sns/sookingBaseSimpleAuthorize.action?returnUrl='+encodeURIComponent(window.location.href)+'&cmpyId='+that.$store.state.cmpyId, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: '', // 分享图标
            success: function () {
              that.$axios.post(that.$store.state.host + that.$store.state.path +'/newmedia/app/appTenologymarketingRecaordLog/pageRecodeShare.action',that.$qs.stringify({
                'objectId': '1'
              }))
              that.$vux.toast.show({
                text: '分享成功',
              })
            },
            cancel: function () {
              that.$vux.toast.show({
                text: '分享失败',
              })
            }
          })
          break;
      }
    },

    goHome() { //首页按钮事件
      this.$axios.get(this.$store.state.host + this.$store.state.path + '/newmedia/wechatTemplateCompany/findTemplateByCmpyId.action?', { params: { cmpyId: this.$store.state.cmpyId } }).then(res => {
        console.log('主页路径名', res.data);
        window.location.href = this.$store.state.relHost + "/newmedia/pages/mobile/MicroWebsite/"+ res.data.row.templateCode +"/WebsiteIframe.html?cmpyId="+ this.$store.state.cmpyId +"&openId=" + this.$store.state.openId
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import '@/assets/style/common.scss';

  .ad-bar {
    width: 100%;
    height: 45px;
  }
  .ad-bar img {
    width: 100%;
    height: calc(100% + 2px);
  }
  .tab {
    margin-bottom: 6px;
  }
  .bottom-bar {
    width: 100%;
    height: 46px;
    padding: 6px 2px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    position: absolute;
    bottom: 0;
  }
  .input {
    font-size: 15px;
    color: $--color-333;
    padding: 6px 10px;
  }
  .input span {
    padding: 4px 8px;
    background-color: rgba(0, 0, 0, 0.35);
    border-radius: 50px;
    line-height: 25px;
    color: white;
    font-weight: 100;
  }
  .buy-button {
    background-color: $--main-color;
    border-radius: 50px;
    padding: 8px 30px;
    color: white;
    font-size: 15px;
    margin-right: 10px;
  }
  .bottom-bar-right {
    width: 120px;
    height: 100%;
    color: $--color-666;
  }
  .bottom-bar-right div {
    margin-bottom: 4px;
  }
  .bottom-bar-right span {
    font-size: 11px;
  }
  .swiper-content {
    height: 100%;
    background-color: $--color-F5;
  }
  .pull-up-tips {
    display: none;
  }
  .message-input {
    position: absolute;
    bottom: 256px;
    width: 100%;
    background-color: white;
  }
  .home-button {
    width: 32px;
    height: 32px;
    background-color: rgba(255, 255, 255, 0.5);
    color: $--main-color;
    position: absolute;
    left: 10px;
    border-radius: 50%;
    font-size: 18px;
  }
  .live-state {
    width: 70px;
    height: 23px;
    color: white;
    border-radius: 20px;
    border: 1px solid white;
    background-color: #F80114;
    position: absolute;
    right: 10px;
  }
  .live-state img {
    width: 10px;
    height: 10px;
    margin-right: 5px;
  }
  .looked {
    padding: 4px 7px;
    color: white;
    border-radius: 20px;
    border: 1px solid white;
    font-size: 12px;
    display: inline;
    position: absolute;
    right: 10px;
    background-color: rgba(0, 0, 0, 0.3)
  }
  .product-order {
    position: absolute;
    width: 100%;
    bottom: -424px;
  }
  .suspension {
    position: absolute;
    bottom: 80px;
    right: 6px;
  }
  .interaction {
    width: 200px;
    height: 200px;
    position: absolute;
    bottom: 50px;
    left: 10px;
  }
  .interaction-item {
    background-color: rgba(0, 0, 0, 0.4);
    padding: 2px;
    border-radius: 50px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 6px;
    width: fit-content;
  }
  .interaction-item img {
    width: 30px;
    height: 30px;
    border-radius: 20px;
  }
  .interaction-item span {
    font-size: 12px;
    color: white;
    padding: 0 10px;
    max-width: 146px;
  }
  .interaction-badge {
    position: absolute;
  }
  .interaction-badge:before {
    content: "主播";
    position: relative;
    font-size: 9px;
    color: #ED7E00;
    bottom: 10px;
    left: 17px;
  }
</style>
