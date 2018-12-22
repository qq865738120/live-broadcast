<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {
    let that = this
    this.$axios.get('/api/newmedia/mobile/live/addAccessTotal.action', { params: { liveTitleId: that.$store.state.liveTitleId } })
  }
}
</script>

<style>
  #app {
    width: 100%;
    height: 100%;
    background-color: $--color-333
  }
</style>
