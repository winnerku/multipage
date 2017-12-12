<template>
  	<section class="pro_tab">
      	<div class="tab">
      		<a href="javascript:;" :class="active?'active':''" @click="showDetail=true;active=true">商品详情</a>
      		<a href="javascript:;" :class="active?'':'active'" @click="showDetail=false;active=false">购物说明</a>
      	</div>
      	<div v-show="showDetail" class="detail" v-html="proInfo.description">
      	</div>
      	<div v-show="!showDetail" class="notes" v-html="proInfo.sellerDesc">
      	</div>
    </section>
</template>
<style lang="css" scoped>
	@import './pro_tab.css'
</style>
<script>
export default {
	name:'pro_tab',
	props:{
		proInfo:{
		    type:Object,
	        default(){
	        	return {};
	        }
	    }
	},
    data () {
	    return {
	      	showDetail:true,
			active:true,
	      	shopNotes:''
	    }
    }
}
</script>