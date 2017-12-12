import Vue from 'vue'
import App from './App'
import 'common/js/rem.js'
import 'common/css/common.css'
var app;
var order_confirm = {
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
order_confirm.init();
