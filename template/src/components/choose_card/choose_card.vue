<template>
  <div id="choose_card">
    <mall-top back="javascript:location.reload();"></mall-top>
    <use-card title="选择优惠券" ref="useCard">
      <template slot="partOne" v-if="canUseList.length!=0">
        <div class="canUseCard">
          <div class="subTitle">可用优惠券</div>
          <div class="itemList">
            <ul id="thelist">
              <template v-for="item in canUseList">
                <li class="list_item" :data-couponid="item.userCouponId" :data-amount="item.couponAmount" :data-couponname="item.couponName">
                  <section class="cardInfo">
                    <div class="amount"><span class="unit">￥</span>{{item.couponAmount}}</div>
                    <div class="instruction">
                      <span class="IdName">{{item.couponName}}</span><br>
                      <span class="effectDate">{{item.startTime}} - {{item.endTime}}</span>
                    </div>
                  </section>
                  <section class="tips">{{item.desc}}</section>
                </li>
              </template>
            </ul>
          </div>
        </div>
      </template>
      <template slot="partTwo" v-if="unUseList.length!=0">
        <div class="unUseCard">
          <div class="subTitle">不可用优惠券</div>
          <div class="itemList">
            <ul id="thelist">
              <template v-for="item in unUseList">
                <li class="list_item unable">
                  <section class="cardInfo">
                    <div class="amount"><span class="unit">￥</span>{{item.couponAmount}}</div>
                    <div class="instruction">
                      <span class="IdName">{{item.couponName}}</span><br>
                      <span class="effectDate">{{item.startTime}} - {{item.endTime}}</span>
                    </div>
                  </section>
                  <section class="tips">{{item.desc}}</section>
                </li>
              </template>
            </ul>
          </div>
        </div>
      </template>
      <template slot="None" v-if="canUseList.length==0&&unUseList.length==0">
        <div class="listNull">
          <img src="../../common/imgs/noCard.jpg"><br>
          <p>很抱歉！</p>
          <p>客官，您<span>暂无</span>优惠券哦~</p>
        </div>
      </template>
    </use-card>
    <div class="loading" v-show="loadShow"><i class="weui-loading" style="margin-top:30%;"></i></div>
    <ppd-button :callBack="useCardBtn" :buttonName="saveTxt"></ppd-button>
  </div>
</template>

<script>
  import MallTop from 'components/mall_top_three/mall_top_three'
  import UseCard from 'components/use_card/use_card'
  import PpdButton from 'components/button/button'
  const option = {
    upLoadUrl:'/user/userCoupons',
    pageIndex:0,
    pageSize:3
  };
  export default {
    name: 'choose_card',
    props:{
      productSkuId:''
    },
    data () {
        return {
          option:option,
          canUseList:[],
          unUseList:[],
          cardInfo:{},
          loadShow:true,
          saveTxt:'暂不使用优惠券'
        }
    },
    created(){
      this.LoadDate();
    },
    components: {
      MallTop,
      UseCard,
      PpdButton
    },
    methods:{
      useCardBtn(){
        this.$parent.showCardList = false;
        this.$parent.dispPrice();
      },
      bindEvent(){
        var vm = this;
        $('.canUseCard').on('click','.list_item',function(){
          if($(this).attr("class").indexOf('choosed')>-1){
            $(this).removeClass('choosed');
            vm.$parent.cardInfo = vm.cardInfo = {};
            vm.saveTxt = '暂不使用优惠券'
            return;
          }
          vm.saveTxt = '确认使用';
          var Amount = $(this).data("amount");
          var couponName = $(this).data("couponname");
          var CouponId = $(this).data("couponid");
          vm.cardInfo.Amount = Amount;
          vm.cardInfo.couponName = couponName;
          vm.cardInfo.CouponId = CouponId;
          $(this).siblings().removeClass('choosed');
          $(this).addClass('choosed');
          vm.$parent.cardInfo = vm.cardInfo;
        })
      },
      //列表数据加载
      LoadDate(){
        var vm = this;
        if(vm.cardInfo.CouponId){
          return;
        }
        $.ajax({
          url: vm.option.upLoadUrl,
          type: 'post',
          contentType:'application/json',
          dataType: 'json',
          data:JSON.stringify({"skuId":vm.$props.productSkuId}),
          success:function(data){
            vm.loadShow = false;
            let result=data.responseContent;
            if(result.usableCoupons.length<=0){
                vm.$parent.cardNumber = '暂无可用';
            }else{
                vm.$parent.cardNumber = result.usableCoupons.length+'张可用';
            }
            result.usableCoupons.map((item,index)=>{
                vm.$data.canUseList.push(item)
            })
            result.unUsableCoupons.map((item,index)=>{
                vm.$data.unUseList.push(item)
            })
            setTimeout(()=>{
              vm.bindEvent();
            },100)
          },
          error:function(data){
            vm.$refs.useCard.showAjaxFail=true;
          }
        });
        // vm.$ajax.get(vm.option.upLoadUrl)
        // .then(response=>{
        //     vm.loadShow = false;
        //     let result=response.data.responseContent;
        //     result.canuse.map((item,index)=>{
        //         vm.$data.canUseList.push(item)
        //     })
        //     result.unuse.map((item,index)=>{
        //         vm.$data.unUseList.push(item)
        //     })
        // })
        // .catch(response=>vm.$refs.useCard.showAjaxFail=true)
      }
    }
  }
</script>

<style>
  @import './choose_card.css'
</style>
