<template>
  <section class="multitab_list">
    <div class="myTitle">{{title}}</div>
    <section class="multitab">
      <div class="content">
        <div class="pro_list">
          <slot name="multitab">
            <a href="#tabone" class="list_item">Tab一</a>
            <a href="#tabtwo" class="list_item">Tab二</a>
            <a href="#tabthree" class="list_item">Tab三</a>
          </slot>
        </div>
      </div>
    </section>
    <div id="wrapper">
      <slot name="thelist">
        <h3 style="text-align: center">列表内容</h3>
      </slot>
    </div>
    <toast v-model="showAjaxFail" type="text" :time="800" is-show-mask text="接口请求错误" position="middle"></toast>
  </section>
</template>
<style lang="css" scoped>
	@import './multitab_list.css'
</style>
<script>
import { Toast } from 'vux'
export default {
  name: 'multitab_list',
  props:{
    title:''
  },
  data () {
    return {
      showAjaxFail:false,
      isOver:false
    }
  },
  components: {
    Toast
  },
  watch:{
    isOver(val,oldval){
      if(val){
        document.querySelector('.pullUpLabel').innerHTML='到底了';
        setTimeout(function(){
            document.querySelector('.pullUpLabel').innerHTML='';
        },2000)
      }
    }
  },
  methods:{
    //事件绑定
    bindEvent(){
      var vm = this;
      var multitab = document.querySelector('.pro_list');
      var multitabs = document.querySelectorAll('.pro_list a');
      var urlHash = window.location.hash.split("#").pop();
      multitab.addEventListener('click',function(e){
        vm.isOver = false;
        for(let item of multitabs){
          item.setAttribute('class','list_item')
        }
        e.target.setAttribute('class','list_item active')
        setTimeout(()=>{
          let hashChange = window.location.hash.split("#").pop()
          vm.$parent.urlHash = hashChange;
        },0)
      });
      if('onhashchange' in window){
        window.onhashchange = function(){
          setTimeout(()=>{
            let hashChange = window.location.hash.split("#").pop()
            vm.$parent.urlHash = hashChange;
          },0)
        }
      }else{
          alert(window.navigator.appVersion+"<br>浏览器版本过低！请升级")
      }
      window.onscroll=function(){
        if(vm.$parent.loadShow) return;
        if(!vm.isOver){
          if(vm.getScrollTop() + vm.getWindowHeight() == vm.getScrollHeight()){
            document.querySelector('.pullUpLabel').innerHTML='<i class="weui-loading"></i>上拉显示更多';
            vm.$parent.pullUp = true;
      　　}
        }
      }
      if(urlHash==''){
        var first_item = document.querySelectorAll('.pro_list a')[0];
        first_item.setAttribute('class','list_item active');
        vm.$parent.$data.urlHash = first_item.getAttribute('href').split("#").pop();
      }else{
        for(let item of multitabs){
          let hash = item.getAttribute('href').split("#").pop();
          if(urlHash==hash){
            item.click();
            break;
          }
        }
      }
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
    }
  },
  mounted (){
    this.bindEvent();
  }
}
</script>