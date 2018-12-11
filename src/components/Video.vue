<template>
  <div>
    <div class="title-bar">{{ title }}</div>
    <div id="video-container"></div>
    <div class="test" @click='test'>
      666
    </div>
  </div>
</template>

<script>
var tcPlayer = require('@/common/tc-player.js');

export default {
  name: 'Video',
  mounted() {
    const that = this;
    const width = this.$('body').width();
    const height = this.$('body').height();
    console.log('height', height);
    let player = new tcPlayer.TcPlayer.TcPlayer('video-container', {
      mp4: 'http://vjs.zencdn.net/v/oceans.mp4',
      // mp4: 'http://1256993030.vod2.myqcloud.com/d520582dvodtransgzp1256993030/7732bd367447398157015849771/v.f40.mp4',
      // m3u8: 'https://logos-channel.scaleengine.net/logos-channel/live/biblescreen-ad-free/playlist.m3u8',
      coverpic: { style: "cover", src: 'https://surmon-china.github.io/vue-quill-editor/static/images/surmon-5.jpg' },
      autoplay: false,
      live: true,
      width: window.screen.width,
      height: window.screen.height,
      x5_type: 'h5',
      x5_fullscreen: 'true',
      listener: function (msg) {
        console.log(msg);
        // if (msg.type == 'load') {
        //   alert(that.$('video')[0].videoHeight);
        // }
        console.log(that.$('video')[0].videoHeight);
      }
    })
    this.$('.vcp-player').css("background","red");
    this.$('.vcp-player video').css("object-position","center 1.44rem");
    this.$('.vcp-player video')
    let video = this.$('video');
    console.log('videoHeight', video[0].clientHeight);
    console.log('window.screen.width', window.screen.height);
  },
  data () {
    return {
      title: '标题'
    }
  },
  components: {

  },
  methods: {
    test() {
      console.log(this.$('video')[0].videoHeight);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #video-container {
    width: 100%;
    height: 7rem;
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
    position: absolute;
    z-index: 100;
    background-color: #fff;
    width: 200px;
    height: 100px;
  }
</style>
