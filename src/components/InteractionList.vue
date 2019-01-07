<template>
  <div class="root">
      <div>
        <img class="header-icon" v-if="icon != undefined && icon != ''" :src="icon"></XImg>
      </div>
      <div class="left">
        <div class="left-top">
          <span :class="isMaster ? 'iconfont icon-zhibo' : ''">{{ title }}</span>
          <span>{{ time | dropLast }}</span>
        </div>
        <p>{{ message }}</p>
        <img class="message-img" v-if="image != undefined && image != ''" :src="image"></img>
      </div>
  </div>
</template>

<script>
  export default {
    props: {
      title: String,
      time: String,
      message: String,
      icon: String,
      image: String,
      isMaster: Boolean //是否展示主播图标
    },
    filters: {
      dropLast: function (value) {
        if (!value) return ''
        value = value.toString()
        return value.split('.')[0]
      }
    },
    methods: {
      success(src, ele) {
        console.log(src, ele);
      },
      err(src, msg) {
        console.log(src, msg);
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '@/assets/style/common.scss';

  .root {
    display: flex;
    justify-content: flex-start;
    padding: 16px 15px;
    background-color: white;
    margin-bottom: 1px;
    box-sizing: border-box;
  }
  .header-icon {
    width: 45px;
    height: 45px;
    border-radius: 50%;
  }
  .left {
    width: 8rem;
    margin-left: 10px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }
  .left-top {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }
  .left-top>span {
    font-size: 12px;
    color: $--color-666;
  }
  .left>p {
    font-size: 16px;
    color: $--color-333;
    margin-block-start: 10px;
    margin-block-end: 14px;
  }
  .message-img {
    border-radius: 3px;
    max-width: 100%;
  }
</style>
