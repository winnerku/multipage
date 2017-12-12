<template>
  <section class="mall_top_three">
    <a :href="back" class="inline back" v-if="!PPDWebUI.os.inApp"><img src="./imgs/back.png"></a>
    <template v-if="PPDWebUI.os.inApp">
      <a href="javascript:;" @click="goHome"><div class="inline category_logo"><img src="./imgs/index.png"></div></a>
    </template>
    <template v-else>
  	  <a href="/"><div class="inline category_logo"><img src="./imgs/index.png"></div></a>
    </template>
  </section>
</template>
<style lang="css" scope>
	@import './mall_top_three.css'
</style>
<script>
export default {
  name: 'mall_top_three',
  props:{
    back:{
      type:String,
      default(){
        return 'javascript:history.back(-1)'
      }
    }
  },
  data () {
    return {
      PPDWebUI:PPDWebUI,
    }
  },
  methods:{
    goHome(){
      PPDWebUI.CommonService.goHome({path:"home/2"},function(data){
        log('返回首页成功')
      },function(error){
        log('返回首页失败')
      });
    }
  },
  mounted(){
  }
}
</script>