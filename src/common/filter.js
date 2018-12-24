import Vue from 'vue'
import utils from '@/common/utils.js'

Vue.filter('money', function(val) {
  return utils.formateMoney(val)
})
