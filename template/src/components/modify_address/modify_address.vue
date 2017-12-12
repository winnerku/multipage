<template>
  	<section class="modify_address">
    	<div class="title" v-show="titleShow">编辑地址</div>
    	<group>
    		<x-input title="姓名" name="username" placeholder="请输入姓名" is-type="china-name" v-model="userInfo.consignee"></x-input>
      		<x-input title="手机号码" name="mobile" placeholder="请输入手机号码" keyboard="number" is-type="china-mobile" v-model="userInfo.mobile"></x-input>
      		<x-address v-if="showAddress" :title="provinceTitle" v-model="provinceValue" raw-value :list="provinceList" @on-show="AddressShow" @on-hide="AddressChoosed"></x-address>
      		<input type="hidden" name="" :value="provinceValue">
      		<popup-picker :title="loadTitle" :data="loadList" v-model="loadValue" @on-hide="LoadChoosed" :placeholder="请选择"></popup-picker>
      		<x-textarea :max="200" name="detail" placeholder="请填写详细地址" v-model="detailAddressValue" :show-counter="false"></x-textarea>
    	</group>
    	<!-- <ppd-button :callBack="save" :buttonName="saveTxt" :showLoading="showLoading" v-if="showBtn"></ppd-button> -->
    	<ppd-button :callBack="showMsgDialog" :buttonName="saveTxt" :showLoading="showLoading" v-if="showBtn"></ppd-button>
		<toast v-model="showAjaxFail" type="text" :time="1000" is-show-mask :text="errorText" position="middle"></toast>
		<confirm v-model="bindMobileDialog" title="手机绑定" @on-confirm="bindMobile" confirm-text="去拨打">
	      <p class="">您好，您暂未绑定手机号，请拨打400电话绑定<a href="tel:400-184-8888" class="none callKefu"></a></p>
	    </confirm>
		<confirm v-model="sendMsgDialog" title="手机短信验证" @on-confirm="save" @on-cancel="msgCode='';" :onConfirmClose="false">
	      	<div class="sendMsg_content">
	      		<div v-show="showSendSuc">已向你的手机<span style="color: #0abfff">{{userMobile}}</span>发送验证码</div>
	      		<input type="text" class="msgCode" v-model="msgCode" placeholder="请输入验证码">
	      		<a href="javascript:;" @click="sendMsg" class="sendBtn">{{BtnValue}}</a>
	      		<div class="valideFail" v-show="showValideFail">验证码输入错误，请重新输入</div>
      		</div>
	    </confirm>
	    <div class="loading" v-show="loadShow"><i class="weui-loading" style="margin-top:40%;"></i></div>
    </section>
</template>
<style lang="css" scoped>
	@import './modify_address.css'
</style>
<script>
import {XAddress, Group, ChinaAddressV3Data, PopupPicker,XTextarea, XInput, Toast} from 'vux'
import PpdButton from 'components/button/button'
import { Confirm } from 'vux'
var provinceArray = [],provinceIdArray=[],loadData = {},saveAjaxUrl;
export default {
	name:'modify_address',
	props:{
		titleShow:{
			type:Boolean,
			default:true
		},
		showBtn:{
			type:Boolean,
			default:true
		}
	},
    data () {
	    return {
	    	showAddress:false,
	    	showLoading:false,
	    	showAjaxFail:false,
	    	hasLoadData:false,
	    	sendMsgDialog:false,
	    	showSendSuc:false,
	    	loadShow:false,
	    	showValideFail:false,
	    	bindMobileDialog:false,
	    	userMobile:'',
	    	BtnValue:'发送验证码',
	    	errorText:'接口请求错误',
	        provinceTitle: '所在地址',
	        provinceValue:[],
      		provinceList: [],
      		loadTitle:'所在街道',
      		loadList: [],
      		loadValue:[],
      		loadId:'',
      		addressId:'',
      		msgCode:'',
      		userInfo:{},
      		detailAddressValue:'',
      		saveTxt:'保存',
	    }
    },
    created(){
      var vm = this;
      vm.AddrSession();
      $.ajax({
          	url: '/address/getAddress',
          	type: 'get',
          	contentType:'application/json',
      		dataType: 'json',
          	success:function(data){
          		if(data.responseContent.length>0){
          			saveAjaxUrl = "/address/updateUserAddress";
		          	vm.userInfo = data.responseContent[0];
		          	vm.loadValue.push(data.responseContent[0].townName);
		          	vm.loadId = data.responseContent[0].townId;
		          	vm.addressId = data.responseContent[0].id;
		          	vm.detailAddressValue = data.responseContent[0].addressDetails;
		          	provinceArray.push(data.responseContent[0].provinceName)
		          	provinceArray.push(data.responseContent[0].cityName)
		          	provinceArray.push(data.responseContent[0].areaName)
		          	provinceIdArray.push(data.responseContent[0].provinceId)
		          	provinceIdArray.push(data.responseContent[0].cityId)
		          	provinceIdArray.push(data.responseContent[0].areaId)
		          	vm.changeData();
		          	vm.AddressChoosed('firstLoad');
          		}else{
          			saveAjaxUrl = "/address/saveUserAddress";
          		}
          	},
          	error:function(data){

          	}
        })
    },
    components: {
	    Group,
	    PopupPicker,
	    XTextarea,
	    XAddress,
	    PpdButton,
	    XInput,
	    Toast,
	    Confirm
	},
	methods: {
		AddrSession(){
			var storage,addressList,vm = this;
			// if(window.localStorage){
				storage = window.localStorage;
			// 	if(storage.getItem('Address')){
					storage.removeItem('Address');
			// 		vm.provinceList = JSON.parse(storage.Address);
			// 	}else{
					$.get('/address/getThreeLayerBaseAddress',function(data){
						addressList = data.responseContent.userAddressList;
						vm.provinceList = addressList;
						vm.showAddress = true;
						// addressList = JSON.stringify(addressList);
						// storage.setItem('Address',addressList);
					})
			// 	}
			// }else{
			// 	$.get('/address/getThreeLayerBaseAddress',function(data){
			// 		addressList = data.responseContent.userAddressList;
			// 		vm.provinceList = addressList;
			// 		storage.setItem('Address',addressList);
			// 	})
			// }
		},
		changeData () {
	      this.provinceValue = provinceArray;
	    },
	    showMsgDialog(){
			this.getUserMobile();
	    },
	    bindMobile(){
	    	document.querySelector('.callKefu').click();
	    },
	    getUserMobile(){
	    	var vm = this;
	    	vm.loadShow = true;
	    	$.ajax({
		      	url: '/user/getUserMobile',
		      	type: 'get',
		      	contentType: 'application/json',
		      	dataType: 'json',
		      	success: function(data) {
		      		if(data.code==1){
		        		vm.userMobile = data.content.mobile;
						vm.sendMsgDialog = true;
						// vm.bindMobileDialog = true;
		      		}else{
		      			vm.errorText = data.message;
	          			vm.showAjaxFail = true;
		      		}
		      	},
		      	error: function(data) {
	          		vm.errorText = '获取用户手机号失败，请重试';
	          		vm.showAjaxFail = true;
		      	},
	          	complete:function(){
		      		vm.$data.saveTxt = '保存';
		      		vm.loadShow = false;
		      	}
		    })
	    },
	    sentVerifyCode(){
	    	//发送验证码
	    	var vm = this;
		    $.ajax({
		      	url: '/sms/sentVerifyCode',
		      	type: 'post',
		      	contentType: 'application/json',
		      	dataType: 'json',
		      	success: function(data) {
		      		if(data.code==1){
		        		vm.showSendSuc = true;
		      		}else{
		      			vm.errorText = data.message;
	          			vm.showAjaxFail = true;
		      		}
		      	},
		      	error: function(data) {
	          		vm.errorText = '发送验证码失败';
	          		vm.showAjaxFail = true;
		      	}
		    })
	    },
	    sendMsg(){
	    	var vm = this;
	    	let countNum = 60;
	    	if(vm.BtnValue!='发送验证码'&&vm.BtnValue!='重新发送')return;
	    	vm.sentVerifyCode();
	    	vm.BtnValue = '重新发送('+countNum+'s)';
	    	document.querySelector('.sendBtn').setAttribute('class','sendBtn unable');
	    	var countSec = setInterval(()=>{
	    		countNum--;
	    		vm.BtnValue = '重新发送('+countNum+'s)';
	    		if(countNum==0){
	    			clearInterval(countSec);
	    			vm.BtnValue = '重新发送';
	    			document.querySelector('.sendBtn').setAttribute('class','sendBtn');
	    		}
	    	},1000)
	    },
	    MsgTrue(){
	    	var vm = this;
	    	$.ajax({
		      	url: '/sms/checkVerifyCode',
		      	type: 'post',
		      	contentType: 'application/json',
		      	dataType: 'json',
		      	data:JSON.stringify({"inputCode":vm.msgCode}),
		      	success: function(data) {
		      		if(data.code==1){
		        		vm.save();
		      		}else{
		      			vm.showValideFail = true;
				    	setTimeout(()=>{
				    		vm.showValideFail = false;
				    	},2000)
		      		}
		      	},
		      	error: function(data) {
	          		vm.errorText = '验证码校验失败';
	          		vm.showAjaxFail = true;
		      	}
		    })
	    },
		save(){
			var vm = this;
			vm.sendMsgDialog = false;
			vm.detailAddressValue = vm.detailAddressValue.replace(/(^\s*)|(\s*$)/g, "");
			if(vm.hasLoadData&&(vm.loadId==0||vm.loadId==undefined)){
				vm.errorText = '请选择所在街道';
      			vm.showAjaxFail = true;
      			vm.msgCode = '';
      			return;
			}
			if(vm.detailAddressValue==""){
				vm.errorText = '详细地址不能为空';
				vm.showAjaxFail = true;
				vm.msgCode = '';
      			return;
			}
			if(isNaN(vm.msgCode.replace(/(^\s+)|(\s+$)/g, ""))){
				vm.errorText = '验证码必须是数字';
				vm.showAjaxFail = true;
				vm.msgCode = '';
      			return;
			}
	    	vm.$data.showLoading = true;
	        vm.$data.saveTxt = '提交中';
	        var postData = vm.postData();
	        $.ajax({
	          	url: saveAjaxUrl,
	          	type: 'post',
	          	contentType:'application/json',
	      		dataType: 'json',
	      		data:JSON.stringify(postData),
	          	success:function(data){
	          		vm.$data.showLoading = false;
	       		    vm.$data.saveTxt = '保存';
	       		    if(data.responseContent){
	       		    	// window.location.href='/user/myaddress'
	       		    	ga("send", "event","buy-Process","click","地址修改");
	       		    	setTimeout(()=>{
	       		    		// window.history.back();
	       		    		self.location=document.referrer;//返回上一页并刷新
	       		    	},200)
	       		    }else{
	       		    	vm.errorText = data.responseMessage;
	       		    	vm.showAjaxFail = true;
	       		    }
	          	},
	          	error:function(data){
	          		vm.$data.showLoading = false;
	          		vm.errorText = '接口请求错误';
	          		vm.showAjaxFail = true;
	          	},
	          	complete:function(){
		      		vm.msgCode = '';
		      		vm.$data.saveTxt = '保存';
		      	}
	        })
        },
        postData () {
        	var vm =this;
        	var postData = {};
        	postData.addressDetails=vm.detailAddressValue;
        	postData.provinceId=vm.provinceValue[0];
        	postData.cityId=vm.provinceValue[1];
        	postData.areaId=vm.provinceValue[2];
        	postData.townId=vm.loadId;
        	postData.id=vm.addressId;
        	postData.consignee=vm.userInfo.consignee;
        	postData.mobile=vm.userInfo.mobile;
        	postData.inputCode=vm.msgCode.replace(/(^\s+)|(\s+$)/g, "");
        	return postData;
        },
	    AddressShow () {
	    	var vm = this;
	      	// vm.loadValue.pop();//不能触发视图的更新，废除，使用$set方法
	      	vm.$set(vm.loadValue,0,'');
	      	vm.loadId = 0;
	    },
	    LoadChoosed (type) {
	    	var vm = this;
	    	vm.loadId = loadData[vm.loadValue[0]];
	    },
    	AddressChoosed (isFirst) {
	      	var vm = this;
	      	// var target = window.event.target;
	      	// if(target.innerHTML=='取消')return;
	      	vm.hasLoadData = false;
	      	setTimeout(function(){
		      	var parentId = vm.provinceValue[2];
		      	if(isFirst=='firstLoad'){
		      		parentId = provinceIdArray[2]
		      	}
		      	var loadList = [];
		      	vm.loadList.pop();
		      	$.ajax({
		          	url: '/address/getAddressByParentId?parentId='+parentId,
		          	type: 'get',
		          	contentType:'application/json',
		      		dataType: 'json',
		          	success:function(data){
			          	let date = data.responseContent;
			          	if(date.length>0){
			          		vm.hasLoadData = true;
			          		$.each(date,function(key,val){
			          			loadList.push(val.addressName);
			          			loadData[val.addressName] = val.addressId
			          		});
			          		vm.loadList.push(loadList)
			          	}else{
			          		loadData={};
			          		vm.loadValue=[];
			          		vm.errorText = '该地区暂无街道数据';
	          				vm.showAjaxFail = true;
			          	}
		          	},
		          	error:function(data){
		          		vm.errorText = '获取街道数据错误';
	          			vm.showAjaxFail = true;
		          	}
		        })
	      	},200)
	    }
	}
}
</script>