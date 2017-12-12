<template>
  	<section class="myAddress">
    	<div class="title" v-show="titleShow">我的地址</div>
    	<div class="address_info" v-for="item in addressInfo">
	      	<div class="user_info">
	        	<span class="name">{{item.consignee}}</span><span class="phone">{{item.mobile}}</span>
	      	</div>
          	<div class="address">
            	<div class="text">{{item.fullAddress}}</div>
          	</div>
      	</div>
    </section>
</template>
<style lang="css" scoped>
	@import './myAddress.css'
</style>
<script>
export default {
	name:'myAddress',
	props:{
		titleShow:{
			type:Boolean,
			default:true
		},
		addressInfo:{
			type:Array,
			default(){
				return [];
			}
		}
	}
}
</script>