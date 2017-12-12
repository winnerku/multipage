<template>
  <section class="mall_top_two">
    <a href="/" class="inline back" v-if="!PPDWebUI.os.inApp"><img src="./imgs/back.png"></a>
  	<div class="inline search" :style="PPDWebUI.os.inApp?'width:88%':''">
		  <form v-on:submit.prevent="onSubmit">
        <label><input type="search" v-model="product_name" class="product_name"><a :href="'/search#'+product_name"><img src="./imgs/search.png"></a></label>
      </form>
  	</div>
  	<div class="inline category_logo" @touchend="catIsShow=!catIsShow"><img src="./imgs/category.png"></div>
    <div class="vux-popover" v-show="catIsShow">
      <div class="vux-popover-arrow vux-popover-arrow-up"></div>
        <div>
          <div class="popover-demo-content">
            <template v-for="item in category">
              <a :href="item.currCategoryUrl" class="category">{{item.name}}</a>
            </template>
          </div>
        </div>
    </div>
  </section>
</template>
<style lang="css" scope>
	@import './mall_top_two.css'
</style>
<script>
export default {
  name: 'mall_top_two',
  props:{
  },
  data () {
    return {
    	product_name:'iPhone 8',
      category:[],
      catIsShow:false,
      PPDWebUI:PPDWebUI
    }
  },
  created(){
    var vm = this;
    $.get('/category/getFirstLayerCategories',function(data){
      vm.category = data.responseContent;
    })
  },
  methods:{
    onSubmit:function(){
      window.location.href='/search#'+this.product_name
    }
  },
  mounted(){
    var vm = this;
    $(".pro_list").on("touchstart",function(){
      vm.$data.catIsShow = false;
    })
  }
}
</script>