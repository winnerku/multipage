<template>
  <section class="filter">
    <div class="filter_item">
      <a href="javascript:;" class="active" data-type="default">默认</a>
      <a href="javascript:;" data-type="price">价格
        <template v-if="!isPriceActive">
          <img src="../../common/imgs/filter/normal.png">
        </template>
        <template v-else-if="isPriceActive&&isDesc">
          <img src="../../common/imgs/filter/down.png">
        </template>
        <template v-else>
          <img src="../../common/imgs/filter/up.png">
        </template>
      </a>
      <a href="javascript:;" data-type="other">筛选<img src="../../common/imgs/filter/other.png"></a>
    </div>
    <div class="other_filter">
      <div class="filter_main">
        <section class="block" v-if="supplyListDate.length!=0">
          <div class="title">供应商名称</div>
          <div class="choose_btn supply">
          <template v-for="item in supplyListDate">
            <div class="btn_box" v-if="item.name!=null"><a href="javascript:;" :data-id="item.id">{{item.name}}</a></div>
          </template>
          </div>
        </section>
        <section class="block" v-if="brandListDate.length!=0">
          <div class="title">品牌名称</div>
          <div class="choose_btn brands">
          <template v-for="item in brandListDate">
            <div class="btn_box" v-if="item.name!=null"><a href="javascript:;" :data-id="item.id">{{item.name}}</a></div>
          </template>
          </div>
        </section>
        <section class="price_range">
          <div class="title">价格区间</div>
          <input type="number" v-model="minPrice" placeholder="最低价">
          <span class="to">-</span>
          <input type="number" v-model="maxPrice" placeholder="最高价">
        </section>
      </div>
      <div class="btns">
        <a href="javascript:;" class="cancel" @click="cancel">取消</a>
        <a href="javascript:;" class="comfire" @click="comfire">确定</a>
      </div>
    </div>
    <toast v-model="showErrorMsg" type="text" :time="800" is-show-mask :text="ErrorMsg" position="middle"></toast>
  </section>
</template>

<script>
  import { Toast } from 'vux'
  export default {
    name: 'filter',
    data () {
      return {
         isDesc:true,//价格是否降序排列
         isPriceActive:false,
         showErrorMsg:false,
         showMoreFilter:false,
         minPrice:'',
         maxPrice:'',
         ErrorMsg:'',
         filterOption:{name:'',brands:[],sellers:[],endPrice:'',startPrice:'',orderBy:0,sort:0},
         supplyChecked:[],
         brandsChecked:[],
         supplyListDate:[{name:'飞牛',id:'1'},{name:'京东',id:'2'},{name:'尾牙',id:'3'}],
         brandListDate:[{name:'第一',id:'1'},{name:'第二',id:'2'},{name:'第三',id:'3'}],
      }
    },
    props:{
      categoryId:String//一级类目的ID
    },
    methods:{
      cancel(){
        var vm = this;
        var moreFilter = document.querySelector('.other_filter');
        moreFilter.setAttribute('class','other_filter');
        vm.clearFilter();
      },
      filterValidate(){
        var vm = this;
        if(vm.supplyChecked.length==0&&vm.brandsChecked.length==0&&vm.maxPrice==''&&vm.minPrice==''){
          vm.ErrorMsg = '请选择至少一个筛选项';
          vm.showErrorMsg = true;
          return false;
        }
        if(parseFloat(vm.minPrice)>parseFloat(vm.maxPrice)){
          vm.ErrorMsg = '最低价不能高于最高价';
          vm.showErrorMsg = true;
          return false;
        }
        if(parseFloat(vm.minPrice)<0||parseFloat(vm.maxPrice)<0){
          vm.ErrorMsg = '价格不能为负数';
          vm.showErrorMsg = true;
          return false;
        }
        return true;
      },
      comfire(){
        var vm = this;
        var isOk = vm.filterValidate();
        if(!isOk){
          return;
        }
        vm.filterOption.brands = vm.brandsChecked;
        vm.filterOption.sellers = vm.supplyChecked;
        vm.filterOption.startPrice = vm.minPrice;
        vm.filterOption.endPrice = vm.maxPrice;
        var moreFilter = document.querySelector('.other_filter');
        moreFilter.setAttribute('class','other_filter');
        var filter_item = document.querySelectorAll('.filter_item a');
        var filter_other = document.querySelector('.filter_item a[data-type=other]');
        for(let item of filter_item){
          item.setAttribute('class','')
        }
        filter_other.setAttribute('class','active');
        vm.isDesc = true;
        vm.isPriceActive = false;
        vm.$parent.option.filter = vm.filterOption;
        vm.$parent.doFilterAction();
      },
      clearFilter(){
        var vm = this;
        var supplyList = document.querySelectorAll('.supply a');
        var brandList = document.querySelectorAll('.brands a');
        for(let item of supplyList){
          item.setAttribute('class','')
        }
        for(let item of brandList){
          item.setAttribute('class','')
        }
        vm.filterOption.brands = [];
        vm.filterOption.sellers = [];
        vm.filterOption.startPrice = '';
        vm.filterOption.endPrice = '';
        vm.maxPrice='';
        vm.minPrice='';
      },
      bindEvent(){
        var filter_item = document.querySelectorAll('.filter_item a');
        var moreFilter = document.querySelector('.other_filter');
        var supplyList = document.querySelectorAll('.supply a');
        var brandList = document.querySelectorAll('.brands a');
        var vm = this;
        for(let item of filter_item){
          item.addEventListener('click',function(){
            let dataType=this.getAttribute('data-type');
            if(dataType!='other'){
              for(let item of filter_item){
                item.setAttribute('class','')
              }
              this.setAttribute('class','active');
              if(dataType=='price'){
                vm.isPriceActive = true;
                vm.isDesc = !vm.isDesc;
                vm.filterOption.orderBy = 1;
                vm.filterOption.sort = vm.isDesc?0:1;
              }else{
                vm.isDesc = true;
                vm.isPriceActive = false;
                vm.filterOption.orderBy = 0;
                vm.filterOption.sort = 0;
              }
              vm.$parent.option.filter = vm.filterOption;
              vm.$parent.doFilterAction();
            }else{
              vm.showMoreFilter=true;
              moreFilter.setAttribute('class','other_filter show');
            }
          })
        }//筛选按钮

        for(let item of supplyList){
          item.addEventListener('click',function(){
            let supplyId = this.getAttribute('data-id');
            let isActive = this.getAttribute('class');
            if(isActive==''||isActive==null){
              this.setAttribute('class','active');
              vm.supplyChecked.push(supplyId)
            }else{
              this.setAttribute('class','');
              for(var i=0;i<vm.supplyChecked.length;i++){
                if(vm.supplyChecked[i]==supplyId){
                  vm.supplyChecked.splice(i,1);
                }
              }
            }
          })
        }//选择供应商按钮

        for(let item of brandList){
          item.addEventListener('click',function(){
            let brandId = this.getAttribute('data-id');
            let isActive = this.getAttribute('class');
            if(isActive==''||isActive==null){
              this.setAttribute('class','active');
              vm.brandsChecked.push(brandId)
            }else{
              this.setAttribute('class','');
              for(var i=0;i<vm.brandsChecked.length;i++){
                if(vm.brandsChecked[i]==brandId){
                  vm.brandsChecked.splice(i,1);
                }
              }
            }
          })
        }//选择品牌按钮

      },
    },
    created(){
        //获取供应商列表
        //获取商品二级类目列表
        var vm = this;
        vm.$ajax.post('/product/getBrandAndSeller',{categoryId:vm.$props.categoryId})
        .then(response=>{
          let data = response.data.responseContent;
          vm.supplyListDate = data.sellers;
          vm.brandListDate = data.brands;
          vm.$nextTick(()=>{
              vm.bindEvent();
          })
        })
        .catch(response=>{vm.ErrorMsg = '供应商品牌列表请求错误';vm.showErrorMsg = true;});
    },
    components: {
      Toast
    },
    mounted(){
      // setTimeout(()=>{
      //   this.bindEvent();
      // },500)
      document.body.addEventListener('touchmove',function(event){
        var othershow = document.querySelector('.other_filter.show');
        if(othershow){
          event.preventDefault;
        }
      })
    }
  }
</script>

<style>
  @import './filter.css'
</style>
