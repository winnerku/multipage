import Vue from 'vue'
import App from './App'
import axios from 'axios'
import 'common/js/rem.js'
import 'common/css/common.css'
Vue.prototype.$ajax = axios
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
