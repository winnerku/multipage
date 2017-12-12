<template>
  <div id="app">
    <mall-top></mall-top>
    <choose-card :productSkuId="productSkuId" v-show="showCardList"></choose-card>
    <div class="order_confirm">
      订单确认
      <!-- <a href="javascript:;" class="collect_order" @click="collectOrder">收藏订单</a> -->
    </div>
    <ship-address v-if="shipShow" :userData="userData" :proData="proData"></ship-address>
    <section class="loadingDrools" v-if="loadingDrools">
      <loading v-model="loadingDrools" :text="loadingText" v-if="loadingSuccess"></loading>
      <div v-else class="listNull">
        <img src="../../common/imgs/listNull.png"><br>
        <p v-html="loadingText"></p>
      </div>
    </section>
    <section class="saleCard">
      <a href="javascript:;" class="useCardLink" @click="showCard">
        <div class="left name" v-if="cardInfo.CouponId">优惠券: <span class="money">{{cardInfo.Amount}}</span>元 （<span class="cardId">{{cardInfo.couponName}}</span>）</div>
        <div class="left name" v-else>优惠券: <span class="cardNumber">{{cardNumber}}</span></div>
        <img src="../../common/imgs/right.png" class="right">
      </a>
    </section>
    <section class="payInfo" v-if="payInfo.productAmount!=undefined">
      <div class="content">
        <div class="infoRow">订单金额<span>{{payInfo.productAmount}}元</span></div>
        <div class="infoRow">优惠券<span><i>-{{payInfo.discountAmount}}</i>元</span></div>
        <p class="title">实付金额<span>{{payInfo.payAmount}}元</span></p>
      </div>
    </section>
    <template>
      <!-- <confirm-bottom :callBack="confirmBuy" :periodNum="periodNum" :limitData="downpayInfo" :buttonText="buttonText"></confirm-bottom> -->
      <ppd-button :callBack="confirmBuy" :buttonName="buttonText" :className="btnClass"></ppd-button>
    </template>
    <confirm v-model="failDialog"
      @on-confirm="reCharge">
      <p class="tip_text">您的额度不足，请充值<span class="still_money">{{resMsg}}</span>元。</p>
    </confirm>
    <confirm v-model="sucessDialog"
      :showCancelBtn="false"
      @on-confirm="onSuccess">
      <p class="tip_text">{{resMsg}}</p>
    </confirm>
    <confirm v-model="shortSupply"
      :showCancelBtn="false">
      <p class="tip_text">客官大大，您所在的区域暂时无货哦~<br> 商家小哥正快马加鞭补货中！</p>
    </confirm>
    <confirm v-model="editeAddrDialog"
      :showCancelBtn="false"
      confirm-text="知道了"
      @on-confirm="toEditeAddr">
      <p class="tip_text">请先填写收货地址</p>
    </confirm>
    <loading v-model="loadShow" text="提交中"></loading>
    <loading v-model="payMonthLoading" text="支付信息加载中"></loading>
    <toast v-model="showAjaxFail" type="text" :time="1500" is-show-mask :text="errorText" position="middle" class="errorTip"></toast>
  </div>
</template>

<script>
  import MallTop from 'components/mall_top_three/mall_top_three'
  import ShipAddress from 'components/ship_address/ship_address'
  import ConfirmBottom from 'components/confirm_bottom/confirm_bottom'
  import PpdButton from 'components/button/button'
  import ChooseCard from 'components/choose_card/choose_card'
  import { Confirm,Loading,Toast } from 'vux'
  const productSkuId = window.location.href.split("submit").pop().split('/').pop().split('?').shift();
  const periodNum = window.location.href.split('?').pop().split('=').pop();
  // const productSkuId = 70;
  export default {
    name: 'app',
    data () {
      return {
        failDialog:false,
        sucessDialog:false,
        editeAddrDialog:false,
        shipShow:false,
        userData:[],//用户信息，包括姓名、地址、联系方式
        loadShow:false,
        payMonthLoading:false,
        loadingDrools:true,
        loadingSuccess:true,
        shortSupply:false,
        showCardList:false,
        showAjaxFail:false,
        btnClass:'normal',
        loadingText:'分期小哥正在拼命计算，客官请稍等片刻',
        buttonText:'确认提交订单',
        errorText:'接口错误',
        downpayInfo:{periodInfo:{}},
        productSkuId:productSkuId,//商品编号
        periodNum:periodNum,
        proData:{},
        cardInfo:{},
        payInfo:{},
        cardNumber:'暂无可用',
        resMsg:'',
        orderId:'',
      }
    },
    created(){
      var vm = this;
      $.ajax({
        url: '/address/getAddress',
        type: 'get',
        contentType:'application/json',
        dataType: 'json',
        success:function(data){
          vm.userData = data.responseContent;
        },
        error:function(data){
        }
      });
      $.ajax({
        url: '/product/getSkuProSimple',
        type: 'post',
        contentType:'application/json',
        dataType: 'json',
        data:JSON.stringify({"productSkuId":productSkuId}),
        success:function(data){
          vm.proData = data.responseContent;
          vm.shipShow = true;
          if(vm.proData.saleState!=1){
            vm.buttonText = '缺货';
            vm.btnClass = 'disabled';
          }
        },
        error:function(data){
        }
      });
      vm.dispPrice();
    },
    methods:{
      collectOrder(){
        var vm = this;
        if(vm.userData.length<1){
          vm.editeAddrDialog = true;
          return;
        }
        $.ajax({
          url: '/order/collectOrder',
          type: 'post',
          contentType:'application/json',
          dataType: 'json',
          data:JSON.stringify({"skuId":productSkuId,"payMinute":10,"addressId":vm.userData[0].id,"downPaymentLevel":0}),
          success:function(data){
            $('.collect_order').addClass('active');
          },
          error:function(data){
            console.log("收藏接口请求失败")
          }
        })
      },
      showCard(){
        var vm = this;
        vm.showCardList = true;
      },
      dispPrice(){
        var vm = this;
        vm.payMonthLoading = true;
        if(vm.cardInfo.CouponId==undefined){
          vm.cardInfo.CouponId=0;
        }
        $.ajax({
          url: '/newOrder/dispPrice',
          type: 'post',
          contentType:'application/json',
          dataType: 'json',
          data:JSON.stringify({"skuId":productSkuId,"userCouponId":vm.cardInfo.CouponId}),
          success:function(data){
            vm.payMonthLoading = false;
            vm.loadingDrools = false;
            vm.payInfo = data.content;
          },
          error:function(data){
            vm.payMonthLoading = false;
            console.log("获取支付信息失败")
          }
        })
      },
      confirmBuy(){
        // this.$data.sucessDialog = true
        ga("send", "event","buy-Process","click","确认订单");
        var vm = this;
        if(vm.buttonText=='缺货'){
          vm.shortSupply = true;
          return;
        }
        if(vm.userData.length<1){
          vm.editeAddrDialog = true;
          return;
        }
        if(vm.cardInfo.CouponId==undefined){
          vm.cardInfo.CouponId=0;
        }
        vm.loadShow = true;
        $.ajax({
          url: '/newOrder/submit',
          type: 'post',
          contentType:'application/json',
          dataType: 'json',
          data:JSON.stringify({"skuId":productSkuId,"addressId":vm.userData[0].id,"tokenId":vm.payInfo.priceToken,"userCouponId":vm.cardInfo.CouponId}),
          success:function(data){
            vm.loadShow = false;
            if(data.code==1){
              window.location.href="/pay/"+data.content.orderNo;
            }else{
              vm.errorText = data.message;
              vm.showAjaxFail = true;
            }
          },
          error:function(data){
            vm.loadShow = false;
            alert('提交失败')
          }
        })
      },
      reCharge () {
        var vm = this;
        //日志埋点
        ga("send", "event","buy-Process","click","去充值");
        $.ajax({
          url: '/remark/addRecharge',
          type: 'post',
          contentType:'application/json',
          dataType: 'json',
          data:JSON.stringify({"type":1,"orderId":vm.orderId}),
          success:function(data){
            console.log(data)
          },
          error:function(data){
            console.log(data)
          }
        })
        setTimeout(()=>{
          window.location.href = 'http://wappay.ppdai.com?callbackUrl='+window.location.href;//跳转充值页面
        },200)
      },
      onSuccess () {
        window.location.href = '/user/myorder'//跳转我的订单页
      },
      toEditeAddr () {
        window.location.href = '/user/addressedit'//跳转我的订单页
      }
    },
    components: {
      MallTop,
      ShipAddress,
      ConfirmBottom,
      PpdButton,
      Toast,
      Confirm,
      Loading,
      ChooseCard
    },
    mounted(){
    }
  }
</script>

<style>
  @import './order_confirm.css'
</style>
