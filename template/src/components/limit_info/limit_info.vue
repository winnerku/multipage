<template>
    <section class="limit_info">
      <div class="left logo">
        <img src="./imgs/user_logo.png">
        {{limitData.userName}}
      </div>
      <ul class="right limit">
        <li>
          商城可用额度
          <div class="color-blue">{{limitData.avilableAmount}}</div>
        </li>
        <div class="limit_tip_show" v-if="isMentioned">恭喜您！已提额{{limitData.tempAmount}}元！</div>
      </ul>
    </section>
</template>
<style lang="css" scoped>
  @import './limit_info.css'
</style>
<script>

export default {
  name:'limit_info',
  props:{
    limitData:{
      type:Object,
      default(){
        return {};
      }
    },
    isMentioned:{
      type:Boolean,
      default(){
        return false
      }
    }
  }
}
</script>