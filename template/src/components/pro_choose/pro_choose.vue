<template>
  <section class="pro_choose">
    <div class="content">
      <div class="row">已选</div>
      <div class="info row"><a href="javascript:;" @click="choosePro" class="choosePro"><span>{{skuName}}</span><span class="right">选择</span></a></div>
    </div>
    <div class="dialog" v-if="showContent">
      <div class="mask"></div>
      <div class="cate_content">
        <div class="cate_img">
          <img :src="pictureUrl">
          <div class="inline vertical-bottom">
            <p class="cate_sale">￥{{cate_sale}}</p>
            <p>{{skuName}}</p>
          </div>
        </div>
        <div class="cate_class">
          <ul class="class_list">
            <li class="class_item" v-for="item in class_list">
              <div class="name">{{item.attributeName}}</div>
              <div class="btn_list">
                <template v-for="btn in item.attributeList">
                  <a href="javascript:;" :class="btn.select?'btn active':'btn'" :data-id="btn.attributeValueId">{{btn.attributeValue}}</a>
                </template>
              </div>
            </li>
            <!-- <li class="class_item" data-name="periodNum">
              <div class="name">期数选择</div>
              <div class="btn_list">
                <template v-for="item in PeriodsList" v-if="PeriodsList.length>0">
                  <a href="javascript:;" :class="item.isSelect?'btn active':'btn'" data-name="periodNum" @click="periodNum=item.periodNum">{{item.periodText}}</a>
                </template>
              </div>
            </li> -->
          </ul>
        </div>
        <a href="javascript:;" :class="canBuy?'buy_btn':'buy_btn disabled'" @click="toBuy">{{buyName}}</a>
        <a href="javascript:;" @click="dialogClose" class="dialogClose">×</a>
      </div>
    </div>
  </section>
</template>
<style lang="css" scoped>
	@import './pro_choose.css'
</style>
<script>
import layer from 'vue-layer-mobile'
export default {
  name: 'pro_info',
  data() {
    return {
      skuName: '',
      pictureUrl: '',
      cate_sale: '',
      class_list: [],
      PeriodsList:[],
      periodNum: 12, //分期数
      canBuy: true,
      showContent: false,
      buyName: '确认购买',
      productSkuId: this.$parent.productSkuId
    }
  },
  created() {
    var vm = this;
    $.ajax({
      url: '/product/getSkuProDeatils',
      type: 'post',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({
        "productSkuId": vm.productSkuId
      }),
      success: function(data) {
        if (data.responseContent == null) {
          vm.$parent.isPro = false;
          return;
        }
        vm.skuName = data.responseContent.skuName;
        vm.pictureUrl = data.responseContent.picList[0];
        vm.cate_sale = data.responseContent.price;
        vm.$parent.pic_list = data.responseContent.picList.map((imgUrl, index) => ({
          url: 'javascript:;',
          img: imgUrl + '?imageView2/1/w/750/h/750'
        }));
        vm.$parent.proInfo = data.responseContent;
        vm.$parent.isShow = true;
      },
      error: function(data) {}
    });
    $.ajax({
      url: '/product/getAttribute',
      type: 'post',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({
        "productSkuId": vm.$parent.productSkuId
      }),
      success: function(data) {
        vm.class_list = data.responseContent;
      },
      error: function(data) {}
    })
    // $.ajax({
    //   url: '/user/getUserPeriods',
    //   type: 'get',
    //   contentType: 'application/json',
    //   dataType: 'json',
    //   success: function(data) {
    //     vm.PeriodsList = data.responseContent;
    //     for(let item of vm.PeriodsList){
    //       if(item.isSelect){
    //         vm.periodNum = item.periodNum;
    //         break;
    //       }
    //     }
    //   },
    //   error: function(data) {}
    // })
  },
  methods:{
  	choosePro(){
      this.showContent = true;
      setTimeout(function(){
        $(".dialog").show();
      },100)
      setTimeout(function(){
        $(".cate_content").addClass("animate");
      },200)
    },
    toBuy(){
      if(this.canBuy){
        // window.location.href = '/order/submit/'+this.productSkuId+'?periodNum='+this.periodNum;
        window.location.href = '/order/submit/'+this.productSkuId;
      }
    },
    dialogClose(){
      var vm = this;
      $(".dialog").hide();
      $(".cate_content").removeClass('animate');
      vm.skuName = vm.$parent.proInfo.skuName;
      vm.pictureUrl = vm.$parent.proInfo.picList[0];
      vm.cate_sale = vm.$parent.proInfo.price;
      vm.productSkuId = vm.$parent.productSkuId;
      vm.showContent = false;
    }
  },
  mounted() {
    var vm = this;
    $('.pro_choose').on('click', '.btn', function() {
      $(this).siblings().removeClass('active');
      $(this).addClass('active');
      if ($(this).data('name') == 'periodNum') {
        return;
      }
      var choosedID = [];
      $('.class_item').each(function() {
        if ($(this).data('name') != 'periodNum') {
          choosedID.push($(this).find('.active').data('id'));
        }
      });
      vm.canBuy = false;
      $.ajax({
        url: '/product/getSkuProSimpleByAttr',
        type: 'post',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({
          "attributeValueIds": choosedID,
          "productSkuId": vm.productSkuId
        }),
        success: function(data) {
          vm.productSkuId = data.responseContent.id;
          vm.skuName = data.responseContent.skuName;
          vm.pictureUrl = data.responseContent.pictureUrl;
          vm.cate_sale = data.responseContent.saleState == 1 ? data.responseContent.price : '缺货';
          vm.canBuy = data.responseContent.saleState == 1 ? true : false;
          vm.buyName = data.responseContent.saleState == 1 ? '确认购买' : '缺货';
        },
        error: function(data) {}
      })
    });
  }
}
</script>