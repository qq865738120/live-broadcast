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
      <a class="button margin-top phone-button" :href="'tel:' + $store.state.telephone" v-show="isShowSub" @click="onPhone"></a>
    </transition>

    <div class="button base-botton margin-top com-flex-center iconfont icon-jiantou" :style="{ transform: 'rotate(' + rotate + ')' }" @click="onButtonTap"></div>

    <XDialog v-model="showDialog" hide-on-blur>
      <Qrcode style="margin-top: 0.8rem" :value="qCode" type="img"></Qrcode>
      <p class="tip">长按关注公众号，了解更多信息。</p>
    </XDialog>

    <Popup v-model="showPopup">
      <div class="popup-head">
        <div class="iconfont icon-plus-close" @click="showPopup = !showPopup"></div>
      </div>
      <p class="popup-title">申请信息</p>
      <div class="popup-input com-flex-center iconfont icon-yonghu">
        <input v-model="name" placeholder="输入您的姓名" />
      </div>
      <div class="popup-input last-popup-input com-flex-center iconfont icon-dianhua">
        <input v-model="phone" placeholder="输入您的手机号" />
      </div>
      <div class="submitButton com-flex-center" @click="submit">提交</div>
    </Popup>

  </div>
</template>

<script>
export default {
  mounted() {
    let that = this;
    this.$axios.get('/api/newmedia/mobile/wechatAccount/getCmpyWechatQecode.action', { params: { cmpyId: that.$store.state.cmpyId } }).then(res => {
      console.log('获取企业二维码', res.data);
      if (res.data.status == '100') {
        that.qCode = res.data.data.qrcode;
      }
    })
  },
  data() {
    return {
      redImg: 'http://q.img.soukong.cn/hongbao.gif',
      liveImg: 'http://q.img.soukong.cn/afg.png',
      personalImg: 'http://q.img.soukong.cn/af.png',
      followImg: 'http://q.img.soukong.cn/saoyisao.png',
      qCode: '',
      isShowSub: false,
      rotate: '0deg',
      showDialog: false,
      showPopup: false,
      name: '',
      phone: ''
    }
  },
  methods: {
    onButtonTap() {
      this.isShowSub = !this.isShowSub;
      this.rotate = this.rotate == '0deg' ? '180deg' : '0deg';
    },
    onLive() { //直播按钮
      this.showPopup = !this.showPopup;
    },
    onPersonal() { //个人按钮
      let that = this;
      let returnUrl = escape(`http://xmt.soukong.cn/newmedia/pages/mobile/MicroWebsite/PersonalCenter/personelIndex.html?cmpyId=${that.$store.state.cmpyId}`)
      let redirectUri = escape(`http://xmt.soukong.cn/wechatservice/sns/sookingBaseSimpleAuthorize.action?returnUrl=${returnUrl}&cmpyId=${that.$store.state.cmpyId}`)
      let url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${that.$store.state.appid}&scope=snsapi_base&redirect_uri=${redirectUri}`
      console.log(url);
      window.location.href = url;
    },
    onFollow() { //关注按钮
      this.showDialog = !this.showDialog;
    },
    onPhone() { //电话按钮

    },
    submit() { //提交申请信息
      let that = this;
      if (this.name != "" && this.phone != "") {
        const data = {
          userName: that.name,
          phone: that.phone,
          liveTitelId: that.$store.state.liveTitleId
        }
        this.$axios.get('/api/newmedia/mobile/live/addApplyInfo.action', { params: data }).then((res) => {
          console.log('提交申请直播', res.data);
          if (res.data.status == '100') {
            this.$vux.toast.show({
              text: res.data.msg
            })
          } else {
            this.$vux.toast.show({
              text: res.data.msg,
              type: 'cancel'
            })
          }
          that.showPopup = false;
        })
      } else {
        this.$vux.toast.show({
          text: '请填写完整',
          type: 'text'
        })
      }
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
.base-botton {
  background-color: $--main-color;
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
  margin: 20px auto;
  color: $--color-ccc;
  font-size: 20px;
}
.popup-input>input {
  width: 220px;
  height: 30px;
  border: 0;
  background: #F7F5F6;
  font-size: 14px;
  color: $--color-333;
  padding-left: 10px;
}
.last-popup-input {
  margin-bottom: 30px;
}
.phone-button {
  background-image: url(http://q.img.soukong.cn/fgsf.png);
  background-size: 100%;
}
.submitButton {
  width: 100%;
  height: 50px;
  color: white;
  background-color: $--main-color;
  font-size: 18px;
}
</style>
