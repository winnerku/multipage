<template>
    <div id="wrapper">
        <ul id="thelist" v-if="productes.length>0">
            <li class="list_item" v-for="product in productes">
                <a :href="product.linkUrl">
                    <img :src="product.pictureUrl+'?imageView2/1/w/230/h/230'">
                    <p class="name">{{product.name}}</p>
                    <p class="sale">￥{{product.price}}</p>
                    <p class="stages"><span class="unit">￥</span>{{product.monthPayments}}*{{product.months}}起</p>
                </a>
                <div class="mark" v-if="product.iconTypeName!=''">{{product.iconTypeName}}</div>
                <div class="markRight" v-if="showMarkRight"><img src="../../common/imgs/doubleEleven.png"></div>
            </li>
        </ul>
        <div v-else class="listNull">
            <img src="../../common/imgs/listNull.png"><br>
            <template v-if="option.isHash">
                <p>很抱歉！</p>
                <p>您搜索的<span class="color-blue">“{{keyWord}}”</span>暂无结果</p>
            </template>
            <template v-else>
                <p>产品努力上架中</p>
            </template>
        </div>
        <div class="loading" v-show="loadShow"><i class="weui-loading" style="margin-top:30%;"></i></div>
        <div id="pullUp">
            <span class="pullUpLabel"></span>
        </div>
    </div>
</template>
<style lang="css">
    @import "./categoryList.css"
</style>
<script>
    var pageIndex=1,pageSize=10,categoryId;
    var defaultOption = {"pageIndex":pageIndex,"pageSize":pageSize};
    export default {
        name:'upLoad',
        props:{
            option:{
                type:Object,
                default(){
                    return {};
                }
            }
        },
        data(){
            return {
                showMarkRight:showMarkRight,
                loadShow:true,
                productes:[],
                keyWord:'',
                hasNext:true
            }
        },
        created(){
            var vm = this;
            defaultOption = $.extend(defaultOption,vm.option.data,vm.option.filter);
            $.ajax({
                url: vm.option.upLoadUrl,
                type: 'post',
                contentType:'application/json;charset=UTF-8',
                dataType: 'json',
                data: JSON.stringify(defaultOption),
                success:function(data){
                    vm.loadShow = false;
                    vm.$data.productes = data.responseContent;
                    if(vm.$data.productes.length<pageSize){
                        vm.hasNext = false;
                    }
                },
                error:function(data){
                }
            })//获取产品列表
        },
        methods:{
            filterAction(){
                var vm = this;
                vm.loadShow = true;
                vm.hasNext = true;
                defaultOption.pageIndex=1;
                defaultOption = $.extend(defaultOption,vm.option.data,vm.option.filter);
                vm.$data.productes = [];
                $.ajax({
                    url: vm.option.upLoadUrl,
                    type: 'post',
                    contentType:'application/json;charset=UTF-8',
                    dataType: 'json',
                    data: JSON.stringify(defaultOption),
                    success:function(data){
                        vm.loadShow = false;
                        var result=data.responseContent;
                        vm.$data.productes = result;
                        if(vm.$data.productes.length<pageSize){
                            vm.hasNext = false;
                        }
                    },
                    error:function(data){
                        console.log("加载失败")
                    }
                })
            },
            pullUpAction(){
                var vm = this;
                if(vm.hasNext){
                    defaultOption.pageIndex++;
                    $.ajax({
                        url: vm.option.upLoadUrl,
                        type: 'post',
                        contentType:'application/json;charset=UTF-8',
                        dataType: 'json',
                        data: JSON.stringify(defaultOption),
                        success:function(data){
                            var result=data.responseContent;
                            if(result.length==0){
                                vm.hasNext = false;
                                vm.isEnd();
                                return;
                            }
                            $.each(result,function(index,item){
                                vm.$data.productes.push(item)
                            });
                        },
                        error:function(data){
                            console.log("加载失败")
                        }
                    })
                }else{
                    vm.isEnd();
                }
            },
            isEnd(){
                var vm = this;
                vm.hasNext = false;
                $(".pullUpLabel").html('到底了');
                setTimeout(function(){
                    $(".pullUpLabel").html('');
                },2000)
            },
            upLoad(){
                var vm = this;
                $(window).scroll(function(){
                　　var scrollTop = $(this).scrollTop();
                　　var scrollHeight = $(document).height();
                　　var windowHeight = $(this).height();
                　　if(scrollTop + windowHeight == scrollHeight){
                　　　　$(".pullUpLabel").html('<i class="weui-loading"></i>上拉显示更多')
                        vm.pullUpAction();
                　　}
                });
            },
        },
        mounted(){
            var vm = this;
            this.upLoad();
        }
    }
</script>