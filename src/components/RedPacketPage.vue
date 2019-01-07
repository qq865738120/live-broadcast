<template>
  <div class="root">
    <div class="content">
      <div class="input-bar">
        <span>金额（元）</span>
        <input v-model="sum" type="number" placeholder="填写金额(1-200元)" @change="onSumChange"/>
      </div>
      <div class="input-bar">
        <span>数量（个）</span>
        <input v-model="count" type="number" :disabled="sum != '' && sum > 0 ? false : true" placeholder="不小于个数*0.3元" @keyup="onCountKeyup"/>
      </div>
      <p class="tip">
        <span>因微信限制，每个红包不小于0.3元</span><br />
        <span>若红包未领完，3日后自动返回到微信钱包</span>
      </p>
      <div class="pay-button com-flex-center" :style="payStyle" @click="onPay">支付 {{ pay }}元</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RedPacketPage',
  mounted() {
    this.$store.commit('setTitle', '发红包')
  },
  data() {
    return {
      isDisabled: true,
      sum: '',
      count: '',
      pay: '0.00',
      payStyle: {
        color: '#FFF5DB',
        background: '#FFBE8B'
      }
    }
  },
  methods: {
    onSumChange() {
      let sum = this.$utils.formateMoney(this.sum);
      if (sum > 200) sum = 200.00
      else if (sum < 1) sum = 1
      this.sum =  sum;
      this.pay = (this.sum * 1.02).toFixed(2)
    },
    onCountKeyup() {
      console.log('count', this.sum);
      let count = Math.floor(this.sum / 0.3)
      console.log('count', count);
      if (this.count > count) this.count = count;
      else if (this.count < 0) this.count = 0;
      else this.count = this.count.toString().replace(/\b(0+)/gi,"")
      if (this.count != '' && this.count != 0) {
        this.pay = (this.sum * 1.02).toFixed(2);
        this.payStyle.color = '#ffffff';
        this.payStyle.background = '#ED7E00';
      } else {
        this.pay = (this.sum * 1.02).toFixed(2);
        this.payStyle.color = '#FFF5DB';
        this.payStyle.background = '#FFBE8B';
      }

    },
    onPay() {
      if (this.count != '' && this.sum != '') {
        let that = this;
        const data = {
          openId: that.$store.state.openId,
          readAmount: that.sum,
          numberCount: that.count,
          objType: 1,
          objId: that.$store.state.liveTitleId
        }
        this.$vux.confirm.show({
          title: '提示',
          content: '确认发送红包吗？',
          onConfirm () {
            that.$axios.get(that.$store.state.host + that.$store.state.path + '/newmedia/mobile/redpackageactivity/modify.action', { params: data }).then(res => {
              console.log('创建红包', res.data);
              if (res.data.status == 100) {
                that.$store.commit('setRedOrderNo', res.data.data.orderNo);
                let par = '?liveTitleId='+ that.$store.state.liveTitleId +'&openId='+ that.$store.state.openId +'&cmpyId=' + that.$store.state.cmpyId;
                let path = '/'
                if (that.$store.state.environment == "local") {
                  path = '/'
                } else if (that.$store.state.environment == "online") {
                  path = '/newmedia/pages/mobile/MicroWebsite/livebroadcast/index.html'
                }
                console.log('that.$store.state.environment', path);
                let successUrl = escape(that.$store.state.host + path + '#/pay/success' + par);
                let failUrl = escape(that.$store.state.host + path + '#/pay/fail' + par);
                let url = that.$store.state.relHost + '/newmedia/pages/mobile/MicroWebsite/wechatpay/pay.html?openId='+ that.$store.state.openId +'&cmpyId='+ that.$store.state.cmpyId +'&orderNo='+ that.$store.state.redOrderNo +'&successUrl='+ successUrl +'&failurl=' + failUrl
                window.location.href = url;
              } else {
                that.$vux.toast.show({
                 text: res.data.msg,
                 type: 'cancel'
                })
              }
            })
          }
        })
      }
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
  padding-top: 30px;
  font-size: 16px;
}
.input-bar input {
  border: 0;
  background-color: rgba(0,0,0,0);
  border-bottom: 1px solid $--color-ddd;
  width: 200px;
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
