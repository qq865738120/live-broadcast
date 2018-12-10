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
      listener: function (msg) {
        for(let i=0; i<10; i++) {
          console.log();
        }
        console.log(msg);
      }
    })
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
