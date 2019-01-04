<template>
  <div class="root">
    <img class="red-envelopes" v-show="isShowRed" @click="onRed" v-lazy="redImg" />

    <transition
      enter-active-class="animated slideInUp faster"
      leave-active-class="animated slideOutDown faster">
      <img class="button margin-top" v-show="isShowSub" @click="onLive" v-lazy="liveImg"/>
    </transition>

    <transition
      enter-active-class="animated slideInUp faster"
      leave-active-class="animated slideOutDown faster">
      <img class="button margin-top" v-if='isShowPersonal' v-show="isShowSub" @click="onPersonal" v-lazy="personalImg"/>
    </transition>

    <transition
      enter-active-class="animated slideInUp faster"
      leave-active-class="animated slideOutDown faster">
      <img class="button margin-top" v-if='isShowFollow' v-show="isShowSub" @click="onFollow" v-lazy="followImg"/>
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

    <XDialog :dialog-style="{'background-color': 'transparent'}" v-model="showDialogRed" hide-on-blur>
      <div class="red-dialog-div">
        <img class="redImgs" v-show="redImgIndex != 'show' && redImgIndex != 'repeat'" v-lazy="redImgs[redImgIndex]" @click="onOpenRed" />
        <img class="redImgs" v-show="redImgIndex == 'repeat'" v-lazy="redImgs.repeat" />
        <span v-show="redImgIndex != 'show'">{{ redImgIndex == 'fail' ? '很遗憾与红包擦肩而过' : (redImgIndex == 'success' ? '恭喜你获得1个包' : (redImgIndex == 'repeat' ? '您已领过红包啦~' : '')) }}</span>
        <p class="amount" v-show="redImgIndex == 'show'">￥{{ amount }}</p>
        <img class="redImgs" v-show="redImgIndex == 'show'" v-lazy="redImgs.show" />
        <div v-show="redImgIndex == 'show'" class="continue-button" @click="showDialogRed = false">继续观看直播</div>
        <p v-show="redImgIndex == 'show'" class="red-tip">红包已经存入您的微信钱包</p>
      </div>
    </XDialog>

  </div>
</template>

<script>
let timerId = ''
export default {
  async mounted() {
    let that = this;
    this.$axios.get(that.$store.state.host + that.$store.state.path + '/newmedia/mobile/wechatAccount/getCmpyWechatQecode.action', { params: { cmpyId: that.$store.state.cmpyId } }).then(res => {
      console.log('获取企业二维码', res.data);
      if (res.data.status == '100') {
        that.qCode = res.data.data.qrcode;
      }
    })
    timerId = setInterval(() => {
      that.$axios.get(that.$store.state.host + that.$store.state.path + '/newmedia/mobile/live/getRedActivity.action', { params: { liveTitelId: that.$store.state.liveTitleId } }).then((res) => {
        // console.log('获取红包', res.data);
        if (res.data.status == '100') {
           that.isShowRed = res.data.data.exist == 0 ? false : true;
           if (res.data.data.exist != 0) {
             that.$store.commit('setRedActivityId', res.data.data.redActivityId);
           }
        }
      })
    }, 6000)
    await this.$utils.waitTask(this, 'initFag')
    let tabProp = this.$store.state.tabProp
    for (let item of tabProp) {
      if (item.switchType == 8) {
        this.isShowPersonal = item.switchStatus == 1 ? true : false;
      }
      if (item.switchType == 9) {
        this.isShowFollow = item.switchStatus == 1 ? true : false;
      }
    }
  },
  data() {
    return {
      redImg: 'http://q.img.soukong.cn/hongbao.gif',
      liveImg: 'http://q.img.soukong.cn/afg.png',
      personalImg: 'http://q.img.soukong.cn/af.png',
      followImg: 'http://q.img.soukong.cn/saoyisao.png',
      qCode: '',
      isShowSub: false,
      isShowRed: false,
      rotate: '0deg',
      showDialog: false,
      showPopup: false,
      name: '',
      phone: '',
      redImgs: {
        success: 'http://q.img.soukong.cn/hb_chai_01.png',
        fail: 'http://q.img.soukong.cn/tanc.png',
        show: 'http://q.img.soukong.cn/open_hb.png',
        repeat: 'http://q.img.soukong.cn/tanc1.png'
      },
      redImgIndex: 'success',
      showDialogRed: false,
      amount: '',
      isShowPersonal: true,
      isShowFollow: true
    }
  },
  methods: {
    onRed() {
      let that = this;
      this.$vux.loading.show({
        text: 'Loading'
      })
      const data = {
        openId: that.$store.state.openId,
        redActivityId: that.$store.state.redActivityId
      }
      this.$axios.get(that.$store.state.host + that.$store.state.path + '/newmedia/mobile/redpackageinfo/drawRedPackage.action', { params: data }).then(res => {
        console.log('抢红包接口返回', res.data);
        if (res.data.status == 100) { //抢到红包
          if(res.data.data.recordStatus == 0) { //第一次抢
            that.redImgIndex = 'success'
            that.amount = res.data.data.amount;
          } else { //重复抢
            that.redImgIndex = 'repeat'
            that.isShowRed = false;
          }
        } else { //没有抢到
          that.redImgIndex = 'fail'
        }
        that.$vux.loading.hide()
        that.showDialogRed = true;
        console.log(that.redImgIndex);
      })
    },
    onButtonTap() {
      this.isShowSub = !this.isShowSub;
      this.rotate = this.rotate == '0deg' ? '180deg' : '0deg';
    },
    onLive() { //直播按钮
      this.showPopup = !this.showPopup;
    },
    onPersonal() { //个人按钮
      clearInterval(timerId);
      let that = this;
      // let redirectUri = escape(that.$store.state.relHost) + "%2Fwechatservice%2Fsns%2FsookingBaseSimpleAuthorize.action%3FreturnUrl%3D" + escape(that.$store.state.relHost) + "%252Fnewmedia%252Fpages%252Fmobile%252FMicroWebsite%252FPersonalCenter%252FpersonelIndex.html%253FcmpyId%253D"+ that.$store.state.cmpyId +"%26cmpyId%3D" + that.$store.state.cmpyId
      let redirectUri = that.$store.state.relHost + "/wechatservice/sns/sookingBaseSimpleAuthorize.action?returnUrl=" + escape(that.$store.state.relHost + '/newmedia/pages/mobile/MicroWebsite/PersonalCenter/personelIndex.html?cmpyId=' + that.$store.state.cmpyId) +"&cmpyId=" + that.$store.state.cmpyId
      console.log('redirectUri',redirectUri);
      // let url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${that.$store.state.appid}&scope=snsapi_base&redirect_uri=${redirectUri}&response_type=code&state=1&connect_redirect=1#wechat_redirect`
      // window.location.href = url;
      window.location.href = redirectUri;
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
        this.$axios.get(that.$store.state.host + that.$store.state.path + '/newmedia/mobile/live/addApplyInfo.action', { params: data }).then((res) => {
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
    },
    onOpenRed() {
      if (this.redImgIndex == "success") {
        this.redImgIndex = "show";
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
.redImgs {
  width: 200px;
  height: 250px;
}
.red-dialog-div {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.red-dialog-div>span {
  width: 150px;
  position: relative;
  top: -90px;
  color: white;
  font-size: 18px;
}
.amount {
  color: #F04343;
  font-size: 30px;
  position: relative;
  top: 82px;
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
.red-tip {
  color: white;
  position: relative;
  bottom: 100px;
}
</style>
