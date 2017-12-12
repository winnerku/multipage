<template>
  <section>
    <div class="recommend">
      <div class="title">
        <span class="type_name">甄选•推荐</span>
      </div>
      <div class="content">
        <ul class="pro_list">
          <template v-for="proItem in recommendList">
            <a :href="proItem.linkUrl">
              <li class="list_item">
                <div><img v-lazy="proItem.pictureUrl+'?imageView2/1/w/200/h/200'"></div>
                <div>
                  <p class="name">{{proItem.name}}</p>
                  <p class="sale"><span class="unit">￥</span>{{proItem.price}}</p>
                  <p class="stages" v-if="proItem.monthPayments==null"></p>
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
	@import './recommend.css'
</style>
<script>
export default {
  name: 'recommend',
  data(){
    return {
      showMarkRight:showMarkRight,
    }
  },
  props:{
    recommendList:{
      type:Array,
      default(){
        return [];
      }
    }
  }
}
</script>