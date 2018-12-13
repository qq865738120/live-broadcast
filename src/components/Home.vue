<template>
  <div>
    <Video>
      <Tab
        v-model="tabIndex"
        prevent-default
        active-color="#ED7E00"
        @on-before-index-change="switchTabItem"
        :line-width="2">
        <TabItem v-for="item in tabItems" :key="item.id">{{ item.text }}</TabItem>
      </Tab>
    </Video>
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
      tabIndex: 0, //tab栏索引，切换tabItem
      tabItems: [
        { id: 0, text: '互动' },
        { id: 1, text: '详情' },
        { id: 2, text: '成交' },
        { id: 3, text: '简介' },
        { id: 4, text: '自定义' },
      ] //
    }
  },
  components: {
    Video
  },
  methods: {
    switchTabItem(index) {
      console.log('切换tab栏：', this.tabItems[index])
      this.$vux.loading.show({
        text: 'loading'
      })
      setTimeout(() => {
        this.$vux.loading.hide()
        this.tabIndex = index
      }, 300)
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
