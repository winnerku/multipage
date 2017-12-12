<template>
  <section class="product_type">
    <template v-for="nav in NavList">
      <a :href="nav.linkUrl" class="type_item">
        <img :src="nav.pictureUrl">{{nav.name}}
      </a>
    </template>
  </section>
</template>
<style lang="css" scope>
	@import './product_type.css'
</style>
<script>
export default {
  name: 'hello',
  props:{
    NavList:{
      type:Array,
      default:[]
    }
  }
}
</script>