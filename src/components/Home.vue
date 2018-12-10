<template>
  <div>
    <Video></Video>
  </div>
</template>

<script>
import Video from '@/components/Video'

export default {
  name: 'Home',
  mounted() {
    
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  components: {
    Video
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
