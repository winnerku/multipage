import Vue from 'vue'
import App from './App'
import axios from 'axios'
import promise from 'es6-promise'
import 'common/js/rem.js'
import 'common/css/common.css'
const FastClick = require('fastclick')
FastClick.attach(document.body)//取消click事件的延迟
Vue.prototype.$ajax = axios
promise.polyfill()
var my_order,app;
my_order = {
	init(){
		app = new Vue({
			el: '#app',
			template: '<App/>',
			components: { App }
		});
	}
}
my_order.init();
