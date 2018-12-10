<template>
  <div id="video-container" style="margin: 0px auto;">

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
        // console.log(msg);
      }
    })
    console.log(this.$utils.driverType());
    console.log(navigator.userAgent);
    console.log(navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Adr') > -1);
  },
  data () {
    return {

    }
  },
  components: {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
