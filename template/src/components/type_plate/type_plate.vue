<template>
  <section>
    <div class="type_plate" v-for="pro in protypeList">
      <div class="title">
        <span class="type_name">{{pro.name}}</span>
        <a :href="pro.moreUrl">
          更多<img src="./imgs/more.png">
        </a>
      </div>
      <div class="banner"><a :href="pro.advBananerList[0].linkUrl"><img :src="pro.advBananerList[0].pictureUrl"></a></div>
      <div class="content">
        <ul class="pro_list">
          <template v-for="proItem in pro.advProductList">
            <a :href="proItem.linkUrl">
              <li class="list_item">
                <div><img v-lazy="proItem.pictureUrl+'?imageView2/1/w/200/h/200'"></div>
                <div>
                  <p class="name">{{proItem.name}}</p>
                  <p class="sale"><span class="unit">￥</span>{{proItem.price}}</p>
                  <p class="stages" v-if="proItem.monthPayments==null"></p>
                  <p class="stages" v-else><span class="unit">￥</span>{{proItem.monthPayments}}*{{proItem.months}}起</p>
                </div>
                <div class="mark" v-if="proItem.iconTypeName!=''">{{proItem.iconTypeName}}</div>
                <div class="markRight" v-if="showMarkRight"><img src="../../common/imgs/doubleEleven.png"></div>
              </li>
            </a>
          </template>
        </ul>
      </div>
    </div>
  </section>
</template>
<style lang="css" scoped>
	@import './type_plate.css'
</style>
<script>
export default {
  name: 'type_plate',
  props:{
    typeName:{
      type:String,
      default:'手机通讯'
    },
    protypeList:{
      type:Array,
      default(){
        return [];
      }
    }
  },
  data () {
    return {
      showMarkRight:showMarkRight,
    }
  },
  methods:{
  	
  },
  mounted (){
    
  }
}
</script>