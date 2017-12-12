<template>
  	<section class="buy_bottom">
    	<div class="kefu_logo left" v-if="logoShow">
    		<a :href="'tel:'+limitData.sellerTel"><img src="./imgs/kefu.png"></a>
			<section class="collect_icon">
	    		<x-icon type="ios-heart-outline" size="30" @click="ajaxCollect" v-if="!collected"></x-icon>
    			<x-icon type="ios-heart" size="30" v-if="collected" @click="cancelCollect"></x-icon>
	    		<div class="vux-popover" v-show="isCollected">
	    			<div class="vux-popover-arrow vux-popover-arrow-down"></div>
					<div class="popover-demo-content">
		        		{{ collecteText }}
		        	</div>
	        	</div>
			</section>
		</div>
    	<div class="left stages">月供: <span class="money">{{limitData.monthPayments}}</span>元*<span class="number">{{limitData.months}}</span>期<span style="font-weight: bold">起</span></div>
    	<div class="right buy_btn"><a href="javascript:;" class="comfire_btn" @click="callBack">确认购买</a></div>
    </section>
</template>
<style lang="css" scoped>
	@import './buy_bottom.css'
</style>
<script>
export default {
	name:'buy_bottom',
	props:{
		logoShow:{
			type:Boolean,
			default:true
		},
		callBack:{
			type:Function,
			default(){
			}
		},
		limitData:{
			type:Object,
			default(){
				return {}
			}
		},
	},
    data () {
	    return {
	      	isCollected:false,
	      	collected:true,
	      	eventFinish:true,
	      	collecteText:'已为您收藏'
	    }
    },
    watch:{
    	limitData(newValue,oldValue){
    		this.$data.collected = newValue.isCollected;
    	}
    },
    methods:{
    	cancelCollect (){
    		var vm = this;
    		if(vm.eventFinish){
    			vm.eventFinish = false;
	    		$.ajax({
			      	url: '/collect/cancel',
			      	type: 'post',
			      	contentType:'application/json',
			      	dataType: 'json',
			      	data: JSON.stringify({"skuId":parseInt(vm.$parent.productSkuId)}),
			      	success:function(data){
			      		if(data.responseContent){
				    		vm.collected = false;
			      		}else{
			      			vm.collecteText = data.responseMessage;
			      			vm.isCollected = true;
			    			setTimeout(()=>{
			    				vm.isCollected = false;
			    			},2000)
			      		}
		    			vm.eventFinish = true;
			      	},
			      	error:function(data){
			      	}
			    })
    		}
    	},
    	ajaxCollect (){
    		var vm = this;
    		if(!vm.limitData.loginStatus){
    			window.location.href = 'https://ac.ppdai.com/User/Login?redirect='+location.href;
    			return;
    		}
    		if(vm.eventFinish){
    			vm.eventFinish = false;
    			$.ajax({
			      	url: '/collect/create',
			      	type: 'post',
			      	contentType:'application/json',
			      	dataType: 'json',
			      	data: JSON.stringify({"skuId":parseInt(vm.$parent.productSkuId)}),
			      	success:function(data){
			      		if(data.responseContent){
				      		vm.collecteText = '已为您收藏';
				    		vm.collected = true;
			      		}else{
			      			vm.collecteText = data.responseMessage;
			      		}
		    			vm.eventFinish = true;
			        	vm.isCollected = true;
		    			setTimeout(()=>{
		    				vm.isCollected = false;
		    			},2000)
			      	},
			      	error:function(data){
			      	}
			    })
    		}
    	}
    }
}
</script>