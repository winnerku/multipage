<template>
  <section class="mall_top_search">
    <a href="javascript:history.back(-1)" class="inline back" v-if="!PPDWebUI.os.inApp"><img src="./imgs/back.png"></a>
    <div class="inline search" :style="PPDWebUI.os.inApp?'width:88%':''">
      <form v-on:submit.prevent="onSubmit">
        <label><input type="search" v-model="product_name" class="product_name"><a :href="'/search#'+product_name"><img src="./imgs/search.png"></a></label>
      </form>
    </div>
    <template v-if="PPDWebUI.os.inApp">
      <a href="javascript:;" @click="goHome"><div class="inline category_logo"><img src="./imgs/index.png"></div></a>
    </template>
    <template v-else>
      <a href="/"><div class="inline category_logo"><img src="./imgs/index.png"></div></a>
    </template>
  </section>
</template>
<style lang="css" scope>
  @import './mall_top_search.css'
</style>
<script>
var pageIndex = 1,pageSize = 10;
export default {
  name: 'mall_top_search',
  props:{
  },
  data () {
    return {
      product_name:'',
      loadShow:false,
      searchDate:[],
      PPDWebUI:PPDWebUI
    }
  },
  created(){
    var url_hash = window.location.hash.split("#").pop();
    url_hash = decodeURI(url_hash);
    this.product_name = url_hash;
  },
  methods:{
    onSubmit(){
      var vm = this;
      window.location.hash = vm.product_name;
    },
    goHome(){
      PPDWebUI.CommonService.goHome({path:"home/2"},function(data){
        log('返回首页成功')
      },function(error){
        log('返回首页失败')
      });
    }
  }
}
</script>