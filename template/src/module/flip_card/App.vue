<template>
  <div id="app">
    <div class="card-container">
      <div class="card card1" ontouchend="this.classList.toggle('hover')">
        <a href="#" class="back"><img src="http://9yin.woniu.com/static/web201588/images/card6-back.png" /></a>
        <a href="#" class="font"><img src="http://9yin.woniu.com/static/web201588/images/card6.png" /></a>
      </div>
      <div class="card card2">
        <a href="#" class="back"><img src="http://9yin.woniu.com/static/web201588/images/card7-back.png" /></a>
        <a href="#" class="font"><img src="http://9yin.woniu.com/static/web201588/images/card7.png" /></a>
      </div>
      <div class="card card3">
        <a href="#" class="back"><img src="http://9yin.woniu.com/static/web201588/images/card8-back.png" /></a>
        <a href="#" class="font"><img src="http://9yin.woniu.com/static/web201588/images/card8.png" /></a>
      </div>
      <div class="card card4">
        <a href="#" class="back"><img src="http://9yin.woniu.com/static/web201588/images/card9-back.png" /></a>
        <a href="#" class="font"><img src="http://9yin.woniu.com/static/web201588/images/card9.png" /></a>
      </div>
      <div class="card card5">
        <a href="#" class="back"><img src="http://9yin.woniu.com/static/web201588/images/card10-back.png" /></a>
        <a href="#" class="font"><img src="http://9yin.woniu.com/static/web201588/images/card10.png" /></a>
      </div>
    </div>
    <toast v-model="showAjaxFail" type="text" :time="800" is-show-mask text="接口请求错误" position="middle"></toast>
  </div>
</template>

<script>
  import {Toast} from 'vux'
  export default {
    name: 'flip_card',
    data(){
      return {
        couponList:[],
        showAjaxFail:false,
      }
    },
    created(){
      var vm = this;
      vm.$ajax.post('/user/userCoupons')
      .then(response=>{
        
      })
      .catch(response=>vm.showAjaxFail=true);
    },
    components: {
      Toast
    },
    methods:{
      bindEvent(){

      }
    },
    mounted(){
      // setTimeout(this.bindEvent(),2000);
    }
  }
</script>

<style>
  @import './flip_card.css'
</style>
