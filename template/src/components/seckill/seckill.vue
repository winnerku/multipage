<template>
  <section class="seckill">
    <div class="title">
      <img src="./imgs/seckill.png">
      <div><a href="javascript:;" class="active_name">{{seckillData.name}}</a><span class="hour">{{killTime.hours}}</span>:<span class="min">{{killTime.minutes}}</span>:<span class="second">{{killTime.seconds}}</span></div>
    </div>
    <div class="content">
      <ul class="pro_list">
        <template v-for="item in seckillData.productSkuList">
          <a :href="item.linkUrl" class="itemLink">
            <li class="list_item">
              <div class="pro_img"><img v-lazy="item.pictureUrl"></div>
              <div>
                <p class="pro_name">{{item.name}}</p>
                <p class="sale"><span class="unit">￥</span>{{item.price}}</p>
                <p class="no_sale">￥{{item.productSkuPrice}}</p>
                <!-- <p>￥{{item.monthPayments}}*{{item.months}}</p> -->
              </div>
              <div class="mark" v-if="item.iconTypeName!=''">{{item.iconTypeName}}</div>
              <div class="markRight" v-if="showMarkRight"><img src="../../common/imgs/doubleEleven.png"></div>
            </li>
          </a>
        </template>
      </ul>
    </div>
  </section>
</template>

<style lang="css" scoped>
	@import './seckill.css'
</style>
<script>
export default {
  name: 'seckill',
  props:{
    seckillData:{
      type:Object,
      default(){
        return {};
      }
    }
  },
  data () {
    return {
      showMarkRight:showMarkRight,
	    product_name:'',
      killTime:{
        hours:'',
        minutes:'',
        seconds:''
      }
    }
  },
  methods:{
    doTime(timeStr){
      var time=timeStr.replace(/-/g,':').replace(' ',':');
      time=time.split(':');
      var time1 = new Date(time[0],(time[1]-1),time[2],time[3],time[4],time[5]).getTime();
      return time1;
    },
  	Countdown(startTime,endTime,currentTime){
      var vm = this;
      var startDate = vm.doTime(startTime)
      var endDate = vm.doTime(endTime)
      var rightTime = startDate-currentTime;
      var leftTime=endDate-currentTime;
      if(rightTime>0){
        return;
      }else if(leftTime<0){
        var killNode = document.querySelector('.seckill');
        killNode.parentNode.removeChild(killNode);
        // $('.seckill').remove();
        return;
      }
      var leftsecond = parseInt(leftTime/1000); 
      var day1=Math.floor(leftsecond/(60*60*24));
      var hour=Math.floor((leftsecond-day1*24*60*60)/3600);
      if(hour.toString().length==1){
        hour = '0'+hour;
      }
      var minute=Math.floor((leftsecond-day1*24*60*60-hour*3600)/60);
      if(minute.toString().length==1){
        minute = '0'+minute;
      }
      var second=Math.floor(leftsecond-day1*24*60*60-hour*3600-minute*60); 
      if(second.toString().length==1){
        second = '0'+second;
      }
      setTimeout(function(){
        vm.killTime.hours = hour;
        vm.killTime.minutes = minute;
        vm.killTime.seconds = second;
        vm.seckillData.currentTime = currentTime+1000;
      },1000)
    }
  },
  updated(){
    var vm = this;
    if(typeof(vm.seckillData.currentTime)=='string'){
      vm.seckillData.currentTime = vm.doTime(vm.seckillData.currentTime);
    }
    vm.Countdown(vm.seckillData.startTime,vm.seckillData.endTime,vm.seckillData.currentTime);
  },
  mounted (){
    var vm = this;
    vm.killTime.hours = "00";
    vm.killTime.minutes = "00";
    vm.killTime.seconds = "00";
    setTimeout(function(){
      var pro_list = document.querySelector('.seckill .pro_list');
      var list_item = document.querySelectorAll('.seckill .itemLink');
      var list_width = list_item.length*(list_item[0].offsetWidth);
      pro_list.style.width = list_width+10+'px';
    },200);
  }
}
</script>