<template>
  <section class="ads">
    <template v-for="ads in AdsList">
      <a :href="ads.linkUrl"><img :src="ads.pictureUrl"></a>
    </template>
  </section>
</template>
<style lang="css" scope>
	@import './ads.css'
</style>
<script>
export default {
  name: 'ads',
  props:{
    AdsList:{
      type:Array,
      default:[]
    }
  },
  data () {
    return {
	   product_name:''
    }
  },
  methods:{
  	
  },
  mounted (){
    
  }
}
</script>