<template>
  <div>
    <Video title="标题1" @x5-enter-fullscreen="x5EnterFullscreen" @x5-exit-fullscreen="x5ExitFullscreen">
      <div class="ad-bar" v-if="showAdBar">
        <img src="https://goss1.vcg.com/creative/vcg/800/version23/VCG21gic6409708.jpg" />
      </div>
      <Tab :line-width=2 active-color='#ED7E00' v-model="itemIndex">
        <TabItem :selected="itemIndex === item.id" v-for="(item, index) in tabItems" @click="itemIndex = item.id" :key="item.id">{{item.text}}</TabItem>
      </Tab>
      <Swiper v-model="itemIndex" :min-moving-distance="30" :style="{height: swiperHeight}" :show-dots="false">
        <SwiperItem v-for="(item, index) in tabItems" :key="item.id">
          <div class="tab-swiper vux-center">{{item.text}} Container</div>
        </SwiperItem>
      </Swiper>
      <div class="bottom-bar">
        <!-- <Group gutter="0" class="input" :style="{width: inputWidth}">
          <XInput type="text" :placeholder="placeholder"></XInput>
        </Group> -->
        <div class="input">
          <span class="com-over-length" :style="{width: inputWidth}">
            {{ inputWord }}
          </span>
        </div>
        <XButton action-type="button" :gradients="['#ED7E00', '#ED7E00']">立即购买</XButton>
        <div class="com-icon-button bottom-bar-right">
          <div class="iconfont icon-fenxiang"></div>
          <span>分享</span>
        </div>
      </div>
    </Video>
  </div>
</template>

<script>
import Video from '@/components/Video'
import methods from '@/common/home.js'

export default {
  name: 'Home',
  mounted() {
    methods.init(this);

  },
  data () {
    return {
      itemIndex: 0, //tab栏索引，切换tabItem
      tabItems: [ //tab栏列表项数据
        { id: 0, text: '互动' },
        { id: 1, text: '详情' },
        { id: 2, text: '成交' },
        { id: 3, text: '简介' },
        { id: 4, text: '自定义' },
      ],
      swiperHeight: '', //swiper高度
      showAdBar: false, //是否展示广告条
      inputWord: "请输入内容213", //输入框占位符
      inputWidth: "2.5rem" //输入框宽度
    }
  },
  components: {
    Video
  },
  methods: {
    switchTabBody(index) {
      console.log(index);
    },
    x5EnterFullscreen() { //安卓机进入x5同层播放触发事件函数
      console.log(methods.setSwiperHeight);

      methods.setSwiperHeight('7.33rem', '8.53rem');
    },
    x5ExitFullscreen() { //安卓机退出x5同层播放触发事件函数
      console.log("456");
      methods.setSwiperHeight('6.78rem', '7.98rem');
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import '@/assets/style/common.scss';

  .ad-bar {
    width: 100%;
    height: 45px;
  }
  .ad-bar img {
    width: 100%;
    height: calc(100% + 2px);
  }
  .bottom-bar {
    width: 100%;
    height: 46px;
    padding: 6px 2px;
    background-color: white;
    border-top: 1px solid $--color-E9;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
  }
  .input {
    font-size: 15px;
    color: $--color-333;
    padding: 6px 10px;
  }
  .input span {
    padding: 4px 8px;
    border: 1px solid $--color-E9;
    border-radius: 10px;
    line-height: 19px;
  }
  .bottom-bar-right {
    width: 120px;
    height: 100%;
    color: $--color-666;
  }
  .bottom-bar-right div {
    margin-bottom: 4px;
  }
  .bottom-bar-right span {
    font-size: 11px;
  }
</style>
