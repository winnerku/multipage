<template>
  <div id="app">
    <mall-top></mall-top>
    <collect-list :option="option"></collect-list>
  </div>
</template>

<script>
  import MallTop from 'components/mall_top_three/mall_top_three'
  import CollectList from 'components/collect_list/collect_list'
  const option = {
    upLoadUrl:'/collect/getCollectList'
  };
  export default {
    name: 'app',
    data () {
        return {
          option:option
        }
    },
    components: {
      MallTop,
      CollectList
    }
  }
</script>

<style>
  @import './my_collected.css'
</style>
