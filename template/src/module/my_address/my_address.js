import Vue from 'vue'
import App from './App'
import 'common/js/rem.js'
import 'common/css/common.css'
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
	},
	bindEvent(){
		
	}
}
pro_detail.init();
