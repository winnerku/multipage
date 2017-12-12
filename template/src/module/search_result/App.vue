<template>
  <div id="app">
    <mall-top></mall-top>
    <up-load :option="option"></up-load>
  </div>
</template>

<script>
  import MallTop from 'components/mall_top_search/mall_top_search'
  import upLoad from 'components/upLoad/upLoad'
  var urlHash = window.location.hash.split("#").pop();
  urlHash = decodeURI(urlHash);
  const option = {
    upLoadUrl:'/product/searchPro',
    isHash:true,
    data:{"name":urlHash}
  };
  export default {
    name: 'app',
    data () {
        return {
          option:option,
        }
    },
    components: {
      MallTop,
      upLoad
    }
  }
</script>

<style>
  @import './search_result.css'
</style>
