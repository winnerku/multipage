var showMarkRight = false;
var ppdNowDate = new Date();
var ppddeadLine = new Date('2017','12','13','23','59');
if(ppdNowDate.getTime()<=ppddeadLine.getTime()){
	console.log(ppddeadLine.getTime())
	console.log(ppdNowDate.getTime())
	showMarkRight = true
};
window.onload=function(){

	var _hmt = _hmt || [];
	(function() {
	  var hm = document.createElement("script");
	  hm.src = "https://hm.baidu.com/hm.js?7793a85089cf8d6555430d11e6b45034";
	  var s = document.getElementsByTagName("script")[0]; 
	  s.parentNode.insertBefore(hm, s);
	})();
	
	//加入安装了APP，则唤起APP
	var params = {
		url:window.location.href
	};
	if(window.PPDWebUI){
		if(PPDWebUI.os.inApp){
			// PPDWebUI.AccountService.auth(params,function(data){
			// 	var auth = data.auth;
			// 	// location.href = auth;
			// 	var doc = window.document,
			//     ifr = doc.createElement('iframe');
			// 	//创建一个隐藏的iframe
			// 	ifr.src = auth;
			// 	console.log(auth)
			// 	ifr.style.cssText = 'display:none;border:0;width:0;height:0;';
			// 	doc.body.appendChild(ifr);
			// },function(error){
			// 	console.log(error)
			// });
			PPDWebUI.AccountService.getToken(function(toKen){
				console.log('getToken success')
				console.log(toKen)
			},function(error){
				console.log('getToken fail')
			})
		}
	}

	//谷歌统计
	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){ 
	(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o), 
	m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m) 
	})(window,document,'script','https://www.google-analytics.com/analytics.js','ga'); 

	ga('create', 'UA-98708017-1', 'auto'); 
	ga('send', 'pageview'); 

	console.log("统计开始")
	
       //GrowingIO接口 begin
       var _vds = _vds || [];
       window._vds = _vds;
       (function () {
           _vds.push(['setAccountId', 'b9598a05ad0393b9']);
           var isAuthenticated = "False".toLowerCase();
           if (isAuthenticated == "true") {
               _vds.push(['setCS1', 'user_name', '']);
           }
           (function () {
               var vds = document.createElement('script');
               vds.type = 'text/javascript';
               vds.async = true;
               vds.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'dn-growing.qbox.me/vds.js?v=20170112';
               var s = document.getElementsByTagName('script')[0];
               s.parentNode.insertBefore(vds, s);
           })();
       })();
       //GrowingIO接口 end

	//拍拍贷埋点
	var track = {
	    log: function () {
	        var visitRecord = {
	            "VisitReffer": document.referrer,
	            "VisitUrl": encodeURI(window.location.href),
	            "UrlTitle": "M_" + document.title
	        }

	        if (visitRecord.UrlTitle.length > 100) {
	            visitRecord.UrlTitle = visitRecord.UrlTitle.substring(0, 100);
	        }

	        var path = getRootPath();
	        var requestUrl = path + "Home/UserVisitLog";

	        var r = function () {
	            ajax({
	                type: "POST",
	                url: requestUrl,
	                data: visitRecord,
	                success: function (data) {
	                },
	                error: function (data) {
	                }
	            });
	        };
	        r();
	    }
	};

	function getRootPath() {
	    return window.location.protocol + "//" + window.location.host + "/";
	}

    //等待500毫秒后执行  
    setTimeout(function () {
        track.log();
    }, 500);

	function ajax(){ 
	  var ajaxData = { 
	    type:arguments[0].type || "GET", 
	    url:arguments[0].url || "", 
	    async:arguments[0].async || "true", 
	    data:arguments[0].data || null, 
	    dataType:arguments[0].dataType || "text", 
	    contentType:arguments[0].contentType || "application/x-www-form-urlencoded", 
	    beforeSend:arguments[0].beforeSend || function(){}, 
	    success:arguments[0].success || function(){}, 
	    error:arguments[0].error || function(){} 
	  } 
	  ajaxData.beforeSend() 
	  var xhr = createxmlHttpRequest();  
	  xhr.responseType=ajaxData.dataType; 
	  xhr.open(ajaxData.type,ajaxData.url,ajaxData.async);  
	  xhr.setRequestHeader("Content-Type",ajaxData.contentType);  
	  xhr.send(convertData(ajaxData.data));  
	  xhr.onreadystatechange = function() {  
	    if (xhr.readyState == 4) {  
	      if(xhr.status == 200){ 
	        ajaxData.success(xhr.response) 
	      }else{ 
	        ajaxData.error() 
	      }  
	    } 
	  }  
	} 
	  
	function createxmlHttpRequest() {  
	  if (window.ActiveXObject) {  
	    return new ActiveXObject("Microsoft.XMLHTTP");  
	  } else if (window.XMLHttpRequest) {  
	    return new XMLHttpRequest();  
	  }  
	} 
	  
	function convertData(data){ 
	  if( typeof data === 'object' ){ 
	    var convertResult = "" ;  
	    for(var c in data){  
	      convertResult+= c + "=" + data[c] + "&";  
	    }  
	    convertResult=convertResult.substring(0,convertResult.length-1) 
	    return convertResult; 
	  }else{ 
	    return data; 
	  } 
	}
	//原生封装的ajax请求
	window.$ajax = ajax;
}