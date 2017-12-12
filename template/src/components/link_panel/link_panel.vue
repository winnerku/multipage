<template>
  <section class="link_panel">
    <div class="panel">
      <a href="/user/myorder" class="link_item">
        <span class="left">我的订单</span>
        <img src="./imgs/right.png" class="right">
      </a>
      <a href="/user/myaddress" class="link_item">
        <span class="left">地址管理</span>
        <img src="./imgs/right.png" class="right">
      </a>
      <a href="/user/mycollected" class="link_item">
        <span class="left">我的收藏</span>
        <img src="./imgs/right.png" class="right">
      </a>
      <a href="/user/mycard" class="link_item">
        <span class="left">我的优惠券</span>
        <img src="./imgs/right.png" class="right">
        <div class="card_tip_show" v-if="isMentioned">{{cardNum}}张可用</div>
      </a>
    </div>
    <div class="panel">
      <a href="tel:400-184- 8888" class="link_item">
        <span class="left">在线客服</span>
        <img src="./imgs/right.png" class="right">
      </a>
      <a href="/user/help" class="link_item">
        <span class="left">帮助中心</span>
        <img src="./imgs/right.png" class="right">
      </a>
    </div>
  </section>
</template>
<style lang="css" scoped>
  @import './link_panel.css'
</style>
<script>

export default {
  name:'link_panel',
  data () {
    return {
      isMentioned:false,
      cardNum:0
    }
  },
  created(){
    var vm = this;
    $.get('/coupon/aviCouponNum',function(data){
      var data = data.content;
      if(data.num>0){
        vm.cardNum = data.num;
        vm.isMentioned = true;
      }
    });
  },
  methods: {
  }
}
</script>