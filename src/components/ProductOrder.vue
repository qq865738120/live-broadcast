<template>
  <div class="root">
    <div class="head">
      <img v-lazy="headimg"/>
      <div class="head-right">
        <div>
          <p>￥ 10.00</p>
          <p>快递佣金：￥2.89</p>
          <p>自提佣金：￥2.89</p>
        </div>
        <div class="iconfont icon-plus-close colse-icon"></div>
      </div>
    </div>
    <div class="content">
      <p>规格名称</p>
      <Checker
        default-item-class="checker"
        selected-item-class="checker-selected">
        <CheckerItem v-for="i in [1, 2, 3]" :key="i" :value="i">￥{{i*300}}</CheckerItem>
      </Checker>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      headimg: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1545144878044&di=8a12cc23f18730ff6079e1eeed31d9a1&imgtype=0&src=http%3A%2F%2Fe.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2F4b90f603738da9774d57356cbd51f8198618e379.jpg'
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/style/common.scss';

.root {
  width: calc(100% - 24px);
  height: 360px;
  background-color: white;
  padding: 12px;
  position: relative;
  bottom: 384px;
}
.head {
  position: absolute;
  top: -20px;
  width: calc(100% - 24px);
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}
.head>img {
  width: 120px;
  height: 120px;
  border-radius: 4px;
}
.head-right {
  width: 220px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}
.head-right>div>p:first-child {
  color: $--main-color;
  font-size: 16px;
  margin-block-end: 10px;
  margin-block-start: 10px;
}
.head-right>div>p:last-child,
.head-right>div>p:nth-child(2) {
  margin-block-end: 0;
  margin-block-start: 6px;
  color: $--color-333;
}
.colse-icon {
  color: $--color-666;
  font-size: 20px;
}
.content {
  width: calc(100% - 24px);
  height: calc(100% - 100px);
  position: absolute;
  bottom: 0;
}
.content>p:first-child {
  font-size: 16px;
  color: $--color-666;
}
.checker {
  border: 1px solid #ccc;
  background-color: white;
}
</style>
