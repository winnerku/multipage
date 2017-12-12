<template>
  <section class="collect_list">
    <div class="myCollectTitle">我的收藏</div>
    <div id="wrapper">
      <ul id="thelist" v-if="list.length!=0">
        <template v-for="item in list">
          <li class="list_item">
            <div class="top">
              收藏时间：{{item.collectTime}}
            </div>
            <div class="content">
              <section class="left">
                <img :src="item.skuImgUrl+'?imageView2/1/w/80/h/90'">
              </section>
              <section class="right">
                <p class="order_title">{{item.skuDesc}}</p>
                <p class="skuName">{{item.skuName}}</p>
                <template v-if="item.saleStatus==1">
                  <a :href="item.skuSaleUrl" class="operate">购买</a>
                </template>
                <template v-else>
                  <a href="javascript:;" class="undercarriage">商品已下线</a>
                </template>
              </section>
            </div>
          </li>
        </template>
      </ul>
      <div v-else class="listNull">
        <img src="../../common/imgs/listNull.png"><br>
        <p>暂无收藏的商品</p>
      </div>
      <div class="loading" v-show="loadShow"><i class="weui-loading" style="margin-top:30%;"></i></div>
      <div id="pullUp">
        <span class="pullUpLabel"></span>
      </div>
    </div>
    <toast v-model="showAjaxFail" type="text" :time="800" is-show-mask text="接口请求错误" position="middle"></toast>
  </section>
</template>
<style lang="css" scoped>
	@import './collect_list.css'
</style>
<script>
let pageIndex=1,pageSize=3,hasNext=false;
let defaultOption = {"pageIndex":pageIndex,"pageSize":pageSize};
import { Toast } from 'vux'
export default {
  name: 'collect_list',
  props:{
    option:{
        type:Object,
        default(){
            return {};
        }
    }
  },
  data () {
    return {
	    list:[],
      loadShow:true,
      showAjaxFail:false,
    }
  },
  created(){
    var vm = this;
    defaultOption = Object.assign(defaultOption,vm.option.data);
    vm.$ajax.post(vm.option.upLoadUrl,defaultOption)
    .then(response=>{
        vm.loadShow = false;
        var result=response.data.responseContent;
        hasNext = result.hasNext;
        result.collectSkuInfoList.map((item,index)=>{
            vm.$data.list.push(item)
        })
        // vm.list=[1,2,3]
    })
    .catch(response=>vm.showAjaxFail=true)
  },
  components: {
    Toast
  },
  methods:{
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
    //获取文档的总高度
    getScrollHeight(){
      var scrollHeight = 0, bodyScrollHeight = 0, documentScrollHeight = 0;
  　　if(document.body){
  　　　　bodyScrollHeight = document.body.scrollHeight;
  　　}
  　　if(document.documentElement){
  　　　　documentScrollHeight = document.documentElement.scrollHeight;
  　　}
  　　scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
  　　return scrollHeight;
    },
    //获取浏览器视口的高度
    getWindowHeight(){
      var windowHeight = 0;
  　　if(document.compatMode == "CSS1Compat"){
  　　　　windowHeight = document.documentElement.clientHeight;
  　　}else{
  　　　　windowHeight = document.body.clientHeight;
  　　}
  　　return windowHeight;
    },
    pullUpAction(){
      var vm = this;
      defaultOption.pageIndex++;
      if(!hasNext){
          document.querySelector('.pullUpLabel').innerHTML='到底了';
          setTimeout(function(){
              document.querySelector('.pullUpLabel').innerHTML='';
          },2000)
          return;
      };
      vm.$ajax.post(vm.option.upLoadUrl,defaultOption)
      .then(response=>{
          vm.loadShow = false;
          var result=response.data.responseContent;
          hasNext = result.hasNext;
          result.collectSkuInfoList.map((item,index)=>{
              vm.$data.list.push(item)
          })
          // vm.list.push(2)
      })
      .catch(response=>vm.showAjaxFail=true)
    },
    upLoad(){
      var vm = this;
      window.onscroll=function(){
    　　if(vm.getScrollTop() + vm.getWindowHeight() == vm.getScrollHeight()){
            document.querySelector('.pullUpLabel').innerHTML='<i class="weui-loading"></i>上拉显示更多';
            vm.pullUpAction();
    　　}
      }
    }
  },
  mounted (){
    this.upLoad();
  }
}
</script>