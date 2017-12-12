<template>
  <section class="collect_list">
    <div class="myOrderTitle">我的订单</div>
    <div id="wrapper" v-cloak>
      <ul id="thelist" v-if="list.length!=0">
        <li class="list_item" v-for="product in list">
          <div class="top">
            订单时间：{{product.orderInfo.createOrderTime}}
            <a :href="'tel:'+product.skuInfo.sellerTel">联系商家</a>
            <span :class="product.orderInfo.orderStatus | status">{{product.orderInfo.orderStatusTxt}}</span>
          </div>
          <div class="content">
            <section class="left">
              <img :src="product.skuInfo.skuImgUrl+'?imageView2/1/w/80/h/80'">
            </section>
            <section class="right">
              <p class="order_title">{{product.skuInfo.skuDesc}}</p>
              <p class="skuName">{{product.skuInfo.skuName}}</p>
              <p class="order_address">{{product.address}}</p>
              <p class="order_id">订单号：{{product.orderInfo.orderNo}}</p>
              <p class="logistic_id" v-if="product.orderInfo.expressNo!=''&&product.orderInfo.expressName!=''">物流单号：{{product.orderInfo.expressName||isNull}}&nbsp;&nbsp;{{product.orderInfo.expressNo||isNull}}</p>
              <template v-if="product.orderInfo.showBtn==1">
                <a href="javascript:;" @click="cancelClick(product.orderInfo.orderId)" class="orderCancel">•••</a>
                <a href="javascript:;" class="operate" @click="toPay(product.orderInfo.orderNo,product.skuInfo.skuDesc)" :data-orderid="product.orderInfo.orderId" :data-productname="product.skuInfo.skuDesc">去付款</a>
              </template>
              <a href="javascript:;" @click="cancelClick(product.orderInfo.orderId)" class="orderCancel" v-else-if="product.orderInfo.showBtn==2">•••</a>
              <a href="javascript:;" class="orderCancel" @click="operate(product.orderInfo)" v-else-if="product.orderInfo.showBtn==3||product.orderInfo.showBtn==4||product.orderInfo.showBtn==5||product.orderInfo.showBtn==12">•••</a>
              <template v-else-if="product.orderInfo.showBtn==10">
                <a href="javascript:;" class="orderCancel reApply" @click="operate(product.orderInfo)">•••</a>
                <a href="javascript:;" class="operate" @click="getFailMessage(product.orderInfo.orderNo)">了解详情</a>
              </template>
              <template v-else-if="product.orderInfo.showBtn==6||product.orderInfo.showBtn==7">
                <a href="javascript:;" class="operate" @click="operate(product.orderInfo)">填写退货信息</a>
                <a href="javascript:;" class="getReturnInfo" @click="getReturnProgress(product.orderInfo)">退货进度查询</a>
              </template>
              <template v-else-if="product.orderInfo.showBtn==8">
                <a href="javascript:;" class="operate" @click="operate(product.orderInfo)">查看退货信息</a>
                <a href="javascript:;" class="getReturnInfo" @click="getReturnProgress(product.orderInfo)">退货进度查询</a>
              </template>
              <template v-else-if="product.orderInfo.showBtn==9||product.orderInfo.showBtn==11">
                <a href="javascript:;" class="operate" @click="operate(product.orderInfo)">了解详情</a>
              </template>
            </section>
          </div>
        </li>
      </ul>
      <div v-else class="listNull">
        <img src="../../common/imgs/listNull.png"><br>
        <p>暂无订单</p>
      </div>
      <div id="pullUp">
        <span class="pullUpLabel"></span>
      </div>
    </div>
    <toast v-model="showAjaxFail" type="text" :time="tipShowTime" is-show-mask :text="AjaxFailText" position="middle"></toast>
    <confirm v-model="cancelDialog"
      @on-cancel="toCancel"
      cancel-text="狠心取消"
      confirm-text="买都买了">
      <p class="tip_text">如此给力，错过不再有！<br>确定要取消吗？</p>
    </confirm>
    <confirm v-model="failDialog"
      @on-confirm="reCharge">
      <p class="tip_text">您的额度不足，请充值<span class="still_money">{{successMsg}}</span>元。</p>
    </confirm>
    <confirm v-model="sucessDialog"
      :showCancelBtn="false"
      @on-confirm="onSuccess">
      <p class="tip_text">{{successMsg}}</p>
    </confirm>
    <confirm v-model="rejectedDialog"
      title="申请退货"
      @on-confirm="ajaxRejected">
      <div class="ajaxRejected">
        <label>请选择退货理由:
          <select class="Rejected_reason" v-model="RejectedReason">
            <option value="">退货理由</option>
            <template v-for="item in ReturnReasons">
              <option :value="item.reasonId">{{item.reasonDesc}}</option>
            </template>
          </select>
        </label>
        <p>
          如您全额支付购买商品，货款将会退回您在拍拍贷绑定的银行卡； 
          <br>如您尚未绑定银行卡或绑卡有误，请先进行绑卡操作。
          <a href="https://wappay.ppdai.com/PayNew/BankListNew">去绑卡 >></a>
        </p>
      </div>
    </confirm>
    <confirm v-model="CancelRejectedDialog"
      title="取消退货申请"
      @on-confirm="ajaxCancelRejected">
      <p class="tip_text">确定要取消退货申请？</p>
    </confirm>
    <confirm v-model="UnEditeLogisticDialog"
      title="查看退货信息">
      <div class="EditeLogistic readOnly">
        <label>
          商品请寄回至：
          <div class="sellerAddr">
            <!-- <p>联系人：{{sellerInfo.contact}}</p>
            <p>联系电话：{{sellerInfo.phone}}</p>
            <p>邮编：{{sellerInfo.zipCode}}</p> -->
            <p v-html="sellerInfo.addressDetails"></p>
          </div>
        </label>
        <label class="logisticName">
          请填写商品寄回物流公司名称
          <input type="text" disabled="true" v-model="logisticName">
        </label>
        <label class="logisticNum">
          请填写商品寄回物流单号
          <input type="text" disabled="true" v-model="logisticNum">
        </label>
      </div>
    </confirm>
    <confirm v-model="bindCardDialog" @on-confirm="bindCard" confirm-text="去绑卡" cancel-text="算了">
      <div class="bindCardText">
        您还未绑定银行卡，无法申请退货，请点击按钮去绑卡。
      </div>
    </confirm>
    <confirm v-model="EditeLogisticDialog"
      title="填写退货信息"
      @on-confirm="ajaxEditeLogistic">
      <div class="EditeLogistic canEdite">
        <label>
          商品请寄回至：
          <div class="sellerAddr">
            <!-- <p>联系人：{{sellerInfo.contact}}</p>
            <p>联系电话：{{sellerInfo.phone}}</p>
            <p>邮编：{{sellerInfo.zipCode}}</p> -->
            <p v-html="sellerInfo.addressDetails"></p>
          </div>
        </label>
        <label class="logisticName">
          请填写商品寄回物流公司名称
          <input type="text" v-model="logisticName">
        </label>
        <label class="logisticNum">
          请填写商品寄回物流单号
          <input type="text" v-model="logisticNum">
        </label>
      </div>
    </confirm>
    <confirm v-model="ReturnProgressDialog"
      title="退货进度"
      :showCancelBtn="false"
      confirm-text="知道了">
      <div class="ReturnProgress">
        <template v-for="item in progressList">
          <p><span class="left">{{item.message}}</span><span class="right">{{item.createTime}}</span></p>
        </template>
      </div>
    </confirm>
    <confirm v-model="FailMessageDialog"
      title="退货申请失败"
      :showCancelBtn="false"
      confirm-text="知道了">
      <div class="FailMessage">
          <p>由于{{FailMessage}}</p>
          <p>暂无法进行退货</p>
          <p>如有疑问请咨询：400-184-8888</p>
      </div>
    </confirm>
    <loading v-model="loadShow" :text="loadText"></loading>
  </section>
</template>
<style lang="css" scoped>
	@import './order_list.css'
</style>
<script>
let pageIndex=1,pageSize=5,hasNext=false;
let defaultOption = {"pageIndex":pageIndex,"pageSize":pageSize};
import { Confirm,Loading,Toast } from 'vux'
export default {
  name: 'order_list',
  props:{
    option:{
        type:Object,
        default(){
            return {};
        }
    }
  },
  data () {
    return {
      list:[],
      showAjaxFail:false,
      failDialog:false,
      sucessDialog:false,
      cancelDialog:false,
      rejectedDialog:false,
      CancelRejectedDialog:false,
      EditeLogisticDialog:false,
      UnEditeLogisticDialog:false,
      ReturnProgressDialog:false,
      FailMessageDialog:false,
      bindCardDialog:false,
      tipShowTime:1000,
      progressList:[],
      ReturnReasons:[],
      sellerInfo:{},
      RejectedReason:'',
      currentOrderId:'',
      logisticName:'',
      logisticNum:'',
      FailMessage:'没收到货',
      AjaxFailText:'接口请求错误',
      successMsg:"",
      loadShow:false,
      loadText:'',
      orderid:''
    }
  },
  filters:{
    status:function(value){
      if(value==0||value==-2||value==-3){
        return 'color-red';
      }else if(value==5||value==1||value==10){
        return 'color-blue';
      }else if(value==4||value==2||value==7){
        return 'color-green';
      }else if(value==-1||value==3||value==6){
        return 'color-grey';
      }
    },
    isNull:function(value){
      if(value==""){
        return "暂无"
      }
      return value;
    }
  },
  watch:{
    currentOrderId(val,old){
      console.log(val)
      this.logisticName='';
      this.logisticNum='';
    }
  },
  created(){
    var vm = this;
    vm.loadShow = true;
    defaultOption = Object.assign(defaultOption,vm.option.data);
    vm.$ajax.get(vm.option.upLoadUrl+'?pageIndex='+defaultOption.pageIndex+'&pageSize='+pageSize)
    .then(response=>{
        vm.loadShow = false;
        var result=response.data.responseContent;
        hasNext = result.hasNext;
        result.myOrderInfos.map((item,index)=>{
            vm.$data.list.push(item)
        })
    })
    .catch(response=>{vm.loadShow = false;vm.AjaxFailText='接口请求错误';vm.showAjaxFail=true;})
  },
  components: {
    Toast,
    Confirm,
    Loading
  },
  methods:{
    cancelClick (orderId) {
      this.cancelDialog = true;
      this.orderid = orderId;
    },
    bindCard(){
      window.location.href="https://wappay.ppdai.com/PayNew/BankListNew";
    },
    operate(option){
      var vm = this;
      vm.currentOrderId = option.orderNo;
      if(option.showBtn==3||option.showBtn==4||option.showBtn==10||option.showBtn==12){
        this.getReturnReasons();
      }else if(option.showBtn==5){
        this.CancelRejectedDialog = true;
      }else if(option.showBtn==6||option.showBtn==7||option.showBtn==8){
        this.getSellerAddress(option.showBtn)
      }else if(option.showBtn==9||option.showBtn==10||option.showBtn==11){
        this.getFailMessage();
      }
      //主要做交互的分发
    },
    ajaxRejected(){
      //发起退货申请
      var vm = this;
      if(vm.RejectedReason==''){
        vm.AjaxFailText = '请选择退货理由';
        vm.showAjaxFail=true;
        return;
      }
      vm.loadText = '退货中';
      vm.loadShow = true;
      vm.$ajax.post('/return/applyReturnOrder',{"orderNo":vm.currentOrderId,"reasonId":vm.RejectedReason})
      .then(response=>{
          let data = response.data.content;
          vm.loadShow = false;
          if(response.data.code==1){
            vm.AjaxFailText = '已为您申请退货，请耐心等待商家反馈';
            vm.tipShowTime = 3000;
            vm.showAjaxFail=true;
            setTimeout(()=>{
              vm.tipShowTime = 1000;
              window.location.reload();
            },3100)
          }else if(response.data.code==1007){
            vm.bindCardDialog = true;
          }
      })
      .catch(response=>{vm.loadShow = false;vm.AjaxFailText='接口请求错误';vm.showAjaxFail=true;})
    },
    ajaxCancelRejected(){
      //取消申请退货
      var vm = this;
      vm.loadText = '取消中';
      vm.loadShow = true;
      vm.$ajax.post('/return/cancelReturnOrderApply',{"orderNo":vm.currentOrderId})
      .then(response=>{
          let data = response.data.content;
          vm.loadShow = false;
          if(response.data.code==1){
            vm.AjaxFailText = '已为您取消退货申请';
            vm.tipShowTime = 2000;
            vm.showAjaxFail=true;
            setTimeout(()=>{
              vm.tipShowTime = 1000;
              window.location.reload();
            },3100)
          }
      })
      .catch(response=>{vm.loadShow = false;vm.AjaxFailText='接口请求错误';vm.showAjaxFail=true;})
    },
    getSellerAddress(status){
      //获取商家地址
      var vm = this;
      vm.loadText = '加载中';
      vm.loadShow = true;
      vm.$ajax.post('/return/getSellerAddress',{"orderNo":vm.currentOrderId})
      .then(response=>{
          let data = response.data.content;
          vm.loadShow = false;
          if(response.data.code==1){
            vm.sellerInfo = data;
            if(status==6){
              vm.UnEditeLogisticDialog = true;
            }else if(status==8){
              vm.getDeliveryInfo();
            }else if(status==7){
              vm.EditeLogisticDialog = true;
            }
          }
      })
      .catch(response=>{vm.loadShow = false;vm.AjaxFailText='接口请求错误';vm.showAjaxFail=true;})
    },
    getDeliveryInfo(){
      //获取快递信息
      var vm = this;
      vm.loadText = '加载中';
      vm.loadShow = true;
      vm.$ajax.post('/return/getExpressMessage',{"orderNo":vm.currentOrderId})
      .then(response=>{
          let data = response.data.content;
          vm.loadShow = false;
          if(response.data.code==1){
            vm.logisticName = data.expressName;
            vm.logisticNum = data.expressNo;
            vm.UnEditeLogisticDialog = true;
          }
      })
      .catch(response=>{vm.loadShow = false;vm.AjaxFailText='接口请求错误';vm.showAjaxFail=true;})
    },
    ajaxEditeLogistic(){
      //填写快递信息
      var vm = this;
      vm.loadText = '提交中';
      vm.loadShow = true;
      vm.$ajax.post('/return/expressMessagee',{"orderNo":vm.currentOrderId,"expressName":vm.logisticName,"expressNo":vm.logisticNum})
      .then(response=>{
          let data = response.data.content;
          vm.loadShow = false;
          if(response.data.code==1){
            vm.AjaxFailText = '拍拍贷确认商家收到货物后将为你办理退款，请耐心等待';
            vm.tipShowTime = 3000;
            vm.showAjaxFail=true;
            setTimeout(()=>{
              vm.tipShowTime = 1000;
              window.location.reload();
            },3100)
          }
      })
      .catch(response=>{vm.loadShow = false;vm.AjaxFailText='接口请求错误';vm.showAjaxFail=true;})
    },
    getFailMessage(OrderId){
      //获取退货失败的原因
      var vm = this;
      vm.loadText = '加载中';
      vm.loadShow = true;
      if(OrderId)vm.currentOrderId = OrderId;
      vm.$ajax.post('/return/failMessage',{"orderNo":vm.currentOrderId})
      .then(response=>{
          let data = response.data.content;
          vm.loadShow = false;
          if(response.data.code==1){
            vm.FailMessage = data;
            vm.FailMessageDialog = true;
          }
      })
      .catch(response=>{vm.loadShow = false;vm.AjaxFailText='接口请求错误';vm.showAjaxFail=true;})
    },
    getReturnReasons(){
      //获取退货原因
      var vm = this;
      vm.loadText = '加载中';
      vm.loadShow = true;
      vm.$ajax.get('/return/orderReasons')
      .then(response=>{
          let data = response.data.content;
          vm.loadShow = false;
          vm.ReturnReasons = data;
          vm.rejectedDialog = true;
      })
      .catch(response=>{vm.loadShow = false;vm.AjaxFailText='接口请求错误';vm.showAjaxFail=true;})
    },
    getReturnProgress(obj){
      var vm = this;
      vm.loadText = '加载退货进度';
      vm.loadShow = true;
      vm.$ajax.post('/return/getReturnOrderSchedule',{"orderNo":obj.orderNo})
      .then(response=>{
          let data = response.data.content;
          vm.loadShow = false;
          vm.progressList = data;
          vm.ReturnProgressDialog = true;
      })
      .catch(response=>{vm.loadShow = false;vm.AjaxFailText='接口请求错误';vm.showAjaxFail=true;})
    },
    reCharge () {
      var vm = this;
      ga("send", "event","buy-Process","click","去充值");
      vm.$ajax.post('/remark/addRecharge',{"type":2,"orderId":vm.orderid})
      .then(response=>{
          console.log(response.data.responseContent)
      })
      .catch(response=>console.log(response.data.responseContent))
      setTimeout(()=>{
        window.location.href = 'http://wappay.ppdai.com?callbackUrl=http://mstore.ppdai.com/user/myorder';//跳转充值页面
      },200)
    },
    onSuccess () {
      window.location.reload()//刷新订单页
    },
    //去付款
    toPay(orderNo,productName){
      var vm = this;
      window.location.href="/pay/"+orderNo;
      // vm.loadText = '付款中';
      // vm.loadShow = true;
      // vm.$ajax.post('/order/payOrder',{"orderId":orderId,"productName":productName})
      // .then(response=>{
      //     vm.loadShow = false;
      //     var result=response.data.responseContent;
      //     vm.loadShow = false;
      //     vm.orderid = orderId;
      //     if(result.payResult==3001){
      //       vm.failDialog = true;
      //     }else{
      //       vm.sucessDialog = true;
      //     }
      //     vm.successMsg = result.payMessage
      // })
      // .catch(response=>{vm.loadShow = false;vm.AjaxFailText='接口请求错误';vm.showAjaxFail=true;})
    },
    //取消订单
    toCancel(){
      var vm = this;
      vm.loadText = '订单取消中';
      vm.loadShow = true;
      vm.$ajax.post('/order/cancelOrder',{"orderId":vm.orderid})
      .then(response=>{
        var result=response.data.responseContent;
        vm.loadShow = false;
        vm.sucessDialog = true;
        vm.successMsg = result.retMessage
      })
      .catch(response=>{vm.loadShow = false;vm.AjaxFailText='接口请求错误';vm.showAjaxFail=true;})
    },
    //获取滚动条在Y轴上的滚动距离
    getScrollTop(){
      var scrollTop = 0, bodyScrollTop = 0, documentScrollTop = 0;
  　　if(document.body){
  　　　　bodyScrollTop = document.body.scrollTop;
  　　}
  　　if(document.documentElement){
  　　　　documentScrollTop = document.documentElement.scrollTop;
  　　}
  　　scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
  　　return scrollTop;
    },
    //获取文档的总高度
    getScrollHeight(){
      var scrollHeight = 0, bodyScrollHeight = 0, documentScrollHeight = 0;
  　　if(document.body){
  　　　　bodyScrollHeight = document.body.scrollHeight;
  　　}
  　　if(document.documentElement){
  　　　　documentScrollHeight = document.documentElement.scrollHeight;
  　　}
  　　scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
  　　return scrollHeight;
    },
    //获取浏览器视口的高度
    getWindowHeight(){
      var windowHeight = 0;
  　　if(document.compatMode == "CSS1Compat"){
  　　　　windowHeight = document.documentElement.clientHeight;
  　　}else{
  　　　　windowHeight = document.body.clientHeight;
  　　}
  　　return windowHeight;
    },
    pullUpAction(){
      var vm = this;
      defaultOption.pageIndex++;
      if(!hasNext){
          document.querySelector('.pullUpLabel').innerHTML='到底了';
          setTimeout(function(){
              document.querySelector('.pullUpLabel').innerHTML='';
          },2000)
          return;
      };
      vm.$ajax.get(vm.option.upLoadUrl+'?pageIndex='+defaultOption.pageIndex+'&pageSize='+pageSize)
      .then(response=>{
          vm.loadShow = false;
          var result=response.data.responseContent;
          hasNext = result.hasNext;
          result.myOrderInfos.map((item,index)=>{
              vm.$data.list.push(item)
          })
          // vm.list.push(2)
      })
      .catch(response=>{vm.loadShow = false;vm.AjaxFailText='接口请求错误';vm.showAjaxFail=true;})
    },
    upLoad(){
      var vm = this;
      window.onscroll=function(){
    　　if(vm.getScrollTop() + vm.getWindowHeight() == vm.getScrollHeight()){
            document.querySelector('.pullUpLabel').innerHTML='<i class="weui-loading"></i>上拉显示更多';
            vm.pullUpAction();
    　　}
      }
    }
  },
  mounted (){
    this.upLoad();
    var EditeLogistic = document.querySelector('.canEdite');
    var EditeLogistic_pre = EditeLogistic.parentNode.parentNode;
    window.onresize = function(){
      if(document.body.clientHeight<500){
        EditeLogistic_pre.style.top = '10%';
      }else{
        EditeLogistic_pre.style.top = '50%';
      }
    }
  }
}
</script>