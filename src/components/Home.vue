<template>
  <div>
    <Video :title="$store.state.title" @x5-enter-fullscreen="x5EnterFullscreen" @x5-exit-fullscreen="x5ExitFullscreen">
      <!-- 广告条开始 -->
      <div class="ad-bar" v-if="adBar.showAdBar">
        <img v-lazy="adBar.content" />
      </div>
      <!-- 广告条结束 -->

      <!-- tab栏开始 -->
      <Tab :line-width=2 active-color='#ED7E00' v-model="itemIndex">
        <TabItem :selected="itemIndex === item.id" v-for="(item, index) in tabItems" @click="itemIndex = item.id" :key="item.id">{{item.text}}</TabItem>
      </Tab>
      <!-- tab栏结束 -->

      <!-- tab内容开始 -->
      <Swiper v-model="itemIndex" :min-moving-distance="80" :style="{height: swiperHeight}" :show-dots="false">
        <SwiperItem v-for="(item, index) in tabItems" :key="item.id">
          <div class="swiper-content">
            <template v-if="item.typeId == 1"> <!-- 互动 -->
              <Scroller
                lock-x
                height="100%"
                ref="scrollerEvent"
                use-pulldown
                :pulldown-config="pulldownConfig"
                @on-pulldown-loading="loadingHistoryInteraction">
                <div>
                  <InteractionList
                    v-for="item in interactionList"
                    :key="item.id"
                    :title="item.title"
                    :time="item.time"
                    :message="item.message"
                    :icon="item.icon"
                    :image="item.image"
                    :isMaster="item.isMaster"></InteractionList>
                </div>
              </Scroller>
            </template>
            <template v-else-if="item.typeId == 5 && hasOrderList"> <!-- 成交 -->
              <Scroller
                lock-x
                height="100%"
                ref="scrollerEvent2"
                use-pulldown
                :pulldown-config="pulldownConfig"
                use-pullup
                :pullup-config="pullupConfig"
                @on-pulldown-loading="refreshOrder"
                @on-pullup-loading="loadingMoreOrder">
                <div>
                  <OrderListItem
                    v-for="(item, index) in orderList"
                    :key="index"
                    :src="item.src"
                    :nickName="item.nickName"
                    :time="item.time"
                    :count="item.count"
                    :money="item.money">
                  </OrderListItem>
                </div>
              </Scroller>
            </template>
            <template v-else="">
              <template v-if="item.typeId == 3"> <!-- 产品/详情 -->
                <Scroller
                  lock-x
                  height="100%">
                  <div v-html='$store.state.productDetail'>详情</div>
                </Scroller>
              </template>
              <template v-if="item.typeId == 2"> <!-- 简介 -->
                <Scroller
                  lock-x
                  height="100%">
                  <div class="tap-content" v-html='summaryContent'>简介</div>
                </Scroller>
              </template>
              <template v-if="item.typeId == 10"> <!-- 自定义 -->
                <Scroller
                  lock-x
                  height="100%">
                  <div v-html='customContent1'>自定义1</div>
                </Scroller>
              </template>
              <template v-if="item.typeId == 11">
                <Scroller
                  lock-x
                  height="100%">
                  <div v-html='customContent2'>自定义2</div>
                </Scroller>
              </template>
              <template v-if="item.typeId == 12">
                <Scroller
                  lock-x
                  height="100%">
                  <div v-html='customContent3'>自定义3</div>
                </Scroller>
              </template>
            </template>
            <LoadMore
              v-if="!hasOrderList"
              :show-loading="false"
              tip="暂无数据"
              background-color="#fbf9fe">
            </LoadMore>
          </div>
        </SwiperItem>
      </Swiper>
      <!-- tab内容结束 -->

      <!-- 底部菜单开始 -->
      <div class="bottom-bar" v-if="hasInteraction || isShowBuyButton">
        <div class="input" v-if="hasInteraction">
          <span class="com-over-length" :style="{width: inputWidth}" @click="onInputClick">
            {{ inputWord }}
          </span>
        </div>
        <XButton action-type="button" :gradients="['#ED7E00', '#ED7E00']" v-if="isShowBuyButton"  @click.native="onClickBuyButton">立即购买</XButton>
        <!-- <div class="com-icon-button bottom-bar-right" @click="isShowSheet = true">
          <div class="iconfont icon-fenxiang"></div>
          <span>分享</span>
        </div> -->
        <!-- <Actionsheet v-model="isShowSheet" :menus="sheetMenus" @on-click-menu="onSheet"></Actionsheet> -->
      </div>
      <!-- 底部菜单结束 -->

      <!-- 消息输入框开始 -->
      <transition
        enter-active-class="animated slideInUp faster"
        leave-active-class="animated slideOutDown faster"
        @enter="messageInputEnter">
        <div class="message-input" v-show="$store.state.isInteractionInputing">
          <MessageInputBar ref="messageBar"></MessageInputBar>
        </div>
      </transition>
      <!-- 消息输入框结束 -->

      <!-- 悬浮按钮开始 -->
      <SuspensionButton></SuspensionButton>
      <!-- 悬浮按钮结束 -->

      <!-- 产品提交订单开始 -->
      <transition
        enter-active-class="animated slideInUp faster"
        leave-active-class="animated slideOutDown faster">
        <ProductOrder v-show="isShowProductOrder" @on-close="isShowProductOrder = false"></ProductOrder>
      </transition>
      <!-- 产品提交订单结束 -->

      <!-- 视频中的悬浮按钮开始 -->
      <div class="iconfont icon-home home-button com-flex-center" v-if="isShowHome" @click="goHome"></div>
      <div class="live-state com-flex-center"><img v-lazy="'http://xmt.soukong.cn/newmedia/pages/mobile/MicroWebsite/livebroadcast/img/play.gif'" />{{ $store.state.isStart ? ($store.state.isLive ? '直播中' : '回看') : '未开始' }}</div>
      <div class="iconfont icon-chakan looked com-flex-center">{{ watched }}人</div>
      <!-- 视频中的悬浮按钮结束 -->

    </Video>
  </div>
</template>

<script>
import Video from '@/components/Video'
import InteractionList from '@/components/InteractionList'
import MessageInputBar from '@/components/MessageInputBar'
import ProductOrder from '@/components/ProductOrder'
import SuspensionButton from '@/components/SuspensionButton'
import OrderListItem from '@/components/OrderListItem'
import methods from '@/common/home.js'

let isFirstTapInput // 是否是第一次点击底部输入框

export default {
  name: 'Home',
  created() {
    methods.init(this);
    isFirstTapInput = true;
  },
  mounted() {
    let that = this;
    let lastBodyResize = document.body.clientHeight // 最后一次窗口高度改变的值
    window.onresize = function () { // 解决安卓键盘手动隐藏的问题。ios不会生效
      console.log(lastBodyResize);
      if (lastBodyResize < 500) {
        that.$store.commit('setInteractionInputing', false)
      }
      lastBodyResize = document.body.clientHeight;
    }
  },
  data () {
    return {
      itemIndex: 0, //tab栏索引，切换tabItem
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
      inputWord: "请输入内容", //输入框占位符
      inputWidth: "2.5rem", //输入框宽度
      interactionList: [ //互动列表数据
        // { id: 0, title: '标题啊标题啊0', time: '1小时', message: '这是一条消息这是一条消息这是一条消息', isMaster: false, icon: 'http://img2.imgtn.bdimg.com/it/u=3197537752,2095789724&fm=26&gp=0.jpg', image: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1544776923060&di=31b3a9fd116050fa5baf6dfbe7231233&imgtype=0&src=http%3A%2F%2Fh.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2Ff2deb48f8c5494eec7036a5f20f5e0fe99257e56.jpg' },
        // { id: 1, title: '标题啊标题啊0', time: '1小时', message: '这是一条消息这是一条消息这是一条消息', isMaster: false, icon: 'http://img2.imgtn.bdimg.com/it/u=3197537752,2095789724&fm=26&gp=0.jpg', image: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1544776923060&di=31b3a9fd116050fa5baf6dfbe7231233&imgtype=0&src=http%3A%2F%2Fh.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2Ff2deb48f8c5494eec7036a5f20f5e0fe99257e56.jpg' }
      ],
      pullupConfig: { //Scroll组件上拉配置
        content: '上拉加载',
        downContent: '释放刷新',
        upContent: '上拉加载',
        loadingContent: '加载中...',
      },
      pulldownConfig: { //Scroll组件上拉配置
        downContent: '下拉加载',
        upContent: '释放刷新',
        loadingContent: '加载中...',
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
    }
  },
  components: {
    Video,
    InteractionList,
    MessageInputBar,
    ProductOrder,
    SuspensionButton,
    OrderListItem
  },
  methods: {
    switchTabBody(index) {
      console.log(index);
    },

    setContentHeight() { //设置中间内容组件高度
      if (!(this.hasInteraction || this.isShowBuyButton)) {
        // setSwiperHeight('8.01rem', '9.21rem');
        methods.setSwiperHeight('calc(100% - 1.92rem)', 'calc(100% - 0.72rem)');
      } else {
        // setSwiperHeight('6.78rem', '7.98rem');
        methods.setSwiperHeight('calc(100% - 3.65rem)', 'calc(100% - 2.45rem)');
      }
    },

    x5EnterFullscreen() { //安卓机进入x5同层播放触发事件函数
      // methods.setSwiperHeight('7.33rem', '8.53rem');
      this.setContentHeight()
    },

    x5ExitFullscreen() { //安卓机退出x5同层播放触发事件函数
      // methods.setSwiperHeight('6.78rem', '7.98rem');
      this.setContentHeight()
    },

    onClickBuyButton() {
      this.isShowProductOrder = true;
    },

    async loadingHistoryInteraction() { //下拉更新历史记录事件函数
      let that = this;
      await methods.getInteractionHistoryList({
        curMinId: that.$store.state.minInteractionId,
        rows: 20,
        liveId: that.$store.state.liveTitleId
      });
      this.$nextTick(() => {
        this.$refs.scrollerEvent[0].donePulldown(); //下拉刷新数据请求成功后需调用此函数刷新界面
      })
    },

    onInputClick() { //输入框点击事件
      let that = this;

      if (isFirstTapInput) {
        that.$axios.get(that.$store.state.host + that.$store.state.path + '/newmedia/mobile/wechatuserinfo/getWchatInfoByOpenId.action', { params: { openId: that.$store.state.openId } }).then(res => {
          console.log('获取用户信息', res.data);
          isFirstTapInput = false;
          if(res.data.isSilent == 1) {
  					var search = encodeURIComponent(window.location.href.split('#')[0]);
            var search = encodeURIComponent(window.location.href);
  					window.location.href = 'http://xmt.soukong.cn/wechatservice/sns/sookingBaseAuthorize.action'+"?returnUrl="+search +"&cmpyId="+that.$store.state.cmpyId;
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

    async refreshOrder() { //刷新订单列表
      let that = this;
      await methods.refreshOrder({
        autoObjectId: that.$store.state.liveTitleId,
        page: that.$store.state.orderPage,
        rows: 10
      }, true);
      this.$nextTick(() => {
        console.log(this.$refs.scrollerEvent2[0]);
        this.$refs.scrollerEvent2[0].donePulldown(); //下拉刷新数据请求成功后需调用此函数刷新界面
      })
    },

    async loadingMoreOrder() { //加载更多订单列表
      let that = this;
      that.$store.commit('addOrderPage');
      await methods.refreshOrder({
        autoObjectId: that.$store.state.liveTitleId,
        page: that.$store.state.orderPage,
        rows: 10
      }, false);
      this.$nextTick(() => {
        this.$refs.scrollerEvent2[0].donePullup(); //上拉刷新数据请求成功后需调用此函数刷新界面
      })
    },

    goHome() { //首页按钮事件
      window.location.href = this.$store.state.relHost + "/newmedia/pages/mobile/MicroWebsite/Skinfirst/WebsiteIframe.html?cmpyId="+ this.$store.state.cmpyId +"&openId=" + this.$store.state.openId
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
  .bottom-bar {
    width: 100%;
    height: 46px;
    padding: 6px 2px;
    background-color: white;
    border-top: 1px solid $--color-E9;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
  }
  .input {
    font-size: 15px;
    color: $--color-333;
    padding: 6px 10px;
  }
  .input span {
    padding: 4px 8px;
    border: 1px solid $--color-E9;
    border-radius: 10px;
    line-height: 19px;
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
    top: 0px;
    width: 100%;
  }
  .home-button {
    width: 32px;
    height: 32px;
    background-color: rgba(255, 255, 255, 0.5);
    color: $--main-color;
    position: absolute;
    top: -190px;
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
    top: -190px;
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
    top: -62px;
    right: 10px;
    background-color: rgba(0, 0, 0, 0.3)
  }
</style>
