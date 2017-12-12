<template>
  <div id="app">
    <!-- 代码部分begin -->
    <div id="box" class="box">
        <div class="outer KinerLottery KinerLotteryContent"><img src="./imgs/choujiang_disk.png"></div>
        <!-- 大专盘分为三种状态：活动未开始（no-start）、活动进行中(start)、活动结束(completed),可通过切换class进行切换状态，js会根据这3个class进行匹配状态 -->
        <div class="inner KinerLotteryBtn start"></div>
    </div>
    <section class="pro_quota_tip" v-if="scrollTipList.length>0">
      <img src="./imgs/choujiang_note.png">
      <div class="tip_box">
        <template v-for="item in scrollTipList">
          <a href="javascript:;" v-if="item.isHit">恭喜{{item.userName+' '}}获得{{item.prizeName}}{{' '+item.quantity}}台</a>
        </template>
      </div>
    </section>
    <section class="bottom">
      <p>你有<span>{{drawNum}}</span>次抽奖机会</p>
      <div class="myPrize">
        <a href="javascript:;" @click="AjaxMyPrize"><img src="./imgs/choujiang_prize.png">我的奖品</a>
      </div>
    </section>
    <section class="dialog" v-show="showDialog">
      <div class="imgDialog">
        <a class="closeDialog" @click="showDialog=false;"><img src="./imgs/choujiang_close.png"></a>
        <div class="prizeInfo">
          <div class="title" v-if="showTitle">{{titleText}}</div>
          <div class="text" v-html="textContent"></div>
          <div class="prizeTip" v-html="prizeTipText"></div>
          <a class="btn" href="javascript:;" @click="showDialog=false;">{{imgDialogBtn}}<img src="./imgs/choujiang_next.png"></a>
        </div>
      </div>
      <div class="msk"></div>
    </section>
    <toast v-model="showAjaxFail" type="text" :time="800" is-show-mask :text="errorText" position="middle"></toast>
    <toast v-model="showGetGoods" type="text" :time="3000" is-show-mask :text="goodsName" position="middle"></toast>
  </div>
</template>

<script>
  import {Toast} from 'vux'
  // var returnUrl = window.top.location.href;
  var returnUrl = document.referrer;
  console.log(returnUrl)
  // var returnUrl = 'http://www.ppdai.com/event/1010gouwujie-zhuchang.html';
  var userLogin = false;
  export default {
    name: 'active_bigWheel',
    data(){
      return {
        couponList:[],
        scrollTipList:[],
        showAjaxFail:false,
        showGetGoods:false,
        showDialog:false,
        showTitle:true,
        errorText:'接口请求错误',
        drawNum:'?',
        isRolling:false,
        prizeId:0,
        titleText:'我的奖品',
        imgDialogBtn:'再下一单',
        textContent:'',
        prizeTipText:'奖品将在15个工作日陆续发出，<br>如有问题请联系4001848888',
        goodsName:'',
        goodsMap:{
          "1":{dec:'价值<span>1999</span>元空气进化器1台',deg:[1,22]},
          "8":{dec:'谢谢惠顾',deg:[25.5,65.5]},
          "6":{dec:'iWathch手表1台',deg:[68,112.5]},
          "5":{dec:'iPhoneX 1台',deg:[113,157]},
          "4":{dec:'Beast耳机1台',deg:[158,202]},
          "7":{dec:'谢谢惠顾',deg:[205.5,245.5]},
          "3":{dec:'价值69元自拍杆1个',deg:[248,292.5]},
          "2":{dec:'价值<span>199</span>元充电宝1个',deg:[293,337.5]}
        }
      }
    },
    created(){
      var vm = this;
      //获取中奖列表
      vm.$ajax.get('/drawPromotion/hitRecords')
      .then(response=>{
        var data = response.data;
        if(data.code==1){
          vm.scrollTipList = data.content;
          vm.$nextTick(()=>{
            vm.textScroll();
          })
        }else{
          vm.errorText = data.message;
          vm.showAjaxFail=true;
        }
      })
      .catch(response=>{vm.errorText = '接口请求错误';vm.showAjaxFail=true});
      //验证用户是否登录
      vm.$ajax.post('/user/isLogin')
      .then(response=>{
        var data = response.data;
        if(data.code==1){
          if(data.content){
            vm.getDrawInfo();
            userLogin = true;
          }else{
            userLogin = false;
          }
        }else{
          vm.errorText = data.message;
          vm.showAjaxFail=true;
        }
      })
      .catch(response=>{vm.errorText = '接口请求错误';vm.showAjaxFail=true});
    },
    components: {
      Toast
    },
    methods:{
      getDrawInfo(){
        var vm = this;
        //获取抽奖次数
        vm.$ajax.post('/drawPromotion/nums')
        .then(response=>{
          var data = response.data;
          if(data.code==1){
            vm.drawNum = data.content;
          }else{
            vm.errorText = data.message;
            vm.showAjaxFail=true;
          }
        })
        .catch(response=>{vm.errorText = '接口请求错误';vm.showAjaxFail=true});
      },
      bindEvent(){
        var vm = this;
        var whichAward = function(deg) {
            if ((deg > 337.5 && deg <= 360) || (deg >= 0 && deg <= 22)) { //10M流量
                return "获得价值<span>1999</span>元空气进化器1台";
            } else if ((deg >= 25 && deg <= 65.5)||(deg >= 205.5 && deg <= 245.5)) { //IPhone 7
                return "啊哦，没有中奖哦<br>再下一单可+1次抽奖机会";
            } else if (deg >= 68 && deg <= 112.5) { //30M流量
                return "获得iWathch手表1台";
            } else if (deg >= 113 && deg <= 157) { //5元话费
                return "获得iPhoneX 1台";
            } else if (deg >= 158 && deg <= 202) { //IPad mini 4
                return "获得Beats耳机1台";
            } else if (deg >= 248 && deg <= 292.5) { //20元话费
                return "获得价值69元自拍杆1个";
            } else if (deg >= 293 && deg <= 337.5) { //20元话费
                return "获得价值<span>199</span>元充电宝1个";
            }
        }
        var KL = new KinerLottery({
            rotateNum: 8, //转盘转动圈数
            body: "#box", //大转盘整体的选择符或zepto对象
            direction: 1, //0为顺时针转动,1为逆时针转动
            disabledHandler: function(key) {
                switch (key) {
                    case "noStart":
                        alert("活动尚未开始");
                        break;
                    case "completed":
                        alert("活动已结束");
                        break;
                }
            }, //禁止抽奖时回调
            clickCallback: function() {
                //此处访问接口获取奖品
                if(vm.isRolling){
                  return;
                }
                if(!userLogin){
                  window.top.location.href = "https://ac.ppdai.com/User/Login?redirect=" + encodeURI(returnUrl);
                  return;
                }
                if(vm.drawNum==0){
                  vm.goodsName = "抱歉，您的抽奖次数为0，成功下单即可 获得抽奖次数哦!";
                  vm.showGetGoods = true;
                  return;
                }
                vm.showTitle = true;
                vm.isRolling = true;
                vm.$ajax.post('/drawPromotion/doDraw')
                .then(response=>{
                  var data = response.data;
                  if(data.code==1){
                    vm.prizeId = data.content.prizeId;
                    var deg = vm.randomNum(vm.goodsMap[vm.prizeId]['deg'][0],vm.goodsMap[vm.prizeId]['deg'][1]);
                    // var deg = Math.floor(Math.random() * 360);
                    if((deg > 22.5 && deg <= 67.5)||(deg > 202.5 && deg <= 247.5)){
                      vm.showTitle = false;
                      vm.prizeTipText = '';
                      vm.textContent = whichAward(deg);
                      vm.imgDialogBtn = '朕知道了';
                    }else{
                      vm.titleText="手气不错~恭喜中奖！";
                      vm.textContent = whichAward(deg);
                      vm.imgDialogBtn = '再下一单';
                      vm.prizeTipText = '24小时内客服会联系您提供收件地址<br>请注意保持电话畅通！';
                    }
                    console.log(deg)
                    this.goKinerLottery(deg);
                  }else if(data.code==4){
                    vm.errorText = '正在抽奖，请不要重复点击';
                    vm.showAjaxFail=true;
                  }else{
                    vm.errorText = data.message;
                    vm.showAjaxFail=true;
                  }
                  vm.isRolling = false;
                })
                .catch(response=>{vm.errorText = '接口请求错误';vm.isRolling = false;vm.showAjaxFail=true});
            }, //点击抽奖按钮,再次回调中实现访问后台获取抽奖结果,拿到抽奖结果后显示抽奖画面
            KinerLotteryHandler: function(deg) {
                vm.drawNum--;
                vm.showDialog = true;
            } //抽奖结束回调
        });
      },
      AjaxMyPrize(){
        var vm = this;
        vm.titleText = '我的奖品';
        vm.showTitle = true;
        vm.textContent = '';
        vm.prizeTipText = '奖品将在15个工作日陆续发出，<br>如有问题请联系4001848888';
        vm.imgDialogBtn = '再下一单';
        if(!userLogin){
          window.top.location.href = "https://ac.ppdai.com/User/Login?redirect=" + encodeURI(returnUrl);
          return;
        }
        vm.showDialog = true;
        //获取我的奖品
        vm.$ajax.post('/drawPromotion/myPrizes')
        .then(response=>{
          var data = response.data;
          if(data.code==1){
            var prizeList = '';
            if(data.content.length==0){
              vm.textContent = '您暂时还没有获得奖品，<br>赶紧下单获得抽奖机会吧~';
            }else{
              for(let item of data.content){
                prizeList = prizeList+item.prizeName+' '+item.quantity+'台'+'<br>';
              }
              vm.textContent = prizeList;
            }
            vm.showDialog = true;
          }else{
            vm.errorText = data.message;
            vm.showAjaxFail=true;
          }
        })
        .catch(response=>{vm.errorText = '接口请求错误';vm.showAjaxFail=true});
      },
      randomNum(lowValue,highValue){
        var choice=highValue-lowValue+1;
        return Math.floor(Math.random()*choice+lowValue);
      },
      textScroll(){
        var vm = this;
        var i = 0;
        if(vm.scrollTipList.length>0){
          var tip_box = document.querySelector('.tip_box');
          var tip_box_a = document.querySelectorAll('.tip_box a');
          var tip_box_a_h = document.querySelectorAll('.tip_box a')[0].offsetHeight;
          setInterval(()=>{
            let startScroll = setInterval(()=>{
              i++;
              tip_box.style.bottom = (tip_box_a_h/10)*i+'px';
              if(i%10==0){
                clearInterval(startScroll)
              }
            },50)
            if(i>(10*(tip_box_a.length-2))){
              i = 0;
            }
          },2500)
        }
      }
    },
    mounted(){
      this.bindEvent();
    }
  }
</script>

<style>
  @import './active_bigWheel.css'
</style>
