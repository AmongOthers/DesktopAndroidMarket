define(['jquery'],function($){
	
	 var pageUrl=window.location.href;
	
	 if(pageUrl.indexOf('http://www.phone580.com')==-1){
		 var webroot='http://phone580.com';
		
	 }else{
		 var webroot='http://www.phone580.com';
	 }
	 var apiroot=webroot+'/fbsapi/';
	

	
	/*var webroot='http://10.20.1.47:8082';
	var apiroot=webroot+'/fbs/';*/

    //webroot = 'http://127.0.0.1:3000';
    //apiroot = webroot + '/';
	 webroot = "";
	 apiroot = "/";

	//var imgroot=webroot+'/xfolder';
    var seps = pageUrl.split(/[/:]/);
    var hostname;
    //IE结果不包含空字符串, 但是chrome包含
    for (var i = 1; i < seps.length; i++) {
        if (seps[i]) {
            hostname = seps[i];
            break;
        }
    }
	var imgroot="http://" + hostname + "/";
	var stlroot=webroot+'/ssWebsite/website/';
	var exportroot=webroot+'/ssWebsite';
	var notReadTotal=0;



	//判断浏览器 
	var isIe6=navigator.userAgent.search(/msie 6.0/gi) != -1;
	var isIe7=navigator.userAgent.search(/msie 7.0/gi) != -1;
	var isIe8=navigator.userAgent.search(/msie 8.0/gi) != -1;
	var isIE678=isIe6||isIe7||isIe8;
		
	//加载loading图片
	var loading=function(mark_type){
		//加载loading图片
		if($('#masker').length>0) {
			return false;
		}
		var mark_layer='';
		if(mark_type!=null&&mark_type=="grey"){
			mark_layer+='<div class="masker" id="masker"></div>';
		}else{
			mark_layer+='<div class="w_masker" id="masker"></div>';
		}
		mark_layer+='<div class="mask-layer" id="maskLayer"><div class="loadingBox radius5"><span class="loadingImg"></span>Loading...</div></div>';
		
		$('body').append(mark_layer);
		$('#masker').width($(window).width());
		$('#masker').height($(window).height());
		$('#maskLayer').width($(window).width());
		$('#maskLayer').height($(window).height());
		var mltop=($(window).height()-44)/2;
		var mlleft=($(window).width()-140)/2;
		$('#maskLayer').css('margin-top',mltop);
		$('#maskLayer').css('margin-left',mlleft);
		
		var isIe6=navigator.userAgent.search(/msie 6.0/gi) != -1;
		if (isIe6){
			//IE6兼容
			$('#masker').css('top',$(window).scrollTop());
			$('#masker').css('left',$(window).scrollLeft());
			$('#maskLayer').css('margin-top',$(window).scrollTop()+mltop);
			$('#maskLayer').css('margin-left',$(window).scrollLeft()+mlleft);
			
			$(window).scroll(function(){
				$('#masker').css('top',$(window).scrollTop());
				$('#masker').css('left',$(window).scrollLeft());
				$('#maskLayer').css('margin-top',$(window).scrollTop()+mltop);
				$('#maskLayer').css('margin-left',$(window).scrollLeft()+mlleft);
			});
		}
		
	};
	var removeLoading=function(){
		if($('#masker')!=null){
			$('#masker').remove();
		}
		if($('#maskLayer')!=null){
			$('#maskLayer').remove();
		}
	};
	//加载遮罩层(当进入会员中心后，使用dialog弹窗时加载遮罩层)
	var layerBox=function(){
		$('body').append('<div id="gMasker" class="g-masker"></div>')
		$('#gMasker').show();
		$('#gMasker').width($(window).width());
		$('#gMasker').height($(window).height());
		var isIe6=navigator.userAgent.search(/msie 6.0/gi) != -1;
		if (isIe6){
			//IE6兼容
			$('#gMasker').css('top',$(window).scrollTop());
			$('#gMasker').css('left',$(window).scrollLeft());
			$(window).scroll(function(){
				$('#gMasker').css('top',$(window).scrollTop());
				$('#gMasker').css('left',$(window).scrollLeft());
			});
		}
	};
	var removeLayerBox=function(){
		$('#gMasker').remove();
	}

	//弹出提示信息
	var tipLayer=function(text){
		//代替alert
		//加载loading图片
		var isIe6=navigator.userAgent.search(/msie 6.0/gi) != -1;
		var isIe7=navigator.userAgent.search(/msie 7.0/gi) != -1;
		if (isIe6){
			alert(text);
		}else{
			if($('#tipMasker').length>0){
				return false;
			}
			var tip_layer='';
			tip_layer+='<div class="masker" id="tipMasker"></div>';
			tip_layer+='<div class="mask-layer" id="tipMaskLayer"><div class="tipBox radius5"><p>'+text+'</p><button class="radius5">确认</button></div></div>';
			
			$('body').append(tip_layer);
			$('#tipMasker').width($(window).width());
			$('#tipMasker').height($(window).height());
			var sLeft=($(window).width()-$('#tipMaskLayer').width())/2;
			var sTop=($(window).height()-$('#tipMaskLayer').height())/2;
			$('#tipMaskLayer').css('margin-left',sLeft);
			$('#tipMaskLayer').css('margin-top',sTop);
			$('#tipMaskLayer').find('button').click(function(){
				 removeTipLayer();
			});
		
		}
	};
	
	var removeTipLayer=function(){
		if($('#tipMasker')!=null){
			$('#tipMasker').remove();
		}
		if($('#tipMaskLayer')!=null){
			$('#tipMaskLayer').remove();
		}
	};

	//弹出消息确认框
	var confirmBox=function(text,confn,canfn){
		//代替confirm
		if(confn!=null&&canfn!=null){
			var isIe6=navigator.userAgent.search(/msie 6.0/gi) != -1;
			var isIe7=navigator.userAgent.search(/msie 7.0/gi) != -1;
			if (isIe6){
				var answer=confirm(text);
				if(answer==true){
					 confn();
				}else{
					 canfn();
				}
			}else{
				if($('#confirmMasker').length>0){
					return false;
				}
				var tip_layer='';
				tip_layer+='<div class="masker" id="confirmMasker"></div>';
				tip_layer+='<div class="mask-layer" id="confirmMaskLayer"><div class="tipBox radius5"  ><p >'+text+'</p><button class="radius5" name="cancel">取消</button><button class="radius5" name="conf">确认</button></div></div>';
				
				$('body').append(tip_layer);
				$('#confirmMasker').width($(window).width());
				$('#confirmMasker').height($(window).height());
				var sLeft=($(window).width()-$('#confirmMaskLayer').width())/2;
				var sTop=($(window).height()-$('#confirmMaskLayer').height())/2;
				$('#confirmMaskLayer').css('margin-left',sLeft);
				$('#confirmMaskLayer').css('margin-top',sTop);
				$('#confirmMaskLayer').find('button[name="conf"]').click(function(){
					 confn();
				});
				$('#confirmMaskLayer').find('button[name="cancel"]').click(function(){
					 canfn();
				});
			
			}
		}
		
	};
	var removeConfirmBox=function(){
		if($('#confirmMasker')!=null){
			$('#confirmMasker').remove();
		}
		if($('#confirmMaskLayer')!=null){
			$('#confirmMaskLayer').remove();
		}
	};
	//cookie
	var setCookie=function(name,value,expires,path){
		if(typeof name==='string'&&name!=''&&typeof value != 'undefined'){
			var str = name+ "=" + encodeURIComponent(value);
			if(expires&&typeof expires==='number'){
				var date = new Date();
				date.setTime(date.getTime() + expires*24*3600*1000);
				str += "; expires=" + date.toGMTString();
			}
			if(path){
				str+=";path="+path; 
			}else{
				str+=";path=/"; //统一路径
			}
			document.cookie = str;
		}
	};
	var getCookie=function(name){
		var value='';
		if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = $.trim(cookies[i]);
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    value = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
			return value;
        }
	};
	//changeTab
	var changeTab=function(obj){
		var tabObj=obj.tabObj;
		var contObj=obj.contObj;
		var className=(obj.className==null?'visited':obj.className);
		tabObj.each(function(i){
			$(this).click(function(){
				tabObj.removeClass(className).eq(i).addClass(className);
				contObj.hide().eq(i).show();
			});
		});
	};
	
	var loginState=function(islogin){
	    var userName=getCookie('_userName');
		var noticeStr='';
		var userType=getCookie('userType');
		if(islogin){
			if(userName!=null&&userName!=''){
				if(userType==null||this.userType==''){
					notLogin();
				}else if(userType=='SHQD_QY_E'){
					noticeStr='';
				}else{
					noticeStr='<a class="notice" id="trunNotePage"><span></span>公告(<em id="notReadNoticeCount">0</em>)</a>&nbsp;&nbsp;|&nbsp;&nbsp;';
				}
				var state=noticeStr+
					'<a class="user" id="Userlogin" href="index.html'+'"><span></span>'+userName+'</a>&nbsp;&nbsp;|&nbsp;&nbsp;'+
					'<span id="logOut" class="logout">退出</span>';
				$('#loginState').html(state);
				$('#logOut').click(function(){
					loginOut(true);
				});
				if($('#trunNotePage').length>0){
					$('#trunNotePage').click(function(){
						frame.loadPage('#MENHU_ANNOUNCE');
					});
				}
			}else{
				if(userType==null||this.userType==''){
					notLogin();
				}else if(userType=='SHQD_QY_E'){
					noticeStr='';
				}else{
					noticeStr='<a class="notice" id="trunNotePage"><span></span>公告(<em id="notReadNoticeCount">0</em>)</a>&nbsp;&nbsp;|&nbsp;&nbsp;';
				}
				var state=noticeStr+'<a class="user"><span></span>用户：</a>';
				$('#loginState').html(state);
				if($('#trunNotePage').length>0){
					$('#trunNotePage').click(function(){
						frame.loadPage('#MENHU_ANNOUNCE');
					});
				}
			}
		}else{
			if(userName!=null&&userName!=''){
				var state='<a href="/admin/index.html">'+userName+'</a>'+
					'<span class="vline">|</span><span class="logout" id="logOut">退出</span>';
				$('#loginState').html(state);
				$('#logOut').click(function(){
					loginOut(false);
				});
			}else{
				var state='<a class="noico blueLink " href="voucherCenter.html">充值中心</a><a href="members.html" class="blueLink">登录</a><a href="joinUs.html" class="blueLink">诚聘英才</a>';
				$('#loginState').html(state);
			}
			$('#members').click(function(){
				if(userName!=null&&userName!=''&&userType!=null&&userType!=''){
					window.location.href="admin/index.html";
				}else{
					window.location.href="members.html";
				}
			});
			
		}
	};
	var notLogin=function(){
			setCookie('userType','');
			setCookie('_authToken','');
			setCookie('_userName','');
			setCookie('isAgent','');
			setCookie('isYDSHQD','');
			window.location.href="../members.html";
	};
	var loginOut=function(islogin){
		$.ajax({
		   type: "GET",
		   url: apiroot+"api/user/logout",
		   dataType:"jsonp",
		   jsonp:"callback",
		   success: function(result){
				setCookie('userType','');
				setCookie('_userName','');
				setCookie('_authToken','');
				setCookie('isAgent','');
				setCookie('isYDSHQD','');
				if(islogin){
					window.location.href="../members.html";
				}else{
					window.location.href="members.html";
				}
		   },
		   error:function(){
		   }
		});
	};
	var changeCode=function(id){
			//更改验证码
			var t=Math.random();
			//$('#'+id).attr('src',apiroot+'api/web/showvercode?randomgen='+t);
			$('#'+id).attr('src',apiroot+'api/web/newvercode?key=website&randomgen='+t);
			
	};
	var timeFormat=function(time,full,separator){
		if(separator){
			var sep=separator;
		}else{
			var sep='-';
		}
		var fTime=null;
		if((typeof time=='object')&&(time.constructor==Date)){
			fTime=time;
		}else{
			fTime=new Date(time);
		}
		
		var timestr='';
		timestr+=fTime.getFullYear()+sep;
		timestr+=(fTime.getMonth()>8?(fTime.getMonth()+1):'0'+(fTime.getMonth()+1))+sep;
		timestr+=(fTime.getDate()>9?fTime.getDate():'0'+fTime.getDate());
		if(full){
			timestr+=' '+fTime.getHours()+':'+fTime.getMinutes()+':'+fTime.getSeconds();
		}
		return timestr;
	};
	
	var getQueryString=function(name) { //获取url参数
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return unescape(r[2]); return null;
	};
	
	//二维码
	var getQRCode=function(){
		var qr=$('<div>');
		var qrCon='<div class="fzsqrCode"><span class="close"></span><P>蜂助手</p><div class="qrImg"><span class="fzsqrimg"></span></div><p>点击或扫描下载</p></div>';
		qr.html(qrCon);
		$('#apps,#home').append(qr);
		
		var closeBtn=qr.find('.close');
		qr.click(function(event){
			var event = event? event: window.event;
			var target = event.srcElement ? event.srcElement:event.target;
			if(target.className!='close'){
				window.location.href="http://t.cn/8FhHSvu";
			}else{
				qr.remove();
			}
		});
	};
	
	//轮播
	
	var carousel=function(options){
		this.carBlock=(options.carBlock!=null?options.carBlock:null);//轮播区域
		this.carBox=(options.carBox!=null?options.carBox:null);//轮播内容区域
		this.carObj=(options.carObj!=null?options.carObj:null);//轮播图片
		this.carBtn=(options.carBtn!=null?options.carBtn:null);//轮播按钮
		this.isPng=(options.isPng!=null?options.isPng:0);//是不是png格式
		this.changeType=(options.changeType!=null?options.changeType:0);//轮播类型{"'||0表示默认,1表示淡入淡出}
		this.direction=(options.direction!=null?options.direction:'marginLeft');//轮播方向
		this.btnClassName=(options.btnClassName!=null?options.btnClassName:'visited');//轮播btn样式
		this.timeout=(options.timeout!=null?options.timeout:5000);//轮播时间间隔
		this.timeChange=null,this.num=0,this.prevNum=0;
		this.objWidth=$(this.carObj[0]).width();//图片的宽度
		this.objHeight=$(this.carObj[0]).height();//图片的宽度
		this.objlen=this.carObj.length;//图片的数量
		if(options.changeType==0||options.changeType==''){
			this.carObj.removeClass('hide');
		}
		if(isIE678 && this.isPng && options.changeType==1){
			this.carObj.each(function(){
				if($(this).hasClass('opacity0')){

					$(this).removeClass('opacity0');
					$(this).hide();
				}
			});
		}
		var obj=this;
		this.stopChange();
		this.carBtnHover(obj);
		this.timeChange=setTimeout(function(){obj.changeImg(obj);}, this.timeout);
	};
	carousel.prototype.changeImg=function(obj,focusNum){
		clearTimeout(obj.timeChange);
		if(obj.changeType==1){//1表示淡入淡出
			if(isIE678 && obj.isPng){

				$(obj.carObj).eq(obj.num).stop().hide();
			}else{
				$(obj.carObj).eq(obj.num).stop().animate({ 'opacity': 0 }, 700);
			}
			if(++obj.num>obj.objlen-1) obj.num=0;
			if(focusNum!=null){
			  obj.num=focusNum;
			}
			if(isIE678 && obj.isPng){
				$(obj.carObj).eq(obj.num).stop().show();
			}else{
				$(obj.carObj).eq(obj.num).stop().animate({ 'opacity': 1 }, 700);
			}
					
		}else{//表示默认
			if(++obj.num>obj.objlen-1) obj.num=0;
			if(focusNum!=null){
				  obj.num=focusNum;
			}
			if(obj.direction=="marginLeft"){
				$(obj.carBox).stop().animate({ 'margin-left': -obj.objWidth*obj.num}, 500);
			}
			if(obj.direction=="marginTop"){
				$(obj.carBox).stop().animate({ 'margin-top': -obj.objHeight*obj.num}, 500);
			}
			
		}
		$(obj.carBtn).removeClass(obj.btnClassName).eq(obj.num).addClass(obj.btnClassName);
		obj.timeChange=setTimeout(function(){obj.changeImg(obj);},obj.timeout);
	};
	//停止动画
	carousel.prototype.stopChange=function(){
		var obj=this;
		var carBlock=obj.carBlock;
		$(carBlock).hover(function(){
			clearTimeout(obj.timeChange);
		},function(){
			obj.timeChange=setTimeout(function(){obj.changeImg(obj);}, obj.timeout);
		});
		
	};
	//按钮移动
	carousel.prototype.carBtnHover=function(){
		var obj=this;
		$(obj.carBtn).each(function(i){
			$(this).hover(function(){
				if(i!=obj.num){
					obj.changeImg(obj,i);
				}
				clearTimeout(obj.timeChange);
			});
		});
	};
		
	//封装事件
	
	var event=function(options){
		$(document).off(options.eventType,options.obj).on(options.eventType,options.obj,function(event){
			options.fn(this,event);
		});
	};
	

	//门户未登陆前弹窗样式
	var unLoginDialog =function(dialogHtml,style,title){
		var dialogStr=[];
		var titleHtml='';
		if(title&&title!=''){
			titleHtml='<div class="pd-header">'+title+'</div>';
		}
		dialogStr.push('<div class="pro-masker notLoginDialogMasker"></div>');//蒙版
		dialogStr.push('<div class="product-details notLoginDialogContent">'+titleHtml+'<div class="pd-con">'+dialogHtml+'</div><div><span class="pd-close notLoginDialogClosed"></span></div></div>');
		
		$('body').append(dialogStr.join('')).addClass('html-body-overflow');
		$('.notLoginDialogContent .pd-con').height($(window).height()-80);
		if(style){
			if(style.width){
				$('.notLoginDialogContent').width(style.width);
				$('.notLoginDialogContent .pd-con').width(style.width-20);
			}
			if(style.height){
				$('.notLoginDialogContent .pd-con').height(style.height);
			}
		}
		$('.notLoginDialogMasker').width($(window).width());
		$('.notLoginDialogMasker').height($(window).height());
		$('.notLoginDialogContent').css('left',($(window).width()-$('.notLoginDialogContent').width())/2);
		$('.notLoginDialogContent').css('top',($(window).height()-$('.notLoginDialogContent').height())/2);
		var isIe6=navigator.userAgent.search(/msie 6.0/gi) != -1;
		if (isIe6){
			//IE6兼容
			$('.notLoginDialogContent').css('top',$(window).scrollTop()+($(window).height()-$('.notLoginDialogContent').height())/2);
			$('.notLoginDialogContent').css('left',$(window).scrollLeft()+($(window).width()-$('.notLoginDialogContent').width())/2);
			$('.notLoginDialogMasker').css('top',$(window).scrollTop());
			$('.notLoginDialogMasker').css('left',$(window).scrollLeft());
			$(window).scroll(function(){
				$('.notLoginDialogContent').css('top',$(window).scrollTop()+($(window).height()-$('.notLoginDialogContent').height())/2);
				$('.notLoginDialogContent').css('left',$(window).scrollLeft()+($(window).width()-$('.notLoginDialogContent').width())/2);
				$('.notLoginDialogMasker').css('top',$(window).scrollTop());
				$('.notLoginDialogMasker').css('left',$(window).scrollLeft());
			});
			
		}
		
		$('.notLoginDialogClosed').hover(function(){
			$(this).removeClass('pd-close').addClass('pd-close-hover');
		},function(){
			$(this).removeClass('pd-close-hover').addClass('pd-close');
		});
		$('.notLoginDialogClosed').click(function(){
			removeUnLoginDialog();
		});		
	};
	var removeUnLoginDialog = function(){
		$('.notLoginDialogMasker').remove();
		$('.notLoginDialogContent').remove();
		$('body').removeClass('html-body-overflow');
	};

	return {
		"loading":loading,
		"removeLoading":removeLoading,
		"layerBox":layerBox, //弹层模板
		"removeLayerBox":removeLayerBox,
		"tipLayer":tipLayer,
		"removeTipLayer":removeTipLayer,
		"confirmBox":confirmBox,
		"removeConfirmBox":removeConfirmBox,
		"setCookie":setCookie,
		"getCookie":getCookie,
		"changeTab":changeTab, //切换标签
		"loginState":loginState, //登陆状态
		"changeCode":changeCode,//验证码
		"loginOut":loginOut,//退出登录
		"notLogin":notLogin,//没有登录
		"webroot":webroot,
		"apiroot":apiroot,  //api路径
		"imgroot":imgroot,
		"stlroot":stlroot,
		"exportroot":exportroot,
		"timeFormat":timeFormat,//日期格式
		"getQueryString":getQueryString, //获取url参数
		"notReadTotal":notReadTotal,//未读公告数
		"getQRCode":getQRCode,//二维码
		"carousel":carousel,
		"unLoginDialog":unLoginDialog,//未登陆前弹窗
		"removeUnLoginDialog":removeUnLoginDialog,
		"event":event//封装事件
	};
	
});




