import Vue from 'vue'
import App from './App'
import 'common/js/rem.js'
import 'common/css/common.css'
const FastClick = require('fastclick')
FastClick.attach(document.body)//取消click事件的延迟
var search_result,app;
search_result = {
	init(){
		app = new Vue({
			el: '#app',
			template: '<App/>',
			components: { App }
		});
	}
}
search_result.init();
