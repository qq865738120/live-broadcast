<template>
  <div class="root">
    <!-- <Group class="group">
      <XInput v-model="message" class="input" title=""  :show-clear="false" ref="inputEvent"></XInput>
    </Group> -->
    <input v-model="message" class="input" placeholder="点击输入内容" ref="inputEvent"/>
    <div class="bottom">
      <XButton class="button" mini style="margin: 0; margin-left: 16px;" :gradients="['#AFA79F', '#AFA79F']" @click.native="onCancle">取消</XButton>
      <XButton class="button" mini style="margin: 0; margin-left: 16px;" :gradients="['#ED7E00', '#ED7E00']" @click.native="onSend">发送</XButton>
    </div>
  </div>
</template>

<script>
import methods from '@/common/home.js'

export default {
  mounted() {
    this.$('.weui-cells').css('margin-top', '0');
    this.$('.input').removeClass('weui-cell:before');
  },
  data() {
    return {
      message: ''
    }
  },
  methods: {
    onCancle() {
      this.$store.commit('switchInteractionInputing');
    },
    onSend() {
      let that = this;

      if (this.message == '') {
        that.$vux.toast.show({
          text: '消息不能为空',
          type: 'cancel'
        })
        return;
      }

      this.$utils.antiShake(() => {
        that.$axios.post(that.$store.state.host + that.$store.state.path + "/newmedia/mobile/liveMessage/addLeaveMessage.action", that.$qs.stringify({
          openId: that.$store.state.openId,
          liveId: that.$store.state.liveTitleId,
          content: that.message
        })).then(res => {
          console.log('消息发送结果', res.data);
          if (res.data.status == 'Y') {
            that.$vux.toast.show({
              text: '发送成功!'
            })
            let timerId = setInterval(() => {
              that.$store.commit('addInteractionTime'); //每次执行都将interactionTime自增一下
              if(that.$store.state.interactionTime == 10) { //如果interactionTime等于10则将interactionTime置零并清除计时器
                that.$store.commit('resetInteractionTime');
                clearInterval(timerId);
              }
            }, 1000)
          } else {
            that.$vux.toast.show({
              text: '发送失败T_T',
              type: 'cancel'
            })
          }
          that.message = '' //将消息栏清空
        })
        if (that.$utils.driverType() == 1) {
          that.$store.commit('switchInteractionInputing');
        }
      }, 800)
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/style/common.scss';

.root {
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.group {
  width: calc(100% - 28px);
  padding: 14px 14px 0 14px;
}
.input {
  background-color: $--color-F5;
  border-radius: 10px;
  height: 36px;
  margin: 20px 14px 12px 14px;
  width: 313px;
  border: 0;
  font-size: 18px;
  padding: 0 15px;
}
.bottom {
  margin: 0 14px 20px 20px;
  // width: 159px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.button {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
