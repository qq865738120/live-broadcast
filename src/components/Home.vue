<template>
  <div>
    <Video title="标题1" @x5-enter-fullscreen="x5EnterFullscreen" @x5-exit-fullscreen="x5ExitFullscreen">

      <!-- 广告条开始 -->
      <div class="ad-bar" v-if="showAdBar">
        <img src="https://goss1.vcg.com/creative/vcg/800/version23/VCG21gic6409708.jpg" />
      </div>
      <!-- 广告条结束 -->

      <!-- tab栏开始 -->
      <Tab :line-width=2 active-color='#ED7E00' v-model="itemIndex">
        <TabItem :selected="itemIndex === item.id" v-for="(item, index) in tabItems" @click="itemIndex = item.id" :key="item.id">{{item.text}}</TabItem>
      </Tab>
      <!-- tab栏结束 -->

      <!-- tab内容开始 -->
      <Swiper v-model="itemIndex" :min-moving-distance="80" :style="{height: swiperHeight}" :show-dots="false">
        <SwiperItem v-for="(item, index) in tabItems" :key="item.id">
          <div class="swiper-content">
            <template v-if="item.typeId == 1">
              <ListPullLoading :options="listPullLoadingOpt" style="heigth: 100%">
                <template slot="list">
                  <InteractionList
                    v-for="item in interactionList"
                    :key="item.id"
                    :title="item.title"
                    :time="item.time"
                    :message="item.message"
                    :icon="item.icon"
                    :image="item.image"
                    :isMaster="item.isMaster"></InteractionList>
                </template>
              </ListPullLoading>
            </template>
            <template v-else-if="item.typeId == 5">
              <div>
                成交
              </div>
            </template>
            <template v-else="">
              <div>
                其他
              </div>
            </template>

          </div>
        </SwiperItem>
      </Swiper>
      <!-- tab内容结束 -->

      <!-- 底部菜单开始 -->
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
      <!-- 底部菜单结束 -->

    </Video>
  </div>
</template>

<script>
import Video from '@/components/Video'
import InteractionList from '@/components/InteractionList'
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
        { id: 0, typeId: '1', text: '互动' },
        { id: 1, typeId: '3', text: '详情' },
        { id: 2, typeId: '5', text: '成交' },
        { id: 3, typeId: '2', text: '简介' },
        { id: 4, typeId: '10', text: '自定义' },
      ],
      swiperHeight: '', //swiper高度
      showAdBar: false, //是否展示广告条
      inputWord: "请输入内容213", //输入框占位符
      inputWidth: "2.5rem", //输入框宽度
      listPullLoadingOpt: { //上拉下拉列表组件选项配置
        auto: true,
        isShowToTop: false,
				parameters: {typeId: null},
				down: {
					offset: 50
				},
				api: this.queryInteractionList
			},
      interactionList: [ //互动列表数据
        { id: 0, title: '标题啊标题啊0', time: '1小时', message: '这是一条消息这是一条消息这是一条消息', isMaster: false, icon: 'http://img2.imgtn.bdimg.com/it/u=3197537752,2095789724&fm=26&gp=0.jpg', image: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1544776923060&di=31b3a9fd116050fa5baf6dfbe7231233&imgtype=0&src=http%3A%2F%2Fh.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2Ff2deb48f8c5494eec7036a5f20f5e0fe99257e56.jpg' }
      ],
      testAllData: [
        { id: 1, title: '标题啊标题啊1', time: '1小时', message: '这是一条消息这是一条消息这是一条消息', isMaster: true, icon: 'http://img2.imgtn.bdimg.com/it/u=3197537752,2095789724&fm=26&gp=0.jpg', image: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1544776923060&di=31b3a9fd116050fa5baf6dfbe7231233&imgtype=0&src=http%3A%2F%2Fh.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2Ff2deb48f8c5494eec7036a5f20f5e0fe99257e56.jpg' },
        { id: 2, title: '标题啊标题啊2', time: '1小时', message: '这是一条消息这是一条消息这是一条消息', isMaster: false, icon: 'http://img2.imgtn.bdimg.com/it/u=3197537752,2095789724&fm=26&gp=0.jpg', image: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1544776923060&di=31b3a9fd116050fa5baf6dfbe7231233&imgtype=0&src=http%3A%2F%2Fh.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2Ff2deb48f8c5494eec7036a5f20f5e0fe99257e56.jpg' },
        { id: 3, title: '标题啊标题啊3', time: '1小时', message: '这是一条消息这是一条消息这是一条消息', isMaster: true, icon: 'http://img2.imgtn.bdimg.com/it/u=3197537752,2095789724&fm=26&gp=0.jpg', image: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1544776923060&di=31b3a9fd116050fa5baf6dfbe7231233&imgtype=0&src=http%3A%2F%2Fh.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2Ff2deb48f8c5494eec7036a5f20f5e0fe99257e56.jpg' },
        { id: 4, title: '标题啊标题啊4', time: '1小时', message: '这是一条消息这是一条消息这是一条消息', isMaster: false, icon: 'http://img2.imgtn.bdimg.com/it/u=3197537752,2095789724&fm=26&gp=0.jpg', image: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1544776923060&di=31b3a9fd116050fa5baf6dfbe7231233&imgtype=0&src=http%3A%2F%2Fh.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2Ff2deb48f8c5494eec7036a5f20f5e0fe99257e56.jpg' },
        { id: 5, title: '标题啊标题啊5', time: '1小时', message: '这是一条消息这是一条消息这是一条消息', isMaster: false, icon: 'http://img2.imgtn.bdimg.com/it/u=3197537752,2095789724&fm=26&gp=0.jpg' },
        { id: 6, title: '标题啊标题啊6', time: '1小时', message: '这是一条消息这是一条消息这是一条消息', isMaster: false, icon: 'http://img2.imgtn.bdimg.com/it/u=3197537752,2095789724&fm=26&gp=0.jpg', image: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1544776923060&di=31b3a9fd116050fa5baf6dfbe7231233&imgtype=0&src=http%3A%2F%2Fh.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2Ff2deb48f8c5494eec7036a5f20f5e0fe99257e56.jpg' },
        { id: 7, title: '标题啊标题啊7', time: '1小时', message: '这是一条消息这是一条消息这是一条消息', isMaster: false, icon: 'http://img2.imgtn.bdimg.com/it/u=3197537752,2095789724&fm=26&gp=0.jpg', image: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1544776923060&di=31b3a9fd116050fa5baf6dfbe7231233&imgtype=0&src=http%3A%2F%2Fh.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2Ff2deb48f8c5494eec7036a5f20f5e0fe99257e56.jpg' },
        { id: 8, title: '标题啊标题啊8', time: '1小时', message: '这是一条消息这是一条消息这是一条消息', isMaster: false, icon: 'http://img2.imgtn.bdimg.com/it/u=3197537752,2095789724&fm=26&gp=0.jpg', image: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1544776923060&di=31b3a9fd116050fa5baf6dfbe7231233&imgtype=0&src=http%3A%2F%2Fh.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2Ff2deb48f8c5494eec7036a5f20f5e0fe99257e56.jpg' },
        { id: 9, title: '标题啊标题啊9', time: '1小时', message: '这是一条消息这是一条消息这是一条消息', isMaster: false, icon: 'http://img2.imgtn.bdimg.com/it/u=3197537752,2095789724&fm=26&gp=0.jpg', image: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1544776923060&di=31b3a9fd116050fa5baf6dfbe7231233&imgtype=0&src=http%3A%2F%2Fh.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2Ff2deb48f8c5494eec7036a5f20f5e0fe99257e56.jpg' },
        { id: 10, title: '标题啊标题啊10', time: '1小时', message: '这是一条消息这是一条消息这是一条消息', isMaster: false, icon: 'http://img2.imgtn.bdimg.com/it/u=3197537752,2095789724&fm=26&gp=0.jpg', image: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1544776923060&di=31b3a9fd116050fa5baf6dfbe7231233&imgtype=0&src=http%3A%2F%2Fh.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2Ff2deb48f8c5494eec7036a5f20f5e0fe99257e56.jpg' },
        { id: 11, title: '标题啊标题啊11', time: '1小时', message: '这是一条消息这是一条消息这是一条消息', isMaster: false, icon: 'http://img2.imgtn.bdimg.com/it/u=3197537752,2095789724&fm=26&gp=0.jpg', image: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1544776923060&di=31b3a9fd116050fa5baf6dfbe7231233&imgtype=0&src=http%3A%2F%2Fh.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2Ff2deb48f8c5494eec7036a5f20f5e0fe99257e56.jpg' },
        { id: 12, title: '标题啊标题啊12', time: '1小时', message: '这是一条消息这是一条消息这是一条消息', isMaster: false, icon: 'http://img2.imgtn.bdimg.com/it/u=3197537752,2095789724&fm=26&gp=0.jpg', image: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1544776923060&di=31b3a9fd116050fa5baf6dfbe7231233&imgtype=0&src=http%3A%2F%2Fh.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2Ff2deb48f8c5494eec7036a5f20f5e0fe99257e56.jpg' },
        { id: 13, title: '标题啊标题啊13', time: '1小时', message: '这是一条消息这是一条消息这是一条消息', isMaster: false, icon: 'http://img2.imgtn.bdimg.com/it/u=3197537752,2095789724&fm=26&gp=0.jpg', image: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1544776923060&di=31b3a9fd116050fa5baf6dfbe7231233&imgtype=0&src=http%3A%2F%2Fh.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2Ff2deb48f8c5494eec7036a5f20f5e0fe99257e56.jpg' },
      ]
    }
  },
  components: {
    Video,
    InteractionList
  },
  methods: {
    switchTabBody(index) {
      console.log(index);
    },
    x5EnterFullscreen() { //安卓机进入x5同层播放触发事件函数
      methods.setSwiperHeight('7.33rem', '8.53rem');
    },
    x5ExitFullscreen() { //安卓机退出x5同层播放触发事件函数
      methods.setSwiperHeight('6.78rem', '7.98rem');
    },
    /*
    查询互动信息
    参数：parameters 请求接口需要的参数
         isLoadingMore 是否正在加载
    */
    queryInteractionList(parameters, isLoadingMore) {
      let _this = this;
      return new Promise((resolve, reject) => {
        setTimeout(function() {
          let end = (_this.testAllData.length > parameters.skipCount + parameters.maxResultCount) ? parameters.skipCount + parameters.maxResultCount:_this.testAllData.length;
						if(isLoadingMore) {
							_this.interactionList.push(..._this.testAllData.slice(parameters.skipCount, end));
						} else {
							_this.interactionList = _this.testAllData.slice(parameters.skipCount, end);
						}
						resolve(end - parameters.skipCount);
        }, 500)
      })
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
  .swiper-content {
    height: 100%;
    background-color: $--color-F9;
  }
</style>
