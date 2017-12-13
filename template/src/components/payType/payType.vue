<template>
  <section class="payType">
    <section class="chooseType" v-if="cashPay.quickPay!==undefined">
      <div :class="defPay.payType==1?'type active':'type'" v-if="listingPay!=null&&listingPay.payType!=undefined">
        <label class="type_item" @touchend="payTypeChoose(1,listingPay.periods[listingPay.periods.length-1].month)">分期购买
          <input type="radio" name="typeName" value="1" :checked="defPay.payType==1">
        </label>
        <div class="typeDetail">
          <p class="availableLimit">您的商城可用额度：<span>{{listingPay.availableAmount}}元</span></p>
          <div class="period_list">
            <template v-for="item in listingPay.periods">
              <div :class="defPay.payId==item.month?'period active':'period'" @touchend="payTypeChoose(1,item.month)">
                <p>首付￥{{item.downPayment}}</p>
                <p>￥{{item.monthPayment}}*{{item.month}}个月</p>
              </div>
            </template>
          </div>
        </div>
      </div>
      <div :class="defPay.payType!=1?'type active':'type'" v-if="cashPay!=null&&cashPay.quickPay!==undefined">
        <label class="type_item" @touchend="payTypeChoose()">全额购买
          <input type="radio" name="typeName" value="1" :checked="defPay.payType!=1">
        </label>
        <div class="typeDetail">
          <div v-if="cashPay.quickPay!==null" :class="defPay.payType==2?'bankPay active':'bankPay'" @touchend="payTypeChoose(2,223)">
            <div class="inline logo"><img :src="cashPay.quickPay.quickChannels[0].bankIconUrl"></div>
            <div class="inline bankInfo"><p>银行卡支付</p><span>招行（尾号455）</span></div>
            <div class="inline right choose"><img src="./imgs/allPay.png"></div>
          </div>
          <div v-else-if="cashPay.quickPay===null" class="toBindCard">
            您暂未绑定银行卡，<a href="https://wappay.ppdai.com/PayNew/BankListNew">去绑卡>></a>
          </div>
          <div v-if="cashPay.weChatPay!=null" :class="defPay.payType==3?'weixinPay active':'weixinPay'" @touchend="payTypeChoose(3,332)">
            <div class="inline logo"><img src="./imgs/weixin.png"></div>
            <div class="inline"><p>微信支付</p></div>
            <div class="inline right choose"><img src="./imgs/allPay.png"></div>
          </div>
        </div>
      </div>
    </section>
    <section class="payInfo" v-if="payAmount.orderAmount!=undefined">
      <p class="title">订单详情<span>请在{{payAmount.payMinutes}}分钟内完成支付</span></p>
      <div class="content">
        <div class="infoRow">订单金额<span>{{payAmount.orderAmount}}元</span></div>
        <div class="infoRow">实付金额<span>{{payAmount.payAmount}}元</span></div>
        <div class="infoRow" v-if="defPay.payType!=1">支付方式<span>全额支付/{{payName}}</span></div>
        <template v-else>
          <div class="infoRow">首付<span>{{payAmount.downPayment}}元</span></div>
          <div class="infoRow">分期期数<span>{{payAmount.month}}个月</span></div>
          <div class="infoRow">每月应还<span>{{payAmount.mothPayment}}元</span></div>
        </template>
      </div>
    </section>
    <toast v-model="showAjaxFail" type="text" :time="1500" is-show-mask :text="errorText" position="middle"></toast>
    <loading v-model="loadShow" text="加载中" class="ajaxLoading"></loading>
  </section>
</template>

<style lang="css" scoped>
	@import './payType.css'
</style>
<script>
import { Loading,Toast } from 'vux'
export default {
  name: 'payType',
  props:{
    orderNo:''
  },
  data () {
    return {
      periodChecked:true,
      loadShow:true,
      showAjaxFail:false,
      payName:'银行卡支付',
      errorText:'接口请求错误',
      defPay:{},
      cashPay:{},
      listingPay:{},
      payAmount:{},
    }
  },
  created(){
    var vm = this;
    vm.defPay.orderNo = vm.orderNo;
    vm.$ajax.post('/order/payChannels',{orderNo:vm.defPay.orderNo})
    .then(response=>{
      let data = response.data;
      vm.defPay = data.content.defPay;
      vm.cashPay = data.content.cashPay;
      vm.listingPay = data.content.listingPay;
      vm.loadShow = false;
      vm.showChooseType = true;
      vm.payName=vm.defPay.payType==2?'银行卡支付':'微信支付';
      vm.$parent.defPay = vm.defPay;
      if(vm.defPay.payId!==null){
        vm.getPayInfo();
      }
    })
    .catch(response=>{vm.errorText='获取支付方式错误';vm.showAjaxFail=true});
  },
  components: {
    Toast,
    Loading
  },
  methods:{
    // bindEvent(){
    //   var periodDom = document.querySelectorAll('.period_list .period');
    //   for(let dom of periodDom){
    //     dom.addEventListener('touchend',function(){
    //       for(let item of periodDom){
    //         item.setAttribute('class','period');
    //       }
    //       dom.setAttribute('class','period active');
    //     })
    //   }
    // },
    getPayInfo(){
      var vm = this;
      vm.payAmount = {};
      vm.loadShow = true;
      vm.defPay.orderNo = vm.orderNo;
      vm.$ajax.post('/order/payAmount',vm.defPay)
      .then(response=>{
        let data = response.data;
        vm.payAmount = data.content;
        vm.loadShow = false;
      })
      .catch(response=>{vm.errorText='获取支付信息错误';vm.showAjaxFail=true});
    },
    payTypeChoose (type,id) {
      var vm = this;
      vm.defPay.orderNo = vm.orderNo;
      if(type==undefined){
        if(vm.cashPay.quickPay===null&&vm.cashPay.weChatPay===null){
          vm.defPay = {orderNo:vm.orderNo};
          vm.payAmount.orderAmount=undefined;
          vm.$parent.defPay = vm.defPay;
          return;
        }
        vm.defPay.payType=vm.cashPay.quickPay!=null?2:3;
        vm.payName=vm.cashPay.quickPay!=null?'银行卡支付':'微信支付';
        vm.defPay.payId=vm.cashPay.quickPay!=null?vm.cashPay.quickPay.quickChannels[0].bankId:vm.cashPay.weChatPay.payChannels[0].weId;
        return;
      }
      vm.payName=type==2?'银行卡支付':'微信支付';
      vm.defPay.payType = type;
      vm.defPay.payId = id;
      vm.$parent.defPay = vm.defPay;
      if(type==1){
       vm.getPayInfo(); 
      }
    }
  },
  mounted (){
    // this.bindEvent();
  }
}
</script>