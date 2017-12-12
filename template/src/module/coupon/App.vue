<template>
  <div id="app">
    <ul class="couponList" v-if="couponList.length>0">
      <template v-for="item in couponList">
        <li class="list_item">
          <a href="javascript:;" @click="getCoupon(item.couponId)" style="display: block">
              <section class="cardInfo">
                <div class="money">
                  ￥<span>{{item.faceValue}}</span>
                </div>
                <div class="detail">
                  <span class="type">{{item.couponName}}</span>
                  <span class="amount">满{{item.minValue}}元使用</span>
                </div>
              </section>
              <section class="btn_get">
                立即领取
              </section>
          </a>
          <section class="model none getting" :data-couponid="item.couponId"><span>领取中</span></section>
          <section class="model none getted" :data-couponid="item.couponId"><span>已领取</span></section>
          <section class="model" v-if="item.userIsClaim"><span>已领取</span></section>
          <section class="model" v-else-if="item.couponIsClaimOut"><span>已领完</span></section>
        </li>
      </template>
    </ul>
    <toast v-model="showAjaxFail" type="text" :time="800" is-show-mask :text="errorText" position="middle"></toast>
  </div>
</template>

<script>
  import {Toast} from 'vux'
  var query = window.location.href.split("cardId=").pop().split('-');
  var returnUrl = document.referrer;
  var userLogin = false;
  export default {
    name: 'coupon',
    data(){
      return {
        couponList:[],
        errorText:'接口请求错误',
        showAjaxFail:false
      }
    },
    created(){
      var vm = this;
      var couponIds = [];
      if(isNaN(parseInt(query[0]))){
        vm.errorText = '优惠券地址错误';
        vm.showAjaxFail=true;
        return;
      };
      for(let i=0;i<query.length;i++){
        if(parseInt(query[i])!=0){
          couponIds.push(query[i])
        }
      }
      //验证用户是否登录
      vm.$ajax.post('/user/isLogin')
      .then(response=>{
        console.log('zoujie')
        var data = response.data;
        if(data.code==1){
          if(data.content){
            userLogin = true;
          }else{
            userLogin = false;
          }
        }else{
          vm.errorText = data.message;
          vm.showAjaxFail=true;
        }
      })
      .catch(response=>{vm.errorText = '用户登录接口错误';vm.showAjaxFail=true});

      // vm.$ajax.all([vm.$ajax.post('/coupon/info',{couponIds:couponIds}),
      //   vm.$ajax.post('/coupon/userCouponStatus',{couponIds:couponIds}),
      //   vm.$ajax.post('/coupon/schedule',{couponIds:couponIds})])
      // .then(vm.$ajax.spread(function (info, status,schedule) {
      //   var infoDate = info.data.content;
      //   var statusDate = status.data.content;
      //   var scheduleDate = schedule.data.content;
      //   infoDate.map((item,index)=>{
      //     var couponItem = {};
      //     couponItem = Object.assign(item,statusDate[index],scheduleDate[index]);
      //     vm.$data.couponList.push(couponItem)
      //   })
      //   console.log(vm.$data.couponList)
      // }))
      // .catch(response=>{vm.errorText="接口请求错误";vm.showAjaxFail=true});
      vm.$ajax.post('/coupon/info',{couponIds:couponIds})
      .then(response=>{
        let data = response.data.content;
        data.map((item,index)=>{
          vm.$data.couponList.push(item)
        })
        console.log(vm.$data.couponList)
      })
      .catch(response=>{vm.errorText="接口请求错误";vm.showAjaxFail=true});
    },
    components: {
      Toast
    },
    methods:{
      bindEvent(){
        
      },
      getCoupon(id){
        var vm = this;
        if(!userLogin){
          window.top.location.href = "https://ac.ppdai.com/User/Login?redirect=" + encodeURI(returnUrl);
          return;
        }
        document.querySelector('.getting[data-couponid="'+id+'"]').style.display="block";
        vm.$ajax.post('/coupon/userClaimCoupon',{couponId:id})
        .then(response=>{
          let data = response.data.content;
          if(data.isClaimSuccess){
            vm.errorText="领取成功";
            vm.showAjaxFail=true;
            document.querySelector('.getting[data-couponid="'+id+'"]').style.display="none";
            document.querySelector('.getted[data-couponid="'+id+'"]').style.display="block";
          }else{
            vm.errorText="领取失败";
            vm.showAjaxFail=true
            document.querySelector('.getting[data-couponid="'+id+'"]').style.display="none";
          }
        })
        .catch(response=>{vm.errorText="接口请求错误";vm.showAjaxFail=true;document.querySelector('.getting[data-couponid="'+id+'"]').style.display="none";});
      }
    },
    mounted(){
      var vm = this;
      vm.bindEvent();
      if(isNaN(parseInt(query[0]))){
        vm.errorText = '优惠券地址错误';
        vm.showAjaxFail=true;
      };
    }
  }
</script>

<style>
  @import './coupon.css'
</style>
