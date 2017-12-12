import Vue from 'vue'
import App from './App'
import 'common/js/rem.js'
import 'common/css/common.css'
var app;
var help = {
	init(){
		app = new Vue({
	    	el: '#app',
		  	template: '<App/>',
		  	components: { App }
		});
	}
}
help.init();
