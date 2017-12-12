<template>
  <div id="app">
    <mall-top back="/"></mall-top>
    <limit-info :limitData="limitData" v-if="limitShow" :isMentioned="isMentioned"></limit-info>
    <link-panel></link-panel>
  </div>
</template>

<script>
  import MallTop from 'components/mall_top_three/mall_top_three'
  import LimitInfo from 'components/limit_info/limit_info'
  import LinkPanel from 'components/link_panel/link_panel'
  export default {
    name: 'app',
    data () {
      return {
        limitData:{},
        isMentioned:false,
        limitShow:false
      }
    },
    created(){
      var vm = this;
      $.get('/user/getUserAmount',function(data){
        vm.limitData = data.responseContent;
        if(vm.limitData.tempAmount>0){
          vm.isMentioned = true;
        }
        vm.limitShow = true;
      });
    },
    components: {
      MallTop,
      LimitInfo,
      LinkPanel
    }
  }
</script>

<style>
  @import './user_center.css'
</style>
