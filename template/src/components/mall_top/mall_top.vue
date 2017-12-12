<template>
  <section class="mall_top">
	<div class="inline search">
    <form v-on:submit.prevent="onSubmit">
      <label><input type="search" v-model="product_name" class="product_name"><a :href="'/search#'+product_name"><img src="./imgs/search.png"></a></label>
    </form>
	</div>
	<div class="inline user"><a href="/user/index"><!-- <img src="./imgs/user_logo.png"> -->我的</a><span v-if="showRound"></span></div>
  </section>
</template>
<style lang="css" scope>
	@import './mall_top.css'
</style>
<script>
export default {
  name: 'hello',
  data () {
    return {
      showRound:false,
      product_name:'iPhone 8'
    }
  },
  created(){
    var vm = this;
    vm.$ajax.get('/user/userTips')
    .then(response=>{
      let data = response.data.content;
      if(data){
        vm.showRound = true
      }
    })
  },
  methods:{
  	onSubmit:function(){
  		window.location.href='/search#'+this.product_name
  	}
  }
}
</script>