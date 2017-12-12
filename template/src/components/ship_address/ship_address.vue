<template>
    <section class="ship_address">
      <div class="address_info" v-if="userData.length>0">
        <a href="/user/myaddress" class="address_link">
          <div class="user_info">
            <span class="name">{{userData[0].consignee}}</span><span class="phone">{{userData[0].mobile}}</span>
          </div>
          <div class="address">
            <div class="left logo"><img src="./imgs/position.png"></div>
            <div class="left text">{{userData[0].addressDetails}}</div>
            <div class="right go"><img src="./imgs/right.png"></div>
          </div>
        </a>
        <div class="border"></div>
      </div>
      <div class="write_address" v-else><a :href="editAddress"><img src="./imgs/add.png" class="add">请填写收货地址</a></div>
      <div class="pro_info">
        <div class="content">
          <section class="left">
            <img :src="proData.pictureUrl+'?imageView2/1/w/75/h/75'">
          </section>
          <section class="right">
            <p class="order_title">{{proData.proName}}</p>
            <p class="pro_point">{{proData.skuName}}</p>
            <p class="order_price"><span class="unit">￥</span>{{proData.price}}</p>
          </section>
        </div>
      </div>
    </section>
</template>
<style lang="css" scoped>
  @import './ship_address.css'
</style>
<script>

export default {
  name:'ship_address',
  props:{
    userData:{
      type:Array,
      default(){
        return [];
      }
    },
    proData:{
      type:Object,
      default(){
        return {};
      }
    }
  },
  data () {
    return {
      editAddress:'/user/addressedit'
    }
  }
}
</script>