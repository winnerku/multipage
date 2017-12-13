<template>
  <section class="pro_info">
    <div class="title">
      戴尔DELL灵越飞匣15ER-4725B 15.6英寸大屏笔记本电脑(i7-7500U 4G 1T M315 2G独显 FHD Win10) 官方标配
    </div>
    <div class="content">
      <div class="price row">商城价：<span class="unit">￥</span><span class="number">{{proInfo.price}}</span></div>
      <div class="sales row" v-if="showMarkRight">
        <a href="http://www.ppdai.com/event/12.12zhuhuichang.html"><span>促销：</span>双12专享优惠券→满1000减50，满2000减100，满4000减200，立即领取>></a>
      </div>
      <div class="des row"><span v-if="proInfo.hotWords!=''">{{proInfo.hotWords}}</span><span v-else>&nbsp;</span><span class="right">{{proInfo.sellerName}}</span></div>
      <div class="character row">
        <div class="left"><img src="./imgs/tips.png">假一罚十</div>
        <div class="left"><img src="./imgs/tips.png">15天退货保障</div>
        <div class="left"><img src="./imgs/tips.png">全国联保</div>
      </div>
    </div>
  </section>
</template>
<style lang="css" scoped>
	@import './pro_info.css'
</style>
<script>
export default {
  name: 'pro_info',
  props:{
    proInfo:{
      type:Object,
      default(){
        return {};
      }
    }
  },
  data(){
    return {
      showMarkRight:showMarkRight
    }
  }
}
</script>