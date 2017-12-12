<template>
  <div id="app">
    <mall-top></mall-top>
    <swiper :list="banner_list" auto style="width:100%;margin:0 auto;" :aspect-ratio="380/750" dots-position="center"></swiper>
    <product-type :NavList="nav_list"></product-type>
    <section class="pro_quota_tip" v-if="scrollTipList.length>0">
      <div class="tip_box">
        <template v-for="item in scrollTipList">
          <a :href="item.url" v-if="item.showFlag">{{item.content}}</a>
        </template>
      </div>
    </section>
    <section class="activity_ads" v-if="showActiveAds">
      <div class="banner">
        <a :href="activeAds.linkUrl">
          <img :src="activeAds.pictureUrl">
        </a>
      </div>
    </section>
    <seckill :seckillData="seckill_list" v-if="showSeckill"></seckill>
    <ads :AdsList="ads_list"></ads>
    <recommend :recommendList="recommendList" v-if="showRecommend"></recommend>
    <type-plate :typeName="proTypeName" :protypeList="protype_list" v-if="protype_list.length>0"></type-plate>
    <toast v-model="showAjaxFail" type="text" :time="800" is-show-mask text="接口请求错误" position="middle"></toast>
  </div>
</template>

<script>
  import MallTop from 'components/mall_top/mall_top'
  import { Swiper, SwiperItem, Toast} from 'vux'
  import ProductType from 'components/product_type/product_type'
  import Seckill from 'components/seckill/seckill'
  import Ads from 'components/ads/ads'
  import Recommend from 'components/recommend/recommend'
  import TypePlate from 'components/type_plate/type_plate'

  export default {
    name: 'app',
    data () {
      return {
        proTypeName:'手机通讯的',
        banner_list: [],
        nav_list:[],
        ads_list:[],
        seckill_list:{},
        scrollTipList:[],
        protype_list:[],
        recommendList:[],
        activeAds:{},
        isFirstTip:true,
        showSeckill:false,
        showRecommend:false,
        showAjaxFail:false,
        showActiveAds:false
      }
    },
    created(){
      var vm = this;
      vm.$ajax.post('/avtm/getIndexBanner')
      .then(response=>{
        let data = response.data;
        const bannerList = data.responseContent.map((one, index) => ({
          url: one.linkUrl,
          img: one.pictureUrl+'?imageView2/1/w/750/h/380'
        }));
        vm.$data.banner_list = bannerList;
      })
      .catch(response=>vm.showAjaxFail=true);

      vm.$ajax.post('/avtm/getIndexCategoryNav')
      .then(response=>{
        let data = response.data;
        vm.$data.nav_list = data.responseContent;
      })
      .catch(response=>vm.showAjaxFail=true)

      vm.$ajax.post('/avtm/getMarketingPic')
      .then(response=>{
        let data = response.data;
        vm.$data.ads_list = data.responseContent;
      })
      .catch(response=>vm.showAjaxFail=true)

      vm.$ajax.post('/discount/getIndexDiscount')
      .then(response=>{
        let data = response.data;
        if(data.responseContent==null){
          return;
        }
        if(data.responseContent.productSkuList.length>0){
          vm.$data.seckill_list = data.responseContent;
          vm.showSeckill = true;
        }
      })
      .catch(response=>vm.showAjaxFail=true)

      vm.$ajax.post('/avtm/getIndexRecommend')
      .then(response=>{
        let data = response.data;
        if(data.content.length>0){
          vm.recommendList = data.content;
          vm.showRecommend = true;
        }
      })
      .catch(response=>vm.showAjaxFail=true)

      //跑马灯文字接口
      vm.$ajax.get('/avtm/getIndexTexts')
      .then(response=>{
        let data = response.data;
        let firstTip = {};
        vm.$data.scrollTipList = data.content;
        if(data.content.length>0){
          for(let item of data.content){
            if(item.showFlag){
              firstTip = item;
              break;
            }
          }
          vm.$data.scrollTipList.push(firstTip);
        }
        vm.$nextTick(()=>{
            vm.bindEvent();
        })
      })
      .catch(response=>vm.showAjaxFail=true)

      vm.$ajax.post('/avtm/getIndexColumn')
      .then(response=>{
        let data = response.data;
        vm.$data.protype_list = data.responseContent;
      })
      .catch(response=>vm.showAjaxFail=true)

      //获取活动广告位
      vm.$ajax.get('/avtm/getPromotoPic')
      .then(response=>{
        let data = response.data.content;
        if(data.length>0){
          vm.$data.activeAds = data[0];
          vm.showActiveAds = true;
        }
      })
      .catch(response=>vm.showAjaxFail=true)
    },
    components: {
      MallTop,
      ProductType,
      Seckill,
      Ads,
      Recommend,
      TypePlate,
      Swiper,
      SwiperItem,
      Toast
    },
    methods:{
      bindEvent(){
        var vm = this;
        var i = 0;
        if(vm.scrollTipList.length>0){
          var tip_box = document.querySelector('.tip_box');
          var tip_box_a = document.querySelectorAll('.tip_box a');
          var tip_box_a_h = document.querySelectorAll('.tip_box a')[0].offsetHeight;
          setInterval(()=>{
            let startScroll = setInterval(()=>{
              i++;
              tip_box.style.bottom = (tip_box_a_h/10)*i+'px';
              if(i%10==0){
                clearInterval(startScroll)
              }
            },50)
            if(i>(10*(tip_box_a.length-2))){
              i = 0;
            }
          },2500)
        }
      },
      //提示滚动
      tipScroll(scrollHeight){
        console.log(scrollHeight)
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
      topScroll(){
        var vm = this;
        window.onscroll=function(){
      　　if(vm.getScrollTop()>80){
            document.querySelector('.mall_top').style.background="rgba(10,191,255,0.99)";
      　　}else{
            document.querySelector('.mall_top').style.background="transparent";
          }
        }
      }
    },
    mounted(){
      this.topScroll();
    }
  }
</script>

<style>
  @import './index.css'
</style>
