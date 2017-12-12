<template>
  <div id="app">
    <mall-top></mall-top>
    <template v-if="isPro">
      <swiper :list="pic_list" auto style="width:100%;margin:0 auto;" :aspect-ratio="800/800" dots-position="center"></swiper>
      <pro-info :proInfo="proInfo" v-show="isShow"></pro-info>
      <pro-choose ref="proChoose"></pro-choose>
      <pro-tab :proInfo="proInfo"></pro-tab>
      <buy-bottom :limitData="proInfo" :callBack="buyBtn" v-show="isShow"></buy-bottom>
    </template>
    <template v-else>
      <div class="listNull">
          <img src="../../common/imgs/listNull.png"><br>
          <p>商品不存在</p>
      </div>
    </template>
  </div>
</template>

<script>
  import MallTop from 'components/mall_top_three/mall_top_three'
  import { Swiper, SwiperItem} from 'vux'
  import ProInfo from 'components/pro_info/pro_info'
  import ProChoose from 'components/pro_choose/pro_choose'
  import ProTab from 'components/pro_tab/pro_tab'
  import BuyBottom from 'components/buy_bottom/buy_bottom'
  const productSkuId = window.location.href.split("product").pop().split('/').pop();
  // const productSkuId = 1057;
  export default {
    name: 'app',
    data () {
        return {
            isShow:false,
            pic_list: [],
            proInfo:{},
            isPro:true,
            productSkuId:productSkuId
        }
    },
    methods:{
      buyBtn(){
        this.$refs.proChoose.choosePro();
      }
    },
    components: {
      MallTop,
      Swiper,
      SwiperItem,
      ProInfo,
      ProChoose,
      ProTab,
      BuyBottom
    }
  }
</script>

<style>
  @import './pro_detail.css'
</style>
