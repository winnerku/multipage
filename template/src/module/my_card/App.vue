<template>
  <div id="app">
    <mall-top back="/user/index"></mall-top>
    <multitab-list ref="multitabList" title="我的优惠券">
      <template slot="multitab">
        <a href="#0" class="list_item">未使用</a>
        <a href="#2" class="list_item">已使用</a>
        <a href="#-1" class="list_item">已失效</a>
      </template>
      <template slot="thelist">
        <ul id="thelist" v-if="list.length!=0">
          <template v-for="item in list">
            <li :class="urlHash|cardBg">
              <section class="cardInfo">
                <div class="amount"><span class="unit">￥</span>{{item.faceValue}}</div>
                <div class="instruction">
                  <span class="IdName">{{item.couponName}}</span><br>
                  <span class="effectDate">{{item.startTime}} - {{item.endTime}}</span>
                </div>
              </section>
              <section class="tips">{{item.couponContent}}</section>
            </li>
          </template>
        </ul>
        <div v-else class="listNull">
          <img src="../../common/imgs/noCard.jpg"><br>
          <p>暂无优惠券</p>
        </div>
        <div id="pullUp">
          <span class="pullUpLabel"></span>
        </div>
      </template>
    </multitab-list>
    <div class="mask" v-show="showMask"></div>
    <div class="loading" v-show="loadShow"><i class="weui-loading" style="margin-top:30%;"></i></div>
  </div>
</template>

<script>
  import MallTop from 'components/mall_top_three/mall_top_three'
  import MultitabList from 'components/multitab_list/multitab_list'
  const option = {
    upLoadUrl:'/userCoupon/getUserCoupons',
    pageIndex:0,
    pageSize:5
  };
  export default {
    name: 'app',
    data () {
        return {
          option:option,
          list:[],
          loadShow:true,
          showMask:false,
          hasNext:true,
          pullUp:false,//上拉刷新，为true时触发上拉刷新
          urlHash:''//多tab切换列表必须的数据，hash值变化时更新数据，查看下面的watch
        }
    },
    created(){
      // this.LoadDate();
    },
    watch:{
      pullUp(val,oldVal){
        if(val){
          this.showMask = true;
          this.LoadDate();
        }
      },
      urlHash(val,oldVal){
        let vm =this;
        vm.hasNext = true;
        vm.list = [];
        vm.option.pageIndex=0;
        vm.loadShow = true;
        var multitabs = document.querySelectorAll('.pro_list a');
        document.querySelector('.pullUpLabel').innerHTML='';
        if(val == ''){
          var tab_a = document.querySelectorAll('.pro_list a')[0];
          vm.urlHash = tab_a.getAttribute('href').split("#").pop();
          return;
        }else{
          var tab_a = document.querySelector('.pro_list a[href="#'+val+'"]');
        }
        for(let item of multitabs){
          item.setAttribute('class','list_item')
        }
        tab_a.setAttribute('class','list_item active')
        this.LoadDate();
      }
    },
    filters:{
      cardBg(value){
        if(value=="0"){
          return 'list_item'
        }else{
          return 'list_item unable'
        }
      }
    },
    components: {
      MallTop,
      MultitabList
    },
    methods:{
      //列表数据加载
      LoadDate(){
        var vm = this;
        vm.option.pageIndex++;
        if(!vm.hasNext){
          vm.showMask = false;
          vm.$refs.multitabList.isOver = true;
          return;
        };
        vm.$ajax.get(vm.option.upLoadUrl,{params:{"state":vm.urlHash,"pageIndex":vm.option.pageIndex,"pageSize":vm.option.pageSize}})
        .then(response=>{
            vm.loadShow = false;
            vm.showMask = false;
            vm.pullUp = false;
            let result=response.data.responseContent;
            vm.hasNext = result.currentPage>=result.totalPage?false:true;
            result.personalCouponList.map((item,index)=>{
                vm.$data.list.push(item)
            })
        })
        .catch(response=>vm.$refs.multitabList.showAjaxFail=true)
      }
    }
  }
</script>

<style>
  @import './my_card.css'
</style>
