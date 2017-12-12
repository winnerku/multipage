<template>
  <section class="sub_category">
    <div class="content">
      <div class="pro_list">
        <template v-for="category in categorys">
          <a :href="category.currCategoryUrl" :class="secondCategoryId==category.id?'list_item active':'list_item'" >{{category.name}}</a>
        </template>
      </div>
    </div>
  </section>
</template>
<style lang="css" scoped>
	@import './sub_category.css'
</style>
<script>
export default {
  name: 'sub_category',
  props:{
    categorys: {
      type: Array,
      default(){
        return [];
      }
    },
    secondCategoryId:{
      type:String,
      default:''
    }
  },
  updated(){
    var vm = this,list_width=0;
    setTimeout(function(){
      var pro_list = document.querySelector('.sub_category .pro_list');
      var list_item = document.querySelectorAll('.sub_category .list_item');
      $('.sub_category').find('.list_item').each(function(){
        list_width = list_width+$(this)[0].offsetWidth
      });
      pro_list.style.width = list_width+5+'px';
    },100)
    $('.pro_list').on('click','.list_item',function(){
      $(this).siblings().removeClass('active');
      $(this).addClass('active');
    });
    setTimeout(function(){
      if($('.sub_category').find('.active').length>0){
        var scrollLeft = $('.sub_category').find('.active').offset().left;
        $('.sub_category .content').scrollLeft(scrollLeft);
      }
    },200)
    // $('.pro_list').find('.list_item').first().click();
  },
  mounted (){
  }
}
</script>