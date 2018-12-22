<template>
  <div class="root">
    <div class="content">
      <div class="input-bar">
        <span>金额（元）</span>
        <input placeholder="填写金额(1-200元)"/>
      </div>
      <div class="input-bar">
        <span>数量（个）</span>
        <input placeholder="不小于个数*0.3元"/>
      </div>
      <p class="tip">
        <span>因微信限制，每个红包不小于0.3元</span><br />
        <span>若红包未领完，3日后自动返回到微信钱包</span>
      </p>
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
</style>
