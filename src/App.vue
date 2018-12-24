<template>
  <div id="app">
    <transition
      enter-active-class="animated zoomIn faster"
      leave-active-class="animated zoomOut faster">
      <router-view  v-show="$store.state.initFag"/>
    </transition>
    <transition
      enter-active-class="animated zoomIn faster"
      leave-active-class="animated zoomOut faster">
      <div class="com-flex-center loading" v-show="!$store.state.initFag">
        <GridLoader color="#ED7E00" size="10"></GridLoader>
      </div>
    </transition>
  </div>
</template>

<script>
import { GridLoader } from '@saeris/vue-spinners'

export default {
  name: 'App',
  created() {
    let that = this
    this.$axios.get('/api/newmedia/mobile/live/addAccessTotal.action', { params: { liveTitleId: that.$store.state.liveTitleId } })
  },
  components: {
    GridLoader
  }
}
</script>

<style>
  #app {
    width: 100%;
    height: 100%;
    background-color: $--color-333
  }
  .loading {
    width: 100%;
    height: calc(100% - 50px);
  }
</style>
