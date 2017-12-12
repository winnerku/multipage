<template>
  <div id="app">
    <mall-top></mall-top>
    <div class="pay_confirm">请选择支付方式</div>
    <pay-type :orderNo="defPay.orderNo"></pay-type>
    <ppd-button :callBack="toPay" buttonName="确认支付"></ppd-button>
    <sms-verify v-if="showSmsVerify" :reqUrl="reqUrl" :postData="defPay" :userMobile="userMobile"></sms-verify>
    <!-- <confirm v-model="sendMsgDialog" title="手机短信验证" @on-confirm="save" @on-cancel="msgCode='';" :onConfirmClose="false">
        <div class="sendMsg_content">
          <div v-show="showSendSuc">已向你的手机<span style="color: #0abfff">{{userMobile}}</span>发送验证码</div>
          <input type="text" class="msgCode" v-model="msgCode" placeholder="请输入验证码">
          <a href="javascript:;" @click="sendMsg" class="sendBtn">{{BtnValue}}</a>
          <div class="valideFail" v-show="showValideFail">验证码输入错误，请重新输入</div>
        </div>
    </confirm> -->
    <confirm v-model="payConfirm" title="支付确认" @on-confirm="completePayment" confirm-text="已完成支付">
      <p class="tip_text">1.请在微信内完成支付，如您已支付成功，请点击“已完成支付”按钮。<br>2.如您不想通过微信支付，请点击“取消”按钮，并通过其他支付方式付款</p>
    </confirm>
    <confirm v-model="failDialog"
      @on-confirm="reCharge">
      <p class="tip_text">您的额度不足，请充值<span class="still_money">{{still_money}}</span>元。</p>
    </confirm>
    <toast v-model="showAjaxFail" type="text" :time="2000" is-show-mask :text="errorText" position="middle"></toast>
    <toast v-model="paySuccess" type="success" :time="1100" is-show-mask text="支付成功" position="middle"></toast>
    <loading v-model="loadShow" text="付款中" class="ajaxLoading"></loading>
  </div>
</template>

<script>
  import MallTop from 'components/mall_top_three/mall_top_three'
  import PayType from 'components/payType/payType'
  import PpdButton from 'components/button/button'
  import SmsVerify from 'components/SmsVerify/SmsVerify'
  import { Confirm,Loading,Toast } from 'vux'
  var orderNo = window.location.href.split("pay").pop().split('/').pop().split('?').shift();
  var prePayType = window.location.href.split("module").pop().split('/').pop().split('?').pop().split('=').pop();
  export default {
    name: 'app',
    data () {
      return {
        loadShow:false,
        paySuccess:false,
        payMonthLoading:false,
        showAjaxFail:false,
        sendMsgDialog:false,
        payConfirm:false,
        showSendSuc:false,
        showSmsVerify:false,
        failDialog:false,
        still_money:'',
        userMobile:'',
        reqUrl:'/order/pay',
        defPay:{orderNo:orderNo},
        errorText:'接口请求错误',
        BtnValue:'发送验证码',
      }
    },
    created(){
      var vm = this;
      if(prePayType==3){
        vm.getPayStatus();
      }
    },
    methods:{
      toPay(){
        var vm = this;
        if(vm.defPay.payId==undefined){
          vm.errorText='请绑卡或选择一种支付方式';
          vm.showAjaxFail=true;
          return
        }
        vm.loadShow = true;
        vm.$ajax.post('/order/pay',vm.defPay)
        .then(response=>{
          vm.loadShow = false;
          let data = response.data.content;
          if(data.payCode==1000){
            window.location.href='/user/myorder';
          }else if(data.payCode==2000){
            vm.errorText=data.retValue;
            vm.showAjaxFail=true;
            setTimeout(()=>{
              window.location.reload();
            },1500)
          }else if(data.payCode==2001){
            vm.still_money = data.retValue;
            vm.failDialog = true;
          }else if(data.payCode==3000){
            if(data.payType==2){
              vm.showSmsVerify = true;
              vm.userMobile = data.retValue;
            }else if(data.payType==3){
              vm.payConfirm = true;
              window.location.href = data.retValue;
            }
          }else if(data.payCode==4000){
            vm.errorText=data.retValue;
            vm.showAjaxFail=true;
            window.location.href = '/user/myorder';
          }
        })
        .catch(response=>{vm.errorText='支付错误';vm.showAjaxFail=true});
      },
      completePayment(){
        //调取支付状态查询接口，如果确认支付，则跳转我的订单页
        this.getPayStatus();
      },
      reCharge () {
        var vm = this;
        let localUrl = window.location.href;
        //日志埋点
        ga("send", "event","buy-Process","click","去充值");
        vm.$ajax.post('/remark/addRecharge',{"type":1,"orderId":vm.orderId})
        .then(response=>{})
        .catch(response=>{});
        setTimeout(()=>{
          window.location.href = 'http://wappay.ppdai.com?callbackUrl='+localUrl;//跳转充值页面
        },200)
      },
      getPayStatus(){
        var vm = this;
        vm.$ajax.post('/order/payStatus',{orderNo:vm.defPay.orderNo})
        .then(response=>{
          let data = response.data.content;
          if(data.payCode==1000){
            window.location.href='/user/myorder';
          }
        })
        .catch(response=>vm.showAjaxFail=true);
      }
    },
    components: {
      MallTop,
      Confirm,
      PayType,
      PpdButton,
      Loading,
      SmsVerify,
      Toast
    },
    mounted(){
    }
  }
</script>

<style>
  @import './pay_confirm.css'
</style>
