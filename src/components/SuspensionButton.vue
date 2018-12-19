<template>
  <div class="root">
    <img class="red-envelopes" v-lazy="redImg" />

    <transition
      enter-active-class="animated slideInUp faster"
      leave-active-class="animated slideOutDown faster">
    <img class="button margin-top" v-show="isShowSub" @click="onLive" v-lazy="liveImg"/>
    </transition>

    <transition
      enter-active-class="animated slideInUp faster"
      leave-active-class="animated slideOutDown faster">
      <img class="button margin-top" v-show="isShowSub" @click="onPersonal" v-lazy="personalImg"/>
    </transition>

    <transition
      enter-active-class="animated slideInUp faster"
      leave-active-class="animated slideOutDown faster">
      <img class="button margin-top" v-show="isShowSub" @click="onFollow" v-lazy="followImg"/>
    </transition>

    <transition
      enter-active-class="animated slideInUp faster"
      leave-active-class="animated slideOutDown faster">
      <img class="button margin-top" v-show="isShowSub" @click="onPhone" v-lazy="phoneImg"/>
    </transition>

    <div class="button margin-top com-flex-center iconfont icon-jiantou" :style="{ transform: 'rotate(' + rotate + ')' }" @click="onButtonTap"></div>

    <XDialog v-model="showDialog" hide-on-blur>
      <Qrcode style="margin-top: 0.8rem" value="https://vux.li?x-page=demo_qrcode" type="img"></Qrcode>
      <p class="tip">长按关注公众号，了解更多信息。</p>
    </XDialog>

    <Popup v-model="showPopup">
      <div class="popup-head">
        <div class="iconfont icon-plus-close"></div>
      </div>
      <p class="popup-title">申请信息</p>
      <div class="popup-input com-flex-center">
        <input />
      </div>
    </Popup>
  </div>
</template>

<script>
export default {
  data() {
    return {
      redImg: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3381298564,3536276465&fm=26&gp=0.jpg',
      liveImg: '',
      personalImg: '',
      followImg: '',
      phoneImg: '',
      isShowSub: false,
      rotate: '0deg',
      showDialog: false,
      showPopup: false,
    }
  },
  methods: {
    onButtonTap() {
      console.log('666');
      this.isShowSub = !this.isShowSub;
      this.rotate = this.rotate == '0deg' ? '180deg' : '0deg';
    },
    onLive() { //直播按钮
      this.showPopup = !this.showPopup;
    },
    onPersonal() { //个人按钮

    },
    onFollow() { //关注按钮
      this.showDialog = !this.showDialog;
    },
    onPhone() { //电话按钮

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
  background-color: $--main-color;
  border-radius: 100%;
  font-size: 26px;
  color: white;
}
.root {
  position: absolute;
  bottom: 80px;
  right: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}
.red-envelopes {
  width: 35px;
  height: 42px;
}
.rotate-180 {
  transform: rotate(180deg);
}
.tip {
  color: $--color-333;
  font-size: 16px;
}
.popup-head {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 12px 12px 0 12px;
}
.popup-head>div {
  font-size: 24px;
}
.popup-title {
  font-size: 21px;
  color: $--color-333;
  text-align: center;
}
.popup-input {
  width: 300px;
  height: 44px;
  background: #F7F5F6;
  border-radius: 22px;
}
.popup-input input {
  width: 220px;
  height: 30px;
  border: 0;
  background: #F7F5F6;
  font-size: 14px;
}
</style>
