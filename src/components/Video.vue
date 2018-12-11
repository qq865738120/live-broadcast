<template>
  <div>
    <div class="title-bar" v-if="showTitle">{{ title }}</div>
    <div id="video-container"></div>
    <div class="test" @click='test'>
      666
    </div>
  </div>
</template>

<script>
var tcPlayer = require('@/common/tc-player.js');

const controlsBarH = '0.9rem';

export default {
  name: 'Video',
  mounted() {
    const that = this;
    let player = new tcPlayer.TcPlayer.TcPlayer('video-container', {
      // mp4: 'http://vjs.zencdn.net/v/oceans.mp4',
      mp4: 'http://1256993030.vod2.myqcloud.com/d520582dvodtransgzp1256993030/7732bd367447398157015849771/v.f40.mp4',
      // m3u8: 'https://logos-channel.scaleengine.net/logos-channel/live/biblescreen-ad-free/playlist.m3u8',
      // coverpic: 'https://goss1.vcg.com/creative/vcg/veer/800/new/VCG41N672909176.jpg',
      // coverpic: 'https://goss1.vcg.com/creative/vcg/800/version23/VCG21gic6409708.jpg',
      coverpic: 'https://goss2.vcg.com/creative/vcg/800/version23/VCG21gic18454706.jpg',
      autoplay: false,
      live: false,
      width: window.screen.width,
      height: window.screen.height,
      x5_type: 'h5',
      x5_fullscreen: 'true',
      listener: function (msg) {
        console.log(msg);
        if (msg.type == 'play') { //视频播放事件
          that.$data.showTitle = true;
        }
      }
    })
    this.$('.vcp-player').css("background","red");
    this.$('.vcp-player video').css("object-position","top");
    this.$('.vcp-poster-pic').removeClass('default');
    this.$('.vcp-poster-pic').css({
      "position": "absolute",
      "width": "100%",
      // "top": "1.44rem"
    });
    // this.$('.vcp-controls-panel').css('top', '5.92rem');
    this.$('.vcp-controls-panel').css('top', '4.48rem');
    this.$('.vcp-controls-panel').height(controlsBarH);
    this.$('.vcp-playtoggle').width(controlsBarH);
    this.$('.vcp-timelabel').css({
      'height': controlsBarH,
      'line-height': controlsBarH,
    });
    this.$('.vcp-fullscreen-toggle').width(controlsBarH);
    this.$('.vcp-fullscreen-toggle').height(controlsBarH);

    this.$('.vcp-player video').on("x5videoenterfullscreen", function() {
      alert('进入同层全屏播放')
    })
    this.$('.vcp-player video').on("x5videoexitfullscreen", function() {
      alert('退出同层全屏播放')
    })
  },
  data () {
    return {
      title: '标题',
      showTitle: false
    }
  },
  components: {

  },
  methods: {
    test() {
      console.log(this.$data.showTitle);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #video-container {
    width: 100%;
    height: 5.4rem;
    /* position: absolute;
    top: 5.4rem; */
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


  .test {
    position: relative;
    /* top: 54px; */
    z-index: 100;
    background-color: #fff;
    width: 200px;
    height: 100px;
  }
</style>
