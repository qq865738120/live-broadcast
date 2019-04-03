<template>
  <div class="root">
    <div class="content">
      <div class="input-bar iconfont icon-shouji">
        <input v-model="phone" type="number" placeholder="请输入手机号"/>
      </div>
      <div class="second-row">
        <div class="input-bar iconfont icon-ecurityCode">
          <input v-model="code" type="number" placeholder="请输入验证码"/>
        </div>
        <div class="button com-flex-center" :style="payStyle" @click="onSend">{{ sendText }}</div>
      </div>
      <div class="pay-button com-flex-center" :style="payStyle" @click="onRegister">注册</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RegisterPage',
  mounted() {
    this.$store.commit('setTitle', '注册')
  },
  data() {
    return {
      phone: '',
      code: '',
      payStyle: '',
      sendText: '发送',
      timerId: ''
    }
  },
  methods: {
    onRegister() {
      let that = this
      if (this.phone == '') {
        this.$vux.toast.show({
          text: '手机号不能为空',
          type: 'text'
        })
        return
      }
      if (this.code == '') {
        this.$vux.toast.show({
          text: '验证码不能为空',
          type: 'text'
        })
        return
      }
      this.$axios.get(this.$store.state.host + this.$store.state.path + '/newmedia/mobile/baseUserInfo/registerByPhone.action', { params: { phone: this.phone, vcode: this.code } }).then(res => {
        console.log('发送注册信息', res.data);
        if (res.data.code == 'ERROR') {
          this.$vux.toast.show({
            text: res.data.msg,
            type: 'cancel'
          })
        } else if (res.data.code == 'SUCCESS') {
          let par = {
            type: 'OPENID',
            loginUserName: that.$store.state.openId,
            baseUserId: res.data.data.baseUserId
          }
          this.$axios.get(this.$store.state.host + this.$store.state.path + '/newmedia/mobile/baseUserInfo/addBaseUserLoginInfo.action', { params: par }).then(res => {
            console.log('添加注册信息', res.data);
          })
          this.$vux.toast.show({
            text: '注册成功',
            type: 'success'
          })
          setTimeout(() => {
            this.$router.go(-1)
          }, 2400)
        } else if (res.data.code == 'EXIST') {
          this.$vux.toast.show({
            text: res.data.msg,
            type: 'cancel'
          })
        }
      })
    },
    onSend() {
      let that = this;
      if (this.timerId != '') {
        return
      } else {
        let count = 60
        this.timerId = setInterval(() => {
          that.sendText = count != 0 ? count-- + 's' : ''
          console.log('count',count);
          if (count == 0) {
            clearInterval(that.timerId)
            that.timerId = ''
            that.sendText = '发送'
          }
        }, 1000)
      }
      if (this.phone == '') {
        this.$vux.toast.show({
          text: '手机号不能为空',
          type: 'text'
        })
        return;
      }
      if (!this.$utils.checkPhone(this.phone)) {
        this.$vux.toast.show({
          text: '手机号输入有误',
          type: 'text'
        })
        return;
      }
      this.$axios.get(this.$store.state.host + this.$store.state.path + '/newmedia/mobile/smsClient/sendSmsCode.action', { params: { phoneNo: this.phone } }).then(res => {
        console.log('发送验证码', res.data);
        if (res.data.status == 'ERROR' || res.data.status == 'FAIL') { //没有注册
          this.$vux.toast.show({
            text: '发送失败',
            type: 'cancel'
          })
        } else if(res.data.status == 'success') {
          this.$vux.toast.show({
            text: '发送成功',
            type: 'success'
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/style/common.scss';

.root {
  padding-top: 60px;
  width: 100%;
  height: calc(100% - 60px);
}
.content {
  width: 285px;
  margin: 0 15px 0px 15px;
  padding: 30px;
  box-shadow: 0px 0px 29px 0px $--color-ccc;
}
.input-bar {
  font-size: 16px;
  border-radius: 50px;
  border: 1px solid $--color-ddd;
  padding: 6px 10px;
  margin-bottom: 20px;
  color: $--color-4F;
}
.input-bar input {
  border: 0;
  background-color: rgba(0,0,0,0);
  width: 230px;
  margin-left: 10px;
}
.second-row {
  display: flex;
  justify-content: space-between;
}
.second-row .input-bar {
  width: 150px;
}
.second-row .input-bar input {
  width: 120px;
}
.button {
  height: 30px;
  width: 100px;
  color: $--main-color;
  border: 1px solid $--main-color;
  border-radius: 15px;
}
.tip {
  color: $--color-999;
  font-size: 13px;
  line-height: 18px;
  margin-top: 50px;
  width: 244px;
  padding-left: 20px;
  text-align: center;
}
.pay-button {
  width: 230px;
  height: 44px;
  color: white;
  background-color: $--main-color;
  border-radius: 22px;
  font-size: 16px;
  margin: 10px auto;
}
</style>
