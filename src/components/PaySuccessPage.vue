<template>
  <div class="root">
    <Icon type="success" is-msg></Icon>
    <p>支付成功！{{ count }}s后自动跳转</p>
  </div>
</template>

<script>
export default {
  name: 'PaySuccessPage',
  mounted() {
    this.$store.commit('setTitle', '支付成功')
    let that = this;
    let id = setInterval(() => {
      that.count--
    }, 1000);
    setTimeout(() => {
      let par = '?titleId='+ that.$store.state.liveTitleId +'&openId='+ that.$store.state.openId +'&cmpyId=' + that.$store.state.cmpyId;
      clearInterval(id);
      window.location.href = this.$store.state.relHost + '/newmedia/pages/mobile/MicroWebsite/livebroadcast/livebroadCasttable.html' + par;
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
