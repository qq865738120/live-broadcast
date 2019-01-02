<template>
  <div class="root">
    <Group class="group">
      <XInput v-model="message" class="input" title=""  :show-clear="false" ref="inputEvent"></XInput>
    </Group>
    <div class="bottom">
      <XButton class="button" mini :gradients="['#AFA79F', '#AFA79F']" @click.native="onCancle">取消</XButton>
      <XButton class="button" mini :gradients="['#ED7E00', '#ED7E00']" @click.native="onSend">发送</XButton>
    </div>
  </div>
</template>

<script>
import methods from '@/common/home.js'

export default {
  mounted() {
    this.$('.weui-cells').css('margin-top', '0');
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
      this.$axios.post(that.$store.state.host + that.$store.state.path + "/newmedia/mobile/liveMessage/addLeaveMessage.action", that.$qs.stringify({
        openId: that.$store.state.openId,
        liveId: that.$store.state.liveTitleId,
        content: that.message
      })).then(res => {
        console.log('消息发送结果', res.data);
        if (res.data.status == 'Y') {
          this.$vux.toast.show({
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
          this.$vux.toast.show({
            text: '发送失败T_T',
            type: 'cancel'
          })
        }
        that.message = '' //将消息栏清空
      })
      this.$store.commit('switchInteractionInputing');
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
}
.bottom {
  margin: 0 14px 14px 14px;
}
</style>
