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
        <div class="iconfont icon-plus-close colse-icon" @click="onCloseClick"></div>
      </div>
    </div>
    <div class="content">
      <div>
        <p>规格名称</p>
        <Checker
          v-model="check"
          class="checker"
          default-item-class="checker-default"
          selected-item-class="checker-selected"
          :radio-required="true">
          <CheckerItem class="checker-item" v-for="i in [1, 2, 3,4,5,6,7,8,9,10,11]" :key="i" :value="i">￥{{i*300}}</CheckerItem>
        </Checker>
      </div>
      <!-- <Cell title="购买数量">
        <InlineXNumber v-model="number" :min="1" width="50px"></InlineXNumber>
      </cell> -->
      <group class="number-group">
        <x-number v-model="number" title="购买数量" :min="1"></x-number>
      </group>
      <XButton class="button">确认订单</XButton>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {

  },
  data() {
    return {
      headimg: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1545144878044&di=8a12cc23f18730ff6079e1eeed31d9a1&imgtype=0&src=http%3A%2F%2Fe.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2F4b90f603738da9774d57356cbd51f8198618e379.jpg',
      check: 1,
      number: 1,
    }
  },
  methods: {
    onCloseClick() {
      this.$emit('on-close');
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/style/common.scss';

.root {
  width: calc(100% - 24px);
  height: 400px;
  background-color: white;
  padding: 12px;
  position: relative;
  bottom: 424px;
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
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.content>div>p:first-child {
  font-size: 16px;
  color: $--color-666;
}
.checker-default {
  border: 1px solid $--color-ccc;
  background-color: white;
  color: $--color-333;
}
.checker-selected {
  background-color: $--main-color;
  border: 1px solid $--main-color;
  color: white;
}
.checker-item {
  margin-right: 6px;
  margin-bottom: 10px;
  padding: 4px 6px;
  border-radius: 4px;
}
.number-group {
  margin-bottom: 60px;
}
.button {
  position: absolute;
  bottom: 0;
  right: -12px;
  width: 10rem;
  border-radius: 0;
  background-color: $--main-color;
  color: white;
  border: 0px;
}
.button:after {
  border: 0px;
}
</style>
