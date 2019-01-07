<template>
  <div class="root">
    <div class="head">
      <img v-lazy="headimg"/>
      <div class="head-right">
        <div>
          <p>￥{{ checkerArr[check].price }}</p>
          <p>快递佣金：￥{{ checkerArr[check].expressPrice }}</p>
          <p>自提佣金：￥{{ checkerArr[check].autonomyPrice }}</p>
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
          <CheckerItem class="checker-item" v-for="(item, index) in checkerArr" :key="item.id" :value="index">{{ item.value }}</CheckerItem>
        </Checker>
      </div>
      <group class="number-group">
        <x-number v-model="count" title="购买数量" :min="1"></x-number>
      </group>
      <XButton class="button" @click.native="submit">确认订单</XButton>
    </div>
  </div>
</template>

<script>

let goodsName = '';
let productID = '';

export default {
  async mounted() {
    let that = this;
    await this.$utils.waitTask(this, 'initFag'); //等待初始化任务完成后继续执行下面代码
    let getProductDetail = {
      ShopNumber: that.$store.state.shopNumber,
      ProductID: that.$store.state.productId,
      openId: that.$store.state.openId
    }
    this.$axios.get(that.$store.state.host + that.$store.state.path + '/newmedia/mobile/shop/indexproduct/getCommodityDetails.action', { params: getProductDetail}).then(res => {
      console.log('商品详情', res);
      if (res.data.RES == '100') {
        let data = res.data.DATA.Product;
        goodsName = unescape(data.ProductName);
        productID = data.ProductID
        this.headimg = unescape(data.ImgList[0].ImgUrl);
        let checkerArr = [];
        for (let item of data.SkuList) {
          if (item.ApproveStatus == 1) {
            checkerArr.push({
              id: item.SkuID,
              value: unescape(item.SkuName),
              price: item.Price,
              expressPrice: item.Kdyj,
              autonomyPrice: item.ztyj
            })
          }
        }
        this.checkerArr = checkerArr;
        this.$store.commit('setProductDetail', unescape(data.FullDesc).replace(/src/g, 'data').replace(/data-lazyload/g, 'src').replace(/<img/g, '<img style="width: 100%"'));
      }
    })
  },
  data() {
    return {
      headimg: '',
      check: 0,
      count: 1,
      checkerArr: [
        { id: '', value: '', price: '', expressPrice: '', autonomyPrice: '' }
      ],
    }
  },
  methods: {
    onCloseClick() {
      this.$emit('on-close');
    },
    submit() {
      let state = this.$store.state;
      let currentCheck = this.checkerArr[this.check];
      console.log(currentCheck);
      let value = state.productId+"|"+currentCheck.id+"|"+goodsName+"|"+currentCheck.value+"|"+currentCheck.price +"|"+this.count+"|"+state.shopNumber+"|"+state.cmpyName+"|"+state.logoUrl+"|"+this.headimg;
      localStorage.setItem("shop" + state.shopNumber + "^" + state.openId, value);
      window.location.href = this.$store.state.relHost + "/newmedia/pages/mobile/futureStore/sureOrder.html?ShopNumber="+state.shopNumber+"&openId="+state.openId+"&cmpyId="+state.cmpyId+"&ProductID="+productID+'&sourceType=1&sourceId='+state.liveTitleId;
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
