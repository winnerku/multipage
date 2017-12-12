<template>
  <div id="app">
    <mall-top></mall-top>
    <modify-address></modify-address>
  </div>
</template>

<script>
  import MallTop from 'components/mall_top_three/mall_top_three'
  import ModifyAddress from 'components/modify_address/modify_address'
  export default {
    name: 'app',
    data () {
        return {
        }
    },
    methods:{
      
    },
    components: {
      MallTop,
      ModifyAddress,
    }
  }
</script>

<style>
  @import './edite_address.css'
</style>
