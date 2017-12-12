<template>
  <section class="use_card">
    <a href="javascript:;" @click="cardTip=true"><img src="../../common/imgs/cardTip.png" class="cardTip"></a>
    <confirm v-model="cardTip"
      title="优惠券使用说明"
      :showCancelBtn="false">
      <p class="tip_text">1.优惠券仅可用于分期商城购物使用<br>2.每笔订单仅限使用一张优惠券，不可叠加使用<br>3.订单状态为退货时，优惠券不予退回</p>
    </confirm>
    <div class="myTitle">{{title}}</div>
    <section class="main">
      <slot name="partOne">
      </slot>
      <slot name="partTwo">
      </slot>
      <slot name="None">
      </slot>
    </section>
    <toast v-model="showAjaxFail" type="text" :time="800" is-show-mask text="接口请求错误" position="middle"></toast>
  </section>
</template>
<style lang="css" scoped>
	@import './use_card.css'
</style>
<script>
import { Toast,Confirm } from 'vux'
export default {
  name: 'use_card',
  props:{
    title:''
  },
  data () {
    return {
      showAjaxFail:false,
      cardTip:false,
    }
  },
  components: {
    Toast,
    Confirm
  },
  methods:{
    
  }
}
</script>