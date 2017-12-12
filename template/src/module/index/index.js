import Vue from 'vue'
import App from './App'
import axios from 'axios'
//图片懒加载文档：https://github.com/hilongjw/vue-lazyload
import VueLazyload from 'vue-lazyload'//图片懒加载
import promise from 'es6-promise'
import 'common/js/rem.js'
import 'common/css/common.css'
const FastClick = require('fastclick')
FastClick.attach(document.body)//取消click事件的延迟
Vue.prototype.$ajax = axios
Vue.use(VueLazyload, {
  preLoad: 1,
  error: 'https://loanm.ppdaicdn.com/PPdaiStore/static/common/imgs/imgLoading.gif',
  loading: 'https://loanm.ppdaicdn.com/PPdaiStore/static/common/imgs/imgLoading.gif',
  attempt: 1,
  // the default is ['scroll', 'wheel', 'mousewheel', 'resize', 'animationend', 'transitionend']
  listenEvents: [ 'scroll' ]
})
promise.polyfill()
var app;
var shop_index = {
	init(){
		app = new Vue({
		  el: '#app',
		  template: '<App/>',
		  components: { App }
		});
	}
}
shop_index.init();
