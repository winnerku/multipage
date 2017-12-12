<template>
  	<section class="SmsVerify">
    	<div class="dialog">
	      	<div class="mask"></div>
		    <div class="cate_content" v-show="step=='first'">
				<div class="title">短信验证</div>
				<div class="sendMsg_content">
		          	<div class="bankMobile">银行预留手机号<span style="color: #0abfff">{{userMobile}}</span></div>
		          	<label style="position: relative">
		          		<input type="text" class="msgCode" v-model="msgCode" placeholder="请输入验证码" @input="codeValid">
		          		<a href="javascript:;" @click="sendMsg" class="sendBtn">{{BtnValue}}</a>
	          		</label>
		        </div>
		        <button href="javascript:;" class="buy_btn" :disabled="canBuy?false:true" @click="buyConfirm">确认购买</button>
		        <a href="javascript:;" @click="dialogClose" class="dialogClose">×</a>
		    </div>
		    <div class="cate_content animate" v-show="step=='second'">
		    	<img src="https://loanm.ppdaicdn.com/PPdaiStore/static/common/imgs/imgLoading.gif" class="reqing">
		    </div>
		    <div class="cate_content animate" v-show="step=='third'">
		    	<div class="paySuc">
					<icon type="success" is-msg>#0abfff</icon>
		    		<p>付款成功</p>
		    	</div>
		    </div>
	    </div>
	    <toast v-model="showAjaxFail" type="text" :time="800" is-show-mask :text="errorText" position="middle"></toast>
    </section>
</template>
<style lang="css" scoped>
	@import './SmsVerify.css'
</style>
<script>
import { Icon,Toast } from 'vux'
var loopNum = 0;
export default {
	name:'SmsVerify',
	props:{
		reqUrl:'',
		userMobile:'',
		postData:{
			type:Object,
	        default(){
	            return {};
	        }
		}
	},
    data () {
	    return {
	      canBuy:false,
	      step:'first',
	      BtnValue:'发送验证码',
	      errorText:'接口请求错误',
	      msgCode:'',
	      showAjaxFail:false,
	    }
    },
	methods: {
		dialogClose(){
	      	var vm = this;
	      	// document.querySelector(".dialog").style.display='none';
	      	document.querySelector(".cate_content").setAttribute('class','cate_content');
	      	vm.$parent.showSmsVerify = false;
	    },
	    codeValid(){
    		this.canBuy = this.msgCode==''?false:true;
	    },
	    getPayStatus(){
	        var vm = this;
	        loopNum++;
	        vm.$ajax.post('/order/payStatus',{orderNo:vm.postData.orderNo})
	        .then(response=>{
	          let data = response.data.content;
	          if(loopNum>5){
	          	vm.errorText='支付结果确认中，请留意';
	          	vm.showAjaxFail=true;
	          	setTimeout(()=>{
	          		window.location.href='/user/myorder';
	          	},1000)
	          }
	          if(data.payCode==1000){
	            window.location.href='/user/myorder';
	          }
	        })
	        .catch(response=>{vm.errorText='订单状态验证错误';vm.showAjaxFail=true});
      	},
	    sendMsg(){
	        var vm = this;
	        let countNum = 60;
	        if(vm.BtnValue!='发送验证码'&&vm.BtnValue!='重发')return;
	        if(vm.BtnValue!='发送验证码')vm.sentVerifyCode();
	        vm.BtnValue = '重发('+countNum+'s)';
	        document.querySelector('.sendBtn').setAttribute('class','sendBtn unable');
	        var countSec = setInterval(()=>{
	          countNum--;
	          vm.BtnValue = '重发('+countNum+'s)';
	          if(countNum==0){
	            clearInterval(countSec);
	            vm.BtnValue = '重发';
	            document.querySelector('.sendBtn').setAttribute('class','sendBtn');
	          }
	        },1000)
      	},
      	sentVerifyCode(){
	        //发送验证码
	        var vm = this;
	        vm.$ajax.post(vm.reqUrl,vm.postData)
	        .then(response=>{
	          let data = response.data;
	          console.log(data)
	        })
	        .catch(response=>{vm.errorText='验证码发送错误';vm.showAjaxFail=true});
      	},
      	buyConfirm(){
      		var vm = this;
      		vm.step = 'second';
	        vm.$ajax.post('/order/quickConfirm',{orderNo:vm.postData.orderNo,verifyCode:vm.msgCode})
	        .then(response=>{
	          let data = response.data.content;
	          if(data.payCode==1000){
	          	vm.step = 'third';
	          	setTimeout(()=>{
	          		window.location.href="/user/myorder";
	          	},1000)
	          }else if(data.payCode==2000){
	          	vm.errorText='银行卡支付失败';
	          	vm.showAjaxFail=true;
	          	setTimeout(()=>{
	          		vm.$parent.showSmsVerify = false;
	          	},1000)
	          }else if(data.payCode==4000){
	          	setInterval(vm.getPayStatus,2000)
	          }
	        })
	        .catch(response=>{vm.errorText='验证码发送错误';vm.showAjaxFail=true});
      	}
	},
	components: {
	    Icon,
	    Toast
  	},
	mounted(){
		var vm = this;
		setTimeout(()=>{
			document.querySelector(".cate_content").setAttribute('class','cate_content animate');
			vm.sendMsg();
		},200)
		// vm.msgCode = screen.availHeight;
		// window.onresize = function() {
		// 	vm.msgCode = screen.availHeight;
	 //    };
	}
}
</script>