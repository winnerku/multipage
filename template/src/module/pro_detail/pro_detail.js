import Vue from 'vue'
import App from './App'
import 'common/js/rem.js'
import 'common/css/common.css'
const FastClick = require('fastclick')
FastClick.attach(document.body)//取消click事件的延迟
var app;
var pro_detail = {
	init(){
		app = new Vue({
	    	el: '#app',
		  	template: '<App/>',
		  	components: { App },
		  	created(){
		  	
		  	}
		});
		pro_detail.bindEvent();
	},
	bindEvent(){
		var startPageY,endPageY;
		$(document).on('touchmove',function(e){
	    	if($(e.target).parents(".cate_content").length>0){
	    		var scrollTop = $('.cate_class').scrollTop();
		　　　　var scrollHeight = $('.class_list').height();
		　　　　var windowHeight = $('.cate_class').height();
				endPageY = e.changedTouches[0].pageY;
				if(startPageY-endPageY>0){
			　　　　if(scrollTop + windowHeight >= scrollHeight-5){
			　　　　	e.preventDefault();
					}
			　　}else{
					if(scrollTop<=1){
						e.preventDefault();
					}
				}
	    	}
	    });
	    $(document).on('touchstart',function(e){
	    	startPageY = e.changedTouches[0].pageY;
	    });
	    $('.comfire_btn').on('click',function(){
	    	$('.choosePro').click();
	    })
	}
}
pro_detail.init();
