<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted() {

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
