<template>
  <div class="root">
    <Icon type="warn" is-msg></Icon>
    <p>支付失败啦！{{ count }}s后自动跳转</p>
  </div>
</template>

<script>
export default {
  name: 'PayFailPage',
  mounted() {
    let that = this;
    this.$store.commit('setTitle', '支付失败')
    let id = setInterval(() => {
      that.count--
    }, 1000);
    setTimeout(() => {
      let par = '?liveTitleId='+ that.$store.state.liveTitleId +'&openId='+ that.$store.state.openId +'&cmpyId=' + that.$store.state.cmpyId;
      clearInterval(id);
      if (that.$store.state.environment == 'local') {
        window.location.href = '/#/red?' + par;
      } else if (that.$store.state.environment == 'online') {
        window.location.href = '/newmedia/pages/mobile/MicroWebsite/livebroadcast/index.html#/red?' + par;
      }
    }, 5000)
  },
  data() {
    return {
      count: 5
    }
  }
}
</script>

<style scoped>
.root {
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.root>p {
  margin-block-start: 30px;
  font-size: 14px;
}
</style>
