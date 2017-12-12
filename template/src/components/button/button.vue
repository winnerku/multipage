<template>
  	<section class="PPD_buttom">
    	<a href="javascript:;" :class="className" @click="callBack" disabled><i class="weui-loading" v-show="showLoading"></i>{{buttonName}}</a>
    </section>
</template>
<style lang="css" scoped>
	@import './button.css'
</style>
<script>

export default {
	name:'PPD_buttom',
	props:{
		className:{
			type:String,
			default:'normal'
		},
		buttonName:{
			type:String,
			default:'保存'
		},
		showLoading:{
			type:Boolean,
			default:false
		},
		callBack:{
			type:Function,
			default(){
			}
		}
	},
    data () {
	    return {
	      
	    }
    },
	methods: {
	}
}
</script>