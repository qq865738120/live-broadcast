<template>
  <Scroller
    lock-x
    height="100%"
    ref="scrollerEvent"
    use-pulldown
    :pulldown-config="pullupConfig"
    @on-pulldown-loading="loadingAction">
    <div class="root" v-for="item in list">
      <img v-lazy="item.src" />
      <span class="com-over-length">{{ item.nickName }}</span>
      <span class="com-over-length">{{ item.time + '购买了x' + item.count }}</span>
      <span class="com-over-length">￥{{ item.money }}</span>
    </div>
  </Scroller>
</template>

<script>
export default {
  mounted() {
    let that = this;
    let data = {
      autoObjectId: that.$store.state.liveTitleId,
      page: 1,
      rows: 10
    }
    this.$axios.get('/api/newmedia/mobile/live/getOrderList.action', { params: data }).then(res => {
      console.log('获取成交列表', res.data);
      if (res.data.status == 'Y') {
        for (let item of res.data.rows) {
          that.list.push({
            src: item.headImg,
            nickName: item.userName,
            time: item.createTime,
            count: item.quantity,
            money: item.amount
          })
        }
      }
    })
  },
  data() {
    return {
      list: [
        { src: '', nickName: '名称名称名', time: '2017-10-8', count: '2235', money: '6226565.08'},
        { src: '', nickName: '名称名名称名称名称', time: '2017-10-8', count: '35', money: '6265.08'},
        { src: '', nickName: '名称名称名称', time: '2017-10-8', count: '2235', money: '565.08'},
        { src: '', nickName: '名称名称名称', time: '2017-10-8', count: '2235', money: '6565.08'},
      ],
      pullupConfig: { //Scroll组件上拉配置
        downContent: '下拉加载',
        upContent: '释放刷新',
        loadingContent: '加载中...',
      },
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
