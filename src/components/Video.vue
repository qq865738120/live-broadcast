<template>
  <div id="video-container">
    <div class="test">
      666
    </div>
  </div>
</template>

<script>
var tcPlayer = require('@/common/tc-player.js');

export default {
  name: 'Video',
  mounted() {
    let player = new tcPlayer.TcPlayer.TcPlayer('video-container', {
      mp4: 'https://1256993030.vod2.myqcloud.com/d520582dvodtransgzp1256993030/7732bd367447398157015849771/v.f30.mp4',
      live: false,
      width: '480',
      height: '320',
      x5_type: 'h5',
      x5_fullscreen: 'true',
      listener: function (msg) {
        console.log(msg);
      }
    })
    this.$('.vcp-player').css("background","red");
    console.log();
  },
  data () {
    return {

    }
  },
  components: {

  },
  methods: {
    playcontr() {
          console.log('666');
      document.getElementById('videoALL');

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .test {
    position: absolute;
    top: 100px;
    color: #fff;
    z-index: 1
  }
</style>
