<template>
  <div id="app">
    <mall-top></mall-top>
    <my-address :addressInfo="addressInfo"></my-address>
    <ppd-button :callBack="editeAddress" :buttonName="saveTxt"></ppd-button>
    <toast v-model="showAjaxFail" type="text" :time="1000" is-show-mask :text="errorText" position="middle"></toast>
    <div class="loading" v-show="loadShow"><i class="weui-loading" style="margin-top:40%;"></i></div>
    <confirm v-model="bindMobileDialog" @on-confirm="bindMobile" confirm-text="去绑定" cancel-text="算了">
      <div class="bindMobileText">
        您还未绑定手机号，无法新增地址，请拨打拍拍贷客服绑定手机号。<a href="tel:400-184-8888" class="none callKefu"></a>
        <p>400-184-8888</p>
      </div>
    </confirm>
  </div>
</template>

<script>
  import MallTop from 'components/mall_top_three/mall_top_three'
  import MyAddress from 'components/myAddress/myAddress'
  import PpdButton from 'components/button/button'
  import { Confirm,Toast } from 'vux'
  export default {
    name: 'app',
    data () {
        return {
            saveTxt:'修改地址',
            addressInfo:[],
            errorText:'接口请求错误',
            showAjaxFail:false,
            bindMobileDialog:false,
            loadShow:false,
        }
    },
    created(){
      var vm = this;
      $.get('/address/getAddress',function(data){
        console.log(data)
        if(data.responseContent.length<1){
          vm.saveTxt = '新增地址';
          return;
        }
        vm.addressInfo = data.responseContent;
      });
    },
    methods:{
      editeAddress(){
        var vm = this;
        vm.loadShow = true;
        $.ajax({
            url: '/user/getUserMobile',
            type: 'get',
            contentType: 'application/json',
            dataType: 'json',
            success: function(data) {
              if(data.code==1){
                if(data.content.mobile==undefined){
                  vm.bindMobileDialog = true;
                }else{
                  window.location.href='/user/addressedit'
                }
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
              vm.loadShow = false;
            }
        })
      },
      bindMobile(){
        document.querySelector('.callKefu').click();
      },
    },
    components: {
      MallTop,
      MyAddress,
      PpdButton,
      Confirm,
      Toast
    }
  }
</script>

<style>
  @import './my_address.css'
</style>
