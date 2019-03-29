<template>
  <div>
    <div class="title-bar" v-if="showTitle">{{ title }}</div>
    <div id="video-container" :style="{ height: videoBoxHeight }"></div>
    <!-- <div class="content" :style="{ top: contentTop, height: contentHeight }">
      <slot></slot>
    </div> -->
  </div>
</template>

<script>
var tcPlayer = require('@/common/tc-player.js');

const controlsBarH = '0.9rem';
let fontSize = 37.5; // html元素font-size属性，音响所有页面的rem单位大小
let videoHeight = 5.38 // 视频高度，单位rem

export default {
  name: 'Video',
  async mounted() {
    const that = this;
    fontSize = parseInt(this.$('html').css('font-size').replace('px', ''));
    videoHeight = window.screen.height / fontSize - 1.38;
    console.log('screen.availHeight', window.screen.availHeight);
    console.log('screen.height', window.screen.height);
    console.log('window', window.innerHeight);
    if (this.$utils.driverType() == 0) {
      that.$data.contentHeight =  window.innerHeight / fontSize - videoHeight + 'rem';
    } else if (this.$utils.driverType() == 1) {
      that.$data.contentHeight =  window.innerHeight / fontSize - videoHeight - 0.2 + 'rem';
    }
    console.log('videoHeight',videoHeight);
    console.log('fontSize', fontSize);
    let sureFullScreen = false; //是否需要进入全屏逻辑处理
    let isPlay = false; //是否开始播放
    await this.$utils.waitTask(this, 'initFag'); //等待初始化任务完成后继续执行下面代码
    let player = new tcPlayer.TcPlayer.TcPlayer('video-container', {
      // mp4: 'http://vjs.zencdn.net/v/oceans.mp4',
      // mp4: 'http://1256993030.vod2.myqcloud.com/d520582dvodtransgzp1256993030/7732bd367447398157015849771/v.f40.mp4',
      m3u8: that.$store.state.videoSource,
      // coverpic: 'https://goss1.vcg.com/creative/vcg/veer/800/new/VCG41N672909176.jpg',
      coverpic: that.$store.state.videoCoverpic,
      // coverpic: 'https://goss2.vcg.com/creative/vcg/800/version23/VCG21gic18454706.jpg',
      autoplay: false,
      live: that.$store.state.isLive,
      width: window.screen.width,
      height: window.screen.height,
      systemFullscreen: true,
      x5_type: 'h5',
      x5_fullscreen: 'true',
      listener: function (msg) {
        // console.log(msg);
        if (msg.type == 'play') {
          isPlay = true;
          that.$('.vcp-bigplay').removeClass("iconfont icon-bofang-yuanshijituantubiao com-flex-center");
        }
        if (msg.type == 'pause') {
          isPlay = false;
        }
      }
    })

    this.$('#video-container').height(videoHeight + 'rem')

    /*
    播放器控件样式
    */
    this.$('.vcp-player').css("background","#f5f5f5");
    this.$('.vcp-player video').css("background","#f5f5f5");
    this.$('.vcp-player video').css("object-position","center");
    this.$('.vcp-poster-pic').removeClass('default');
    this.$('.vcp-poster-pic').css({
      "position": "absolute",
      "width": "100%",
      "height": videoHeight + 'rem'
    });
    this.$('.vcp-controls-panel').css({
      'display': 'none'
    });
    this.$('.vcp-playtoggle').width(controlsBarH);
    this.$('.vcp-timelabel').css({
      'height': controlsBarH,
      'line-height': controlsBarH,
      'font-size': '12px'
    });
    this.$('.vcp-fullscreen-toggle').width(controlsBarH);
    this.$('.vcp-fullscreen-toggle').height(controlsBarH);
    this.$('.vcp-loading').css({
      "margin-top": "0",
      "z-index": "10000",
      "top": "1.86rem"
    })
    this.$('.vcp-bigplay').css({
      'height': videoHeight + 'rem',
      'opacity': '1',
      'font-size': '64px',
      'color': '#f5f5f5',
    })
    this.$('.vcp-bigplay').addClass("iconfont icon-bofang-yuanshijituantubiao com-flex-center");

    /* 安卓同层播放监听 */
    this.$('.vcp-player video').on("x5videoenterfullscreen", function() {
      console.log('进入同层全屏播放')
      that.$data.showTitle = true;
      that.$('.vcp-player video').css("object-position","center");
      that.$data.videoBoxHeight = '100%'
      that.$('.vcp-player').height(window.screen.height)
      that.$('.vcp-player video').height(window.screen.height)
      that.$emit('x5-enter-fullscreen')
    })
    this.$('.vcp-player video').on("x5videoexitfullscreen", function() {
      console.log('退出同层全屏播放')
      that.$data.showTitle = false;
      that.$('.vcp-player video').css("object-position","center");
      that.$data.videoBoxHeight = '100%'
      that.$('.vcp-bigplay').addClass("iconfont icon-bofang-yuanshijituantubiao com-flex-center");
      that.$('.vcp-player').height(window.screen.height - 72)
      that.$('.vcp-player video').height(window.screen.height - 72)
      that.$emit('x5-exit-fullscreen')
    })

    /*
    android兼容性处理
    */
    if (this.$utils.driverType() == 0) {
      this.$('.vcp-fullscreen-toggle').on('click', function() { //安卓播放后全屏处理
        that.$('.vcp-player video').hide();
        sureFullScreen = true;
      })
    }

    /*
    ios兼容性处理
    */
    if (this.$utils.driverType() == 1) {
      this.$('.vcp-fullscreen-toggle').on('click', function() {
        // alert('ok')
        // if (fullScreenSwitch) {
        //
        // }
        // alert(player.fullscreen());
        // player.fullscreen(false)
        // document.getElementsByTagName('video')[0].webkitExitFullscreen();
        // document.getElementsByTagName('video')[0].webkitEnterFullScreen();
        // document.getElementsByTagName('video')[0].webkitEnterFullScreen()
      })
      that.$('.vcp-player').height(window.screen.height)
      that.$('.vcp-player video').height(window.screen.height)
    }
  },
  props: {
    title: String
  },
  data () {
    return {
      showTitle: false,
      contentTop: '',
      videoBoxHeight: '100%',
      contentHeight: ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #video-container {
    width: 100%;
    /* height: 5.4rem; */
  }
  .title-bar {
    position: absolute;
    top: 0;
    width: 100%;
    background-color: #333;
    height: 54px;
    z-index: 100;
    color: #fff;
    font-size: 18px;
    text-align: center;
    line-height: 64px;
  }
  .content {
    position: relative;
    width: 100%;
    background-color: #f5f5f5;
  }
</style>
