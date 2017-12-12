<template>
  <div id="app">
    <mall-top></mall-top>
    <swiper :list="banner_list" auto style="width:100%;margin:0 auto;" :aspect-ratio="300/800" dots-position="center"></swiper>
    <sub-category :categorys="categorys" :secondCategoryId="secondCategoryId"></sub-category>
    <goods-filter :categoryId="categoryId"></goods-filter>
    <category-list :option="option" ref="CategoryList"></category-list>
  </div>
</template>

<script>
  import MallTop from 'components/mall_top_two/mall_top_two'
  import { Swiper, SwiperItem} from 'vux'
  import SubCategory from 'components/sub_category/sub_category'
  import GoodsFilter from 'components/filter/filter'
  import CategoryList from 'components/category_list/categoryList'

  const pro_type = window.location.href.split("category").pop().split('/');
  // const pro_type = ['','1','2'];
  const categoryId = pro_type.length==3?pro_type[2]:pro_type[1];
  const option = {
    filter:{name:'',brands:[],sellers:[],endPrice:'',startPrice:'',orderBy:0,sort:0},
    upLoadUrl:'/product/searchSku',
    data:{"categoryId":categoryId}
  };
  export default {
    name: 'app',
    data () {
        return {
            isShow:false,
            banner_list: [],
            secondCategoryId:'',
            categorys:[],
            option:option,
            categoryId:categoryId
        }
    },
    methods:{
      doFilterAction(){
        this.$refs.CategoryList.filterAction();
      }
    },
    created(){
        var vm = this;
        if(pro_type.length==3){
          vm.secondCategoryId = pro_type[2];
        }
        $.ajax({
          url: '/avtm/getCateBanner',
          type: 'post',
          contentType:'application/json',
          dataType: 'json',
          data: JSON.stringify({"categoryId": pro_type[1]}),
          success:function(data){
            const imgList = data.responseContent;
            const bannerList = imgList.map((one, index) => ({
              url: one.linkUrl,
              img: one.pictureUrl+'?imageView2/1/w/750/h/280'
            }))
            vm.$data.banner_list = bannerList;
          },
          error:function(data){
            
          }
        })//获取大图

        $.get('/category/getChildCategories',{"parentId":pro_type[1]},function(data){
          vm.categorys = data.responseContent;
        })//获取二级目录
    },
    components: {
      MallTop,
      Swiper,
      SwiperItem,
      SubCategory,
      GoodsFilter,
      CategoryList
    },
    mounted(){
      var vm = this;
      // this.$watch('option.filter', function(){
      //   vm.$refs.CategoryList.filterAction();
      // }, {
      //   deep: true
      // })
    }
  }
</script>

<style>
  @import './category.css'
</style>
