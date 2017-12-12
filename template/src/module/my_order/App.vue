<template>
  <div id="app">
    <mall-top></mall-top>
    <order-list :option="option"></order-list>
  </div>
</template>

<script>
  import MallTop from 'components/mall_top_three/mall_top_three'
  import OrderList from 'components/order_list/order_list'
  const option = {
    upLoadUrl:'/order/getMyOrders'
  };
  export default {
    name: 'app',
    data () {
        return {
          option:option
        }
    },
    components: {
      MallTop,
      OrderList
    }
  }
</script>

<style>
  @import './my_order.css'
</style>
