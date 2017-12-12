<template>
  	<section class="confirm_bottom">
    	<!-- <div class="left stages">月供: <span class="money">{{limitData.monthPayments}}</span>元*<span class="number">{{limitData.months}}</span>期</div> -->
    	<div class="left stages">月供: <span class="money">{{limitData.periodInfo.monthPayments}}</span>元*
	    	<select class="payMonth" v-model="payMonthValue">
                <template v-for="item in limitData.periodNums">
                    <option :value="item">{{item}}期</option>
                </template>
	    	</select>
    	</div>
    	<div class="left introForMonthpay">
    		<a href="javascript:;" @click="introduceEvent"><img src="../../common/imgs/iconForMonthpay.png"></a>
    		<div class="vux-popover" v-show="introForMonthpay">
    			<div class="vux-popover-arrow vux-popover-arrow-down"></div>
				<div class="popover-demo-content">
	        		“XX月供起”为魔镜计算最低月供，信誉越好月供就越少哦！实际月供请以订单确认页月供为准~
	        	</div>
        	</div>
    	</div>
    	<div class="right buy_btn"><a href="javascript:;" :class="buttonText=='缺货'?'comfire_btn disabled':'comfire_btn'" @click="callBack">{{buttonText}}</a></div>
    </section>
</template>
<style lang="css" scoped>
	@import './confirm_bottom.css'
</style>
<script>
export default {
	name:'confirm_bottom',
	props:{
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
		buttonText:'',
        periodNum:''
	},
    data () {
	    return {
	    	introForMonthpay:false,
	    	payMonthValue:this.$props.periodNum
	    }
    },
    watch:{
    	payMonthValue(val,oldVal){
    		this.$parent.periodNum = val;
    		this.$parent.getDownPayInfo();
    	}
    },
    methods:{
    	introduceEvent(){
    		this.introForMonthpay = !this.introForMonthpay;
    		setTimeout(()=>{
    			this.introForMonthpay = false;
    		},2000)
    	}
    }
}
</script>