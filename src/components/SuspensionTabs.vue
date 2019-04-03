<template>
  <div class="root">

    <transition
      enter-active-class="animated slideInUp faster"
      leave-active-class="animated slideOutDown faster">
      <div class="button sub-button margin-top" v-if="isIntroduction" v-show="$store.state.isShowSub2" @click="onIntroduction">
        <span>简介</span>
      </div>
    </transition>

    <transition
      enter-active-class="animated slideInUp faster"
      leave-active-class="animated slideOutDown faster">
      <div class="button sub-button margin-top" v-if="isDetail" v-show="$store.state.isShowSub2" @click="onDetail">
        <span>详情</span>
      </div>
    </transition>

    <transition
      enter-active-class="animated slideInUp faster"
      leave-active-class="animated slideOutDown faster">
      <div class="button sub-button margin-top" v-if="isProduct" v-show="$store.state.isShowSub2" @click="onOrder">
        <span>成交</span>
      </div>
    </transition>

    <transition
      enter-active-class="animated slideInUp faster"
      leave-active-class="animated slideOutDown faster">
      <div class="button sub-button margin-top" v-if="isCus1" v-show="$store.state.isShowSub2" @click="onCus1">
        <span class="com-over-length-2">{{ isCus1Text }}</span>
      </div>
    </transition>

    <transition
      enter-active-class="animated slideInUp faster"
      leave-active-class="animated slideOutDown faster">
      <div class="button sub-button margin-top com-over-length-2" v-if="isCus2" v-show="$store.state.isShowSub2" @click="onCus2">
        <span class="com-over-length-2">{{ isCus2Text }}</span>
      </div>
    </transition>

    <transition
      enter-active-class="animated slideInUp faster"
      leave-active-class="animated slideOutDown faster">
      <div class="button sub-button margin-top com-over-length-2" v-if="isCus3" v-show="$store.state.isShowSub2" @click="onCus3">
        <span class="com-over-length-2">{{ isCus3Text }}</span>
      </div>
    </transition>

    <div class="button base-botton margin-top com-flex-center iconfont icon-chanpin" v-if="isIntroduction || isDetail || isProduct | isCus1 || isCus2 || isCus3" @click="onButtonTap"></div>

    <Popup v-model="showPopup" :show-mask="false" :is-transparent="true">
      <div class="popup">
        <div class="popup-head"><span class="iconfont icon-plus-close colse-icon" @click="onClose"></span></div>

        <div v-show="showIntroduction" style="height: 100%">
          <Scroller
            lock-x
            height="100%">
            <div v-html='introduction'>简介</div>
          </Scroller>
        </div>

        <div v-show="showDetail" style="height: 100%">
          <Scroller
            lock-x
            height="100%">
            <div v-html='$store.state.productDetail'>详情</div>
          </Scroller>
        </div>

        <div v-show="showOrderList && hasOrderList" style="height: 100%">
          <Scroller
            lock-x
            height="100%"
            ref="scrollerEvent3"
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
        </div>

        <div v-show="showCus1" style="height: 100%">
          <Scroller
            lock-x
            height="100%">
            <div v-html='cus1'>自定义1</div>
          </Scroller>
        </div>

        <div v-show="showCus2" style="height: 100%">
          <Scroller
            lock-x
            height="100%">
            <div v-html='cus2'>自定义2</div>
          </Scroller>
        </div>

        <div v-show="showCus3" style="height: 100%">
          <Scroller
            lock-x
            height="100%">
            <div v-html='cus3'>自定义3</div>
          </Scroller>
        </div>

        <LoadMore
          class="load-more"
          v-show="showOrderList && !hasOrderList"
          :show-loading="false"
          tip="暂无数据"
          background-color="#fbf9fe">
        </LoadMore>
      </div>
    </Popup>

  </div>
</template>

<script>
import OrderListItem from '@/components/OrderListItem'
import methods from '@/common/home.js'

export default {
  components: {
    OrderListItem
  },
  async mounted() {
    let that = this;
    await this.$utils.waitTask(this, 'initFag')
    let tabProp = this.$store.state.tabProp
    for (let item of tabProp) {
      if (item.switchType == 2) { //简介
        this.isIntroduction = item.switchStatus == 1 ? true : false;
      } else if (item.switchType == 5) { //成交
        this.isProduct = item.switchStatus == 1 ? true : false;
      } else if (item.switchType == 3) { //详情
        this.isDetail = item.switchStatus == 1 ? true : false;
      } else if (item.switchType == 10) { // 自定义
        this.isCus1 = item.switchStatus == 1 ? true : false;
        this.isCus1Text = item.switchName
      } else if (item.switchType == 11) {// 自定义
        this.isCus2 = item.switchStatus == 1 ? true : false;
        this.isCus2Text = item.switchName
      } else if (item.switchType == 12) {// 自定义
        this.isCus3 = item.switchStatus == 1 ? true : false;
        this.isCus3Text = item.switchName
      }
    }

    if (this.hasOrderList) { //成交栏相关bug修复
      setTimeout(() => {
        this.$('.scroll-pull-container').css({
          'line-height': '60px',
          'color': 'white'
        })
        that.itemIndex = 0;
        this.$('.load-more .weui-loadmore__tips').css({
          'color': 'white'
        })
      }, 1700)
    }

    this.refreshOrder({ //获取成交订单列表
      autoObjectId: this.$store.state.liveTitleId,
      page: this.$store.state.orderPage,
      rows: 10
    }, true);
  },

  props: {
    introduction: String,
    cus1: String,
    cus2: String,
    cus3: String,
  },

  data() {
    return {
      isIntroduction: false,
      showIntroduction: false,
      isDetail: false,
      isProduct: false,
      isCus1: false,
      isCus1Text: '',
      showCus1: false,
      isCus2: false,
      isCus2Text: '',
      showCus2: false,
      isCus3: false,
      isCus3Text: '',
      showCus3: false,
      showPopup: false,
      showDetail: false,
      showOrderList: false,
      orderList: [],
      hasOrderList: true, // 是否有成交记录，没有则为false，即不显示成交栏目中的scoller
      pullupConfig: { //Scroll组件上拉配置
        content: '上拉加载',
        height: 60,
        downContent: '释放刷新',
        upContent: '上拉加载',
        loadingContent: '加载中...',
        clsPrefix: 'scroll-pull-'
      },
      pulldownConfig: { //Scroll组件上拉配置
        downContent: '下拉加载',
        upContent: '释放刷新',
        loadingContent: '加载中...',
        clsPrefix: 'scroll-pull-'
      },
    }
  },

  methods: {

    onButtonTap() {
      this.$store.commit('switchButtonRotate', 'tabs')
      this.$store.commit('onSuspensionSwitch', 'tabs')
    },

    onClose() {
      this.showPopup = false;
      this.showIntroduction = false;
      this.showDetail = false;
      this.showOrderList = false;
      this.showCus1 = false;
      this.showCus2 = false;
      this.showCus3 = false;
    },

    onIntroduction() {
      this.showPopup = true
      this.showIntroduction = true
    },

    onDetail() {
      this.showPopup = true
      this.showDetail = true
    },

    onOrder() {
      this.showPopup = true
      this.showOrderList = true
    },

    onCus1() {
      this.showPopup = true
      this.showCus1 = true
    },

    onCus2() {
      this.showPopup = true
      this.showCus2 = true
    },

    onCus3() {
      this.showPopup = true
      this.showCus3 = true
    },

    async refreshOrder() { //刷新订单列表
      let that = this;
      await this._refreshOrder({
        autoObjectId: that.$store.state.liveTitleId,
        page: that.$store.state.orderPage,
        rows: 10
      }, true);
      this.$nextTick(() => {
        this.$refs.scrollerEvent3.donePulldown(); //下拉刷新数据请求成功后需调用此函数刷新界面
      })
    },

    async loadingMoreOrder() { //加载更多订单列表
      let that = this;
      that.$store.commit('addOrderPage');
      await this._refreshOrder({
        autoObjectId: that.$store.state.liveTitleId,
        page: that.$store.state.orderPage,
        rows: 10
      }, false);
      this.$nextTick(() => {
        this.$refs.scrollerEvent3.donePullup(); //上拉刷新数据请求成功后需调用此函数刷新界面
        this.$refs.scrollerEvent3.reset(0);
        console.log("this.$('.popup .xs-container').css", this.$('.popup .xs-container').css('transform'));
        if (this.orderList.length < 7) {
          this.$('.popup .xs-container').css({
            "transform": "translateX(0px) translateY(0px) translateZ(0px) scale(1, 1)"
          })
        }
      })
    },

    /*
    刷新订单列表
    参数：parameter 接口请求参数
         isReset 是否重置列表中已有信息
    */
    _refreshOrder (parameter, isReset) {
      let that = this
      return new Promise(resolve => {
        that.$axios.get(that.$store.state.host + that.$store.state.path + '/newmedia/mobile/live/getOrderList.action', { params: parameter }).then(res => {
          console.log('获取成交列表', res.data);
          if (res.data.status == 'Y') {
            if (isReset) {
              that.orderList = new Array();
            }
            that.hasOrderList = true;
            for (let item of res.data.rows) {
              that.orderList.push({
                src: !item.headImg ? 'http://q.img.soukong.cn/af.png' : item.headImg,
                nickName: item.userName,
                time: item.createTime,
                count: item.count,
                money: item.amount
              })
            }
          } else if (0 == that.orderList.length) {
            that.hasOrderList = false;
          }
          resolve(res.data);
        })
      })
    }

  }
}

</script>

<style scoped lang="scss">
@import '@/assets/style/common.scss';

.margin-top {
  margin-top: 6px;
}
.button {
  width: 43px;
  height: 43px;
  border-radius: 100%;
  font-size: 26px;
  color: white;
  transition: transform 0.4s;
}
.sub-button {
  width: 40px;
  height: 40px;
  background-color: white;
  color: $--main-color;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e3e3e3;
  box-sizing: border-box;
}
.sub-button span {
  width: 26px;
}
.base-botton {
  background-color: $--main-color;
}
.colse-icon {
  color: white;
  font-size: 20px !important;
}
.root {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}
.continue-button {
  width: 125px;
  height: 40px;
  color: $--color-333;
  background-color: #FFD902;
  border-radius: 20px;
  position: relative;
  bottom: 105px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
}
.popup {
  padding: 15px;
  background-color: rgba(0, 0, 0, 0.6);
  height: 300px;
}
.popup-head {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 12px 12px 12px;
}
</style>
