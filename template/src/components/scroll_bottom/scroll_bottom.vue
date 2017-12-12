<template>
  <section class="scroll_bottom">
    <div class="myCollectTitle">我的收藏</div>
    <scroller lock-x :height="scrollHeight" @on-pullup-loading="loadCollectList" :pullup-config="pullupConfig" use-pullup ref="scrollerBottom" v-if="bottomCount.length!=0">
      <div id="wrapper">
        <ul id="thelist">
          <li class="list_item" v-for="i in bottomCount">
            <div class="top">
              收藏时间：2017-08-11 11:12:11
            </div>
            <div class="content">
              <section class="left">
                <img src="http://file11info.ppdai.com/780780e14e934c16a9b3d1aa0676b0e3.png">
              </section>
              <section class="right">
                <p class="order_title">沙发斯蒂芬</p>
                <p class="skuName">大时代</p>
                <a href="javascript:;" class="operate" data-orderid="12121212" data-productname="安达市多">购买</a>
              </section>
            </div>
          </li>
          <li v-if="loadOver" class="isOver">到底了</li>
        </ul>
      </div>
    </scroller>
    <div v-else class="listNull">
        <img src="../../common/imgs/listNull.png"><br>
        <p>暂无收藏的商品</p>
    </div>
  </section>
</template>
<style lang="css" scoped>
	@import './scroll_bottom.css'
</style>
<script>
import { Scroller } from 'vux'
let pageIndex=0,pageSize=10,totalPage=1;
let defaultOption = {"pageIndex":pageIndex,"pageSize":pageSize};
export default {
  name: 'scroll_bottom',
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
      onFetching:false,
      scrollHeight:'',
      loadOver:false,
      pullupConfig:{loadingContent:'<i class="weui-loading"></i>加载中'},
	    bottomCount: []
    }
  },
  components:{
    Scroller
  },
  created(){
    var vm = this;
    defaultOption = Object.assign(defaultOption,vm.option.data);
    this.loadCollectList();
  },
  methods:{
    getScrollHeight(){
      let deviceHeight = window.screen.height;
      let topHeight = document.querySelector('.mall_top_three').offsetHeight+document.querySelector('.myCollectTitle').offsetHeight;
      this.scrollHeight = (deviceHeight-topHeight)+'px';
    },
    loadCollectList () {
      var vm = this;
      pageIndex++;
      if(!this.onFetching) {
        this.onFetching = true
        if(pageIndex>3){
          this.loadOver = true;
          this.$refs.scrollerBottom.disablePullup();
          setTimeout(()=>{
            this.loadOver = false;
          },2000)
          return;
        }
        vm.$ajax.post('/advertisment/getIndexCategoryNav')
        .then(response=>{
          vm.bottomCount.push(2);
          vm.bottomCount.push(1);
          vm.$nextTick(() => {
            setTimeout(()=>{
              vm.$refs.scrollerBottom.donePullup()
            },500)
          })
          vm.onFetching = false
        })
        .catch(response=>alert(response))
      }
    }
  },
  mounted (){
    this.getScrollHeight();
  }
}
</script>