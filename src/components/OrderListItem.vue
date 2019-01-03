<template>
  <div class="root">
    <img v-lazy="src" />
    <span class="com-over-length">{{ nickName }}</span>
    <span class="com-over-length">{{ getDate }}</span>
    <span class="com-over-length">￥{{ money }}</span>
  </div>
</template>

<script>
export default {
  props: {
    src: String,
    nickName: String,
    time: String,
    count: Number,
    money: String,
  },
  data() {
    return {

    }
  },
  computed: {
    getDate() {
      const dateArr = this.$utils.timeStemp2DateArr(this.$utils.timeDifference(new Date(), this.$utils.string2Date(this.time)));
      let str = '';
      if (dateArr[0] > 0) {
        str = dateArr[0] + '年前'
      } else if (dateArr[1] > 0) {
        str = dateArr[1] + '个月前'
      } else if (dateArr[2] > 0) {
        str = dateArr[2] + '天前'
      } else if (dateArr[3] > 0) {
        str = dateArr[3] + '个小时前'
      } else if(dateArr[4] > 0) {
        str = dateArr[4] + '分钟前'
      } else if(dateArr[5] > 0) {
        str = dateArr[5] + '秒前'
      }
      return str + '购买了 x' + this.count
    }
  },
  methods: {
    loadingAction() {
      console.log('loading');
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/style/common.scss';

.root {
  padding: 10px 0px 10px 15px;
  background-color: white;
  display: flex;
  align-items: center;
  margin-bottom: 1px;
}
.root>img {
  width: 25px;
  height: 25px;
  border-radius: 25px;
}
.root>span:nth-of-type(1) {
  width: 100px;
  color: $--color-333;
  margin-left: 6px;
}
.root>span:nth-of-type(2) {
  width: 140px;
  color: $--color-ccc;
  margin-left: 6px;
}
.root>span:nth-of-type(3) {
  width: 80px;
  color: $--main-color;
  font-size: 14px;
  margin-left: 6px;
}
</style>
