// 内部全局对象
var _V = {
	android: false,
	ios: false,
	cdvUrlAndroid: '//m.ppdaicdn.com/act/common/js/cordova/android/cordova.js',
	cdvUrlIOS: '//m.ppdaicdn.com/act/common/js/cordova/ios/cordova.js',
	cdvReady: false //cordova 是否加载完成
}

// 内部使用方法集
var _basefn = {
	init: function() {
		var ua = window.navigator.userAgent.toLowerCase();
		_V.android = ua.match(/ppdai-android\/([\d.]+)/);
		_V.ios = ua.match(/ppdai-ios\/([\d.]+)/);

		if (_V.android || _V.ios) {
			_basefn.loadJsSrc(_V.ios && _V.cdvUrlIOS || _V.android && _V.cdvUrlAndroid);
			document.addEventListener("deviceready", function() {
				_V.cdvReady = true;
			},false);
		}
	},
	isArray: function(value) {
		if (typeof Array.isArray === 'function') {
			return Array.isArray(value);
		} else {
			return Object.prototype.toString.call(value) === '[object Array]';
		}
	},
	// 加载js引用
	loadJsSrc: function(urlList) {
		urlList = urlList || [];
		if (!_basefn.isArray(urlList)) {
			urlList = [urlList];
		}
		for (var i = 0; i < urlList.length; i++) {
			var script = document.createElement("script");
			script.type = "text/javascript";
			script.src = urlList[i];
			document.getElementsByTagName("head")[0].appendChild(script);
		}
	},
	// 判断Cordova是否加载完成，所有调用cordova都需要通过此方法
	// onSuccess：加载完成后执行的回调
	CheckCordovaReady: function(onSuccess) {
		// 如果不是app环境，直接返回
		if (!_V.android && !_V.ios) {
			return;
		}

		onSuccess = onSuccess || function() {};
		if (_V.cdvReady) {
			onSuccess();
			return;
		}

		var interval = setInterval(function() {
			if (_V.cdvReady) {
				console && console.log('cordova 加载完成！--PPDWebUI');
				onSuccess();
				clearInterval(interval);
			}
		}.bind(this), 100);
	},

	// 封装cordova.exec
	cordovaExec: function(arguments, serviceName, fnName) {
		var args = arguments,
			paramsArr = args[0] || [],
			onSuccess = args[1] || function() {},
			onError = args[2] || function() {};


		// 不需要参数的方法，paramsArr为成功回调，onSuccess为失败回调
		// 需要重新调整参数位置
		if(typeof paramsArr == 'function'){
			onError = onSuccess;
			onSuccess = paramsArr;
			paramsArr = [];
		}

		if (!_basefn.isArray(paramsArr))
			paramsArr = [paramsArr];
		_basefn.CheckCordovaReady(function() {
			cordova.exec(onSuccess, onError, serviceName, fnName, paramsArr);
		});
	}
}

_basefn.init();

// 对外接口
var PPDWebUI = {
	os: {
		android: !!_V.android,
		ios: !!_V.ios,
		inApp: !!_V.android || !!_V.ios,
		buildVersion: (_V.android && _V.android[1]) || (_V.ios && _V.ios[1])
	},
	SocialService: {
		// 参数：paramsArr, onSuccess, onError
		share: function() {
			_basefn.cordovaExec(arguments, "SocialService", "share");
		}
	},
	AccountService: {
		username: function() {
			_basefn.cordovaExec(arguments, "AccountService", "username");
		},
		auth: function() {
			_basefn.cordovaExec(arguments, "AccountService", "auth");
		}
	},

	CommonService:{
		// 返回原生开发页面
		// 目前仅支持跳转到首页金融生活（home/2）tab页
		// 参数：
		// 		path:"home/2" // 金融生活
		goHome: function() {
			_basefn.cordovaExec(arguments, "CommonService", "navigateTo");
		},

		// webview 内部跳转
		// 参数：
		// 		url:打开指定url页面
		openUrl: function() {
			_basefn.cordovaExec(arguments, "CommonService", "openUrl");
		},

		// 关闭当前页面
		// 无参数
		close: function() {
			_basefn.cordovaExec(arguments, "CommonService", "close");
		}
	}
}