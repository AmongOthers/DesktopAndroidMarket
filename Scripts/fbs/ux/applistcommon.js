define(['jquery','ux/jquery.common'], function($,common){
		//热门应用
		var hotapp = function(options){
			$(options.obj).empty();
			$.ajax({
			   type: "GET",
			   data:options.data,
			   url: common.apiroot+"api/app",
			   dataType:"jsonp",
			   jsonp:"callback",
			   success: function(result){
					if(result.list.length>0){
						var hotAppList=[],cls;
						for(var i=0;i<result.list.length;i++){
							if(result.list[i].markStatus == 1){
								cls = "hot";
							}else if(result.list[i].markStatus == 2){
								cls = "new";
							}else if(result.list[i].markStatus == 3){
								cls = "bq";
							}else{
								cls = "";
							}
							var hotAppItem=[];
							hotAppItem.push('<li class="'+cls+'">');
							hotAppItem.push('<img name="proDetail" src="'+common.imgroot+result.list[i].url+'" dlId='+result.list[i].id+'>');
							hotAppItem.push('<p><span class="app-name txt-overflow" >'+result.list[i].name+'</span><span class="app-downloads"><em>'+result.list[i].dlTime+'</em>次</span></p>');
							hotAppItem.push('<span class="downloadbutton" dlId='+result.list[i].id+'></span><span class="sign"></span>');
							hotAppItem.push('</li>');
							hotAppList.push(hotAppItem.join(''));
						}
						$(options.obj).html(hotAppList.join(''));
						$(options.obj).find('li').each(function(){
							$(this).hover(function(){
								$(this).addClass('hover');
							},function(){
									$(this).removeClass('hover');
							});
						});
						$(options.obj).find('.downloadbutton').each(function(){
							$(this).click(function(){
								downloadApp($(this).attr('dlId'),options.data.modelId);
							});
						});
						//$(options.obj).find('img[name="proDetail"]').each(function(){
						//	$(this).click(function(){
						//		productDet($(this).attr('dlId'),options.data.modelId);
						//	});
						//});
					}else{
						$(options.obj).html('<li style="width:100%;  background:none; font-size:14px; color:#666; margin-top:30px; text-indent:30px;">暂时没有该类型应用</li>');
					}
			   },
			   error:function(){
					
			   }
			});
		};
		//热门游戏
		var hotGame = function(options){
			$(options.obj).empty();
			$.ajax({
			   type: "GET",
			   data:options.data,
			   url: common.apiroot+"api/app",
			   dataType:"jsonp",
			   jsonp:"callback",
			   success: function(result){
					if(result.list.length>0){
						var hotGameList=[],cls;
						for(var i=0;i<result.list.length;i++){
							if(result.list[i].markStatus == 1){
								cls = "hot";
							}else if(result.list[i].markStatus == 2){
								cls = "new";
							}else if(result.list[i].markStatus == 3){
								cls = "bq";
							}else{
								cls = "";
							}
							var hotGameItem=[];
							hotGameItem.push('<li class="'+cls+'">');
							hotGameItem.push('<img name="proDetail" src="'+common.imgroot+(result.list[i].url!=null?result.list[i].url:'')+'" dlId='+result.list[i].id+'>');
							hotGameItem.push('<p><span class="app-name txt-overflow">'+result.list[i].name+'</span><span class="app-downloads"><em>'+result.list[i].dlTime+'</em>次</span></p>');
							hotGameItem.push('<span class="downloadbutton" dlId='+result.list[i].id+'></span><span class="sign"></span>');
							hotGameItem.push('</li>');
							hotGameList.push(hotGameItem.join(''));
						}
						$(options.obj).html(hotGameList.join(''));
						$(options.obj).find('li').each(function(){
							$(this).hover(function(){
								$(this).addClass('hover');
							},function(){
									$(this).removeClass('hover');
							});
						});
						$(options.obj).find('.downloadbutton').each(function(){
							$(this).click(function(){
								 downloadApp($(this).attr('dlId'),options.data.modelId);
							});
						});
						//$(options.obj).find('img[name="proDetail"]').each(function(){
						//	$(this).click(function(){
						//		productDet($(this).attr('dlId'),options.data.modelId);
						//	});
						//});
					}else{
						$(options.obj).html('<li style="width:100%;  background:none; font-size:14px; color:#666; margin-top:30px; text-indent:30px;">暂时没有该类型应用</li>');
					}
			   },
			   error:function(){
					
			   }
			});
		
		};
		//应用下载
		//var downloadApp = function(paramId,modelId){
		//	common.loading();//loading
		//	$.ajax({
		//	   type: "GET",
		//	   data:"param=T:"+paramId+"&modelId="+modelId,
		//	   url: common.apiroot+"api/app/matching",
		//	   dataType:"jsonp",
		//	   jsonp:"callback",
		//	   success: function(result){
		//		    common.removeLoading();
		//	        window.location.href=common.imgroot+result.list[0].url;
		//	   },
		//	   error:function(){
		//			common.removeLoading();
		//	   }
		//	});
		//};
		//应用详情
		var productDet = function(paramId,modelId){
			common.loading();//loading
			$.ajax({
			   type: "GET",
			   data:{"id":paramId,"modelId":modelId},
			   url: common.apiroot+"api/app/intro",
			   dataType:"jsonp",
			   jsonp:"callback",
			   async:false,
			   success: function(result){
					common.removeLoading();
					var app_scPerson = result.scPerson;     
					var app_sc360 = result.sc360;     
					var app_scTcgj = result.scTcgj; 
					var pmsList=result.pmsList;
					var  s360="",scPers = "",scTcgj="",mous="";mous_text = "",absolutetxt="",ultext="",sc_version="",admin_version="";
					if(app_scPerson == 1){
						scPers = '<li><span class="logo icon logofbs"></span>蜂助手人工测试： <span class="green">已通过</span></li>';
					}
					if(app_sc360 == 1){
						s360 = '<li><span class="logo icon logo360" ></span>360卫士扫描： <span class="green">已通过</span></li>';
					}
					if(app_scTcgj == 1){
						scTcgj = '<li><span class="logo icon logotx"></span>腾讯手机管家扫描：<span class="green">已通过</span></li>';
					}
					if(app_scPerson !=1 && app_sc360 !=1 && app_scTcgj!=1){
						absolutetxt ='';
						sc_version='<li class="ml10 fl radius5 pr tagli gou "><span>安全版</span></li>';
					}else{
						absolutetxt ='<div class="safety pa radius5"><div class="arr pa"></div><ul ><li>已通过安全认证</li>'+scPers + s360 + scTcgj + '<li>检测无病毒、木马等恶意程序，请放心安装。</li></ul></div>';
						sc_version='<li class="ml10 fl radius5 pr tagli gou "><span>安全版</span><div class="liarr pa"></div>'+absolutetxt+'</li>';
					}
					if(pmsList != null&&pmsList.length>0){
						for(i=0;i<pmsList.length;i++){
							mous_text +='<li>'+pmsList[i].name+'</li>';
						}
						mous = '<div class="safety radius5 pa safety_wd"><div class="arr pa"></div><ul>'+mous_text+'</ul></div>';
						admin_version='<li class="pr ml10 fl radius5 tagli"><span>权限</span><div class="liarr pa"></div>'+mous+'</li>';
					}else{
						admin_version='<li class="pr ml10 fl radius5 tagli"><span>权限</span></li>';
					}
					ultext = '<ul class="tag mt10"><li class="fl radius5 tagli gou">官方版</li><li class="ml10 fl radius5 tagli gou">免费版</li>'+sc_version+admin_version+'</ul>';
					
					//相关应用
					var relatedStr='';
					if(result.interrelated.length>0){
						relatedStr='<div class="pro-tab"><span>相关应用</span></div>'+
								'<div class="pro-tab-con" id="relatedApp"><ul class="related-app">';
						for(var i=0; i<result.interrelated.length;i++){
							relatedStr+='<li dlId='+result.interrelated[i].id+'>'+
											'<img src="'+common.imgroot+result.interrelated[i].url+'">'+
											'<p><span class="bold">'+(result.interrelated[i].name.length>6?(result.interrelated[i].name.substring(0,6)+'...'):result.interrelated[i].name)+'</span></p>'+
											'<p name="dl">下载：<span class="orange">'+result.interrelated[i].dlTime+'</span></p>'+
											'<button class="ra-dl-btn" name="dlBtn" dlId='+result.interrelated[i].id+' ></button>'
						                '</li>';
						}
						relatedStr+='</ul></div>';
					}

					var dialogHtml='<div class="appProductDet"><div class="base-msg">'+
								'<img src="'+common.imgroot+result.url+'" class="pic">'+
								'<div class="base-text">'+
									'<p class="pro-name">'+result.name+'</p>'+
									'<p class="pro-gray"><span class="orange">'+result.fileSize+'</span>&nbsp;&nbsp;<span class="orange">'+(result.stateDate!=null?common.timeFormat(result.stateDate,true,'-'):'')+'</span>更新</p>'+ultext+
									// '<p class="pro-gray">'+(result.desc!=null?(result.desc.length>50?result.desc.substring(0,50)+'...	':result.desc):'')+'</p>'+
								'</div>'+
								'<div class="pro-dl">'+
									'<div class="qrcode"><img src="" id="qrcodeImg"></div>'+
									'<div class="dl-times"><button class="dl-btn" dlId='+paramId+' name="dlBtn" ></button>'+
									'<p class="pro-gray"><span class="orange">'+result.dlTime+'</span>次下载</p></div>'+
								'</div>'+
							'</div>'+relatedStr+
							'<div class="pro-tab">'+
								'<span>应用简介</span>'+
							'</div>'+
							'<div class="pro-tab-con delcon">'+result.content+'</div></div>';

					var title="应用简介";	
					//弹出窗口
					if($('.notLoginDialogContent').length>0){
						$('.notLoginDialogContent .pd-con').html(dialogHtml);
					}else{
						common.unLoginDialog(dialogHtml,{
								width:750
							},title
						);
					}
					
					
					//相关应用
					$('#relatedApp').find('li').each(function(){
						$(this).hover(function(){
							$(this).find('p[name="dl"]').hide();
							$(this).find('.ra-dl-btn').show();
						},function(){
							$(this).find('p[name="dl"]').show();
							$(this).find('.ra-dl-btn').hide();
						});

						$(this).click(function(event){
							var target = event.srcElement ? event.srcElement:event.target;
							if(target.name!="dlBtn"){
								var dlId=$(this).attr('dlId');
								productDet(dlId,modelId);
							}
						});
					});

					//下载按钮
					$('.appProductDet').find('button[name="dlBtn"]').each(function(){
						$(this).click(function(){
							if(modelId){
								downloadApp($(this).attr('dlId'),modelId);
							}else{
								downloadApp($(this).attr('dlId'));
							}
							
						});
					});
					//二维码
					$('#qrcodeImg').attr('src',common.apiroot+"api/app/qrlink?appTemplateId="+paramId+"&modelId="+modelId+"");
			   },
			   error:function(){
					common.removeLoading();
			   }
			});
		};
		//版本信息
		var getVersion=function(dataParam){
			$.ajax({
			   type: "GET",
			   url: common.apiroot+"api/msg/findSampMsg",
			   dataType:"jsonp",
			   jsonp:"callback",
			   data:dataParam.data,
			   success: function(result){
					if(result!=null){
					   if(result.length>0){
							var content=result[0].content;
							if(dataParam.type=='pc'){
								var detailDate=content.split('#');
								for(var i=0; i<detailDate.length; i++){
									if(detailDate[i].indexOf('版本')!=-1){
										var versionNum=$.trim((detailDate[i].substring(detailDate[i].indexOf('版本')+3,detailDate[i].length)).replace('&nbsp;',''));
										$('.pc-version').html(versionNum);
									}
									if(detailDate[i].indexOf('时间')!=-1){
										var versionDate=$.trim((detailDate[i].substring(detailDate[i].indexOf('时间')+3,detailDate[i].length)).replace('&nbsp;',''));
										$('.pc-lastUpdate').html(versionDate);
									}
									if(detailDate[i].indexOf('大小')!=-1){
										var versionSize=$.trim((detailDate[i].substring(detailDate[i].indexOf('大小')+3,detailDate[i].length)).replace('&nbsp;',''));
										$('.pc-size').html(versionSize);
									}
								}
							}
							if(dataParam.type=='mobile'){
								var detailDate=content.split('#');
								for(var i=0; i<detailDate.length; i++){
									if(detailDate[i].indexOf('版本')!=-1){
										var versionNum=$.trim((detailDate[i].substring(detailDate[i].indexOf('版本')+3,detailDate[i].length)).replace('&nbsp;',''));
										$('.mobile-version').html(versionNum);
									}
									if(detailDate[i].indexOf('时间')!=-1){
										var versionDate=$.trim((detailDate[i].substring(detailDate[i].indexOf('时间')+3,detailDate[i].length)).replace('&nbsp;',''));
										$('.mobile-lastUpdate').html(versionDate);
									}
									if(detailDate[i].indexOf('大小')!=-1){
										var versionSize=$.trim((detailDate[i].substring(detailDate[i].indexOf('大小')+3,detailDate[i].length)).replace('&nbsp;',''));
										$('.mobile-size').html(versionSize);
									}
								}
							}
							if(dataParam.type=='mobile_ios'){
								var detailDate=content.split('#');
								for(var i=0; i<detailDate.length; i++){
									if(detailDate[i].indexOf('版本')!=-1){
										var versionNum=$.trim((detailDate[i].substring(detailDate[i].indexOf('版本')+3,detailDate[i].length)).replace('&nbsp;',''));
										$('.mobile-ios-version').html(versionNum);
									}
									if(detailDate[i].indexOf('时间')!=-1){
										var versionDate=$.trim((detailDate[i].substring(detailDate[i].indexOf('时间')+3,detailDate[i].length)).replace('&nbsp;',''));
										$('.mobile-ios-lastUpdate').html(versionDate);
									}
									if(detailDate[i].indexOf('大小')!=-1){
										var versionSize=$.trim((detailDate[i].substring(detailDate[i].indexOf('大小')+3,detailDate[i].length)).replace('&nbsp;',''));
										$('.mobile-ios-size').html(versionSize);
									}
								}
							}
					   }
					
					}
			   },
			   error:function(XMLHttpRequest, textStatus, errorThrown){
					
			   }
			});
		};
	    //网点数据
	    var timer_setInterval = null;
		var useCookieData = {
			config : {
				user : "user-num",//用户量	
				deivce_updateNum : "device-num-updateNum",//目标设备更新数量
				deivce : "device-num",//当前设备数量
				deivce_count : "deivce-count",
				app : "app-num",//应用装机量			
				timecount : "timecount-num",//时间统计					
				datetime : "datetime-num",//时间字段
				datetimeNow : new Date().getTime(),//现在时间
				userNum : 0,
				appNum : 0,
				datetimeNum : 0,
				deivceNum : 0,
				deivceCountNum : 0,
				timecountNum : 0,//时间统计默认值
				timeoutNum : 1800,//时间超时默认值30m
				deivceRateNum : 0,
				firstLoad : true
			},
			datetime : {
				format : function(date){
					var d = new Date(date);
					var ret=d.getFullYear()+"-" ;  
				    ret+=("00"+(d.getMonth()+1)).slice(-2)+"-";   
				    ret+=("00"+d.getDate()).slice(-2)+" ";   
				    ret+=("00"+d.getHours()).slice(-2)+":";   
				    ret+=("00"+d.getMinutes()).slice(-2)+":";   
				    ret+=("00"+d.getSeconds()).slice(-2);  
				    return ret;
				},
				split : function(dt1){
					var d1=dt1.split(" ")[0];
					var t1=dt1.split(" ")[1];
					var y1=d1.split("-")[0];
					var m1=parseInt(d1.split("-")[1])-1;
					var da1=d1.split("-")[2];
					var h1=t1.split(":")[0];
					var mi1=t1.split(":")[1];
					var s1 = t1.split(":")[2];
					var dat1=new Date(y1,m1,da1,h1,mi1,s1);
					return dat1;
				},
				getPart : function(){
					/*时间字段*/
					var datetime_last = parseInt(common.getCookie(useCookieData.config.datetime));
					var datetime_now = parseInt(useCookieData.config.datetimeNow);
					var date1 = useCookieData.datetime.split(useCookieData.datetime.format(datetime_last));
					var date2 = useCookieData.datetime.split(useCookieData.datetime.format(datetime_now));
					var datepart = parseFloat(date2 - date1);
					
					return (datepart%3600000/60000) * 60;
				}
			},
			getInitData : function(){
				useCookieData.config.userNum = common.getCookie(useCookieData.config.user);
				useCookieData.config.deivceNum = common.getCookie(useCookieData.config.deivce);
				useCookieData.config.deivceCountNum = common.getCookie(useCookieData.config.deivce_count);
				useCookieData.config.appNum = common.getCookie(useCookieData.config.app);
				useCookieData.config.datetimeNum = common.getCookie(useCookieData.config.datetime);
				useCookieData.config.timecountNum = common.getCookie(useCookieData.config.timecount);
				useCookieData.config.deivceRateNum = (parseInt(useCookieData.config.deivceCountNum)-parseInt(useCookieData.config.deivceNum))/useCookieData.config.timeoutNum;
			},
			setNum : function(users,deivce,zjl){
				/*初始化显示数量*/
				//$('#latticePoint-num .point-num').html(useCookieData.numFormat(users));
			   	//$('#latticePoint-num .device-num').html(useCookieData.numFormat(deivce));
			   	//$('#latticePoint-num .app-num').html(useCookieData.numDecimal(zjl));
			   	
			   	// if(deivce.length>7){
			   	// 	var deivceLi=[];
			   	// 	deivceLi.push('<li class="lbg"><span class="numpic num0"></span></li>');
			   	// 	for(var i=0; i<deivce.length-2;i++){
			   	// 		deivceLi.push('<li><span class="numpic num0"></span></li>');
			   	// 	}
			   	// 	deivceLi.push('<li class="rbg"><span class="numpic num0"></span></li>');
			   	// 	$('ul.device_totalData').html(deivceLi.join(''));
			   	// }
			    var users=users+'';
			   	var deivce=deivce+'';
			   	var zjl = Math.round(zjl/10000)+ "";
                numDisplayInit(users,'ul.point_totalData');
                numDisplayInit(deivce,'ul.device_totalData');
                numDisplayInit(zjl,'ul.app_totalData');
			    useCookieData.numFormat(users,$('.point_totalData'));
			   	useCookieData.numFormat(deivce.toString(),$('.device_totalData'));
			    useCookieData.numFormat(zjl,$('.app_totalData'));

			   	function numDisplayInit(num,obj){
		   			var numLi=[];
		   			numLi.push('<li class="lbg"><span class="numpic num0"></span></li>');
		   			for(var i=0; i<num.length-2;i++){
		   				numLi.push('<li><span class="numpic num0"></span></li>');
		   			}
		   			numLi.push('<li class="rbg"><span class="numpic num0"></span></li>');
		   			$(obj).html(numLi.join(''));
			   	};
			},
			init : function(){
				if(useCookieData.config.firstLoad){
					useCookieData.getInitData();
				}
				//var now = Date.now();	
				/*网点数量*/
				var users = useCookieData.config.userNum;	//当前用户数量
				/*装机量*/
				var zjl = useCookieData.config.appNum;	//当前用户数量

				/*设备数量*/
				// var deivce_updateNum = common.getCookie(useCookieData.config.deivce_updateNum);	//目标更新数量
				var deivce_count = useCookieData.config.deivceCountNum;//目标更新数量
				var deivce = useCookieData.config.deivceNum;	//当前设备数量
				/*初始化显示数量*/
				if(useCookieData.config.firstLoad){
					useCookieData.setNum(users,deivce,zjl);
				}
				/*时间统计*/
				var timeout = useCookieData.config.timeoutNum;	//30m更新,1800s,
				var timecount = useCookieData.config.timecountNum;
				
				var datepart,timecount_new,datepart;
				deivce_update = deivce;
				if(useCookieData.config.firstLoad){
					datepart = useCookieData.datetime.getPart();
					
					timecount_new = parseFloat(datepart) + parseInt(timecount);	
					deivce_update = parseInt(deivce) + Math.floor(datepart * parseFloat(useCookieData.config.deivceRateNum));
					useCookieData.config.deivceNum = deivce_update;
					useCookieData.numFormat(deivce_update.toString(),$('.device_totalData'));

				}
				if(parseInt(timecount) > parseInt(timeout) || parseInt(deivce) > parseInt(deivce_count)){
					// 重新拿最新数据
					useCookieData.config.firstLoad = true;
					useCookieData.config.timecountNum = 0;
					clearInterval(timer_setInterval);
					getLatticePoint();
				}else{
					if(!useCookieData.config.firstLoad){
						timecount_new++;
					}
					common.setCookie(useCookieData.config.timecount, timecount_new);
					common.setCookie(useCookieData.config.deivce, deivce_update);
	   				common.setCookie(useCookieData.config.datetime, new Date().getTime());
					// 记录时间统计
					if(useCookieData.config.firstLoad){
						useCookieData.config.firstLoad = false;
						timer_setInterval = setInterval(function(){
							useCookieData.init();
						},1000);
						useCookieData.updateNum();				
					}		
				}
			},
			getRandomNum : function(num){
				return Math.floor((Math.random()*num) + 1);
			},
			updateNum : function(){
				var timer = useCookieData.getRandomNum(9);
				setTimeout(function(){
					var deivce_update = timer * useCookieData.config.deivceRateNum;
					var deivce = useCookieData.config.deivceNum;
					deivce = parseInt(Math.floor(parseInt(deivce) + Math.floor(deivce_update)));
					useCookieData.config.deivceNum = deivce;
					common.setCookie(useCookieData.config.deivce, deivce);
					/*转换格式显示*/
					useCookieData.numFormat(deivce.toString(),$('.device_totalData'));
					useCookieData.updateNum();
				}, parseInt(Math.floor(timer)) * 1000);
			},
			numFormat : function(numStr,obj){
				for(var i=0; i<numStr.length; i++){
					//obj.find('li').eq(i).find('span')[0].className="numpic num"+numStr.charAt(i);
					if(obj.find('li').eq(i).find('span')!=null&&obj.find('li').eq(i).find('span').length>0){
						obj.find('li').eq(i).find('span')[0].className="numpic num"+numStr.charAt(i);
					}
				}
				
			},
			numDecimal : function(num){
				num = Math.round(num/10000*10)/10 + "";
	   			if(num.toString().indexOf('.')<0&&num!=''){
	   				num=num.toString()+'.0';
	   			}
	   			return num
			},
			checkNewData : function(){
				var flag = false;
				var zjl = common.getCookie(useCookieData.config.deivce);
				if(zjl){
					flag = true;
					useCookieData.init();
				}
				return flag;
			}
		};
		var checkCookieData = function(){
			if(!useCookieData.checkNewData()){	
				getLatticePoint();
			}
		};
		var getLatticePoint = function(){
			$.ajax({
			   type: "GET",
			   url: common.webroot+"/ssWebsite/website/reward/returnUsersAndZjl",
			   dataType:"jsonp",
			   jsonp:"callback",
			   success: function(result){
			   		if(result!=null){
			   			var deivce = (result.imeibefore?result.imeibefore:'')+'';
			   			var users= (result.users?result.users:'')+'';
			   			var zjl = result.zjl?(result.zjl)+'':'';
			   			useCookieData.setNum(users,deivce,zjl);
			   			if(result.result == "0"){
			   				var deivce_updateNum = result.imeicount - result.imeibefore;
			   				common.setCookie(useCookieData.config.user, result.users);
			   				common.setCookie(useCookieData.config.deivce_updateNum, deivce_updateNum);
			   				common.setCookie(useCookieData.config.deivce, result.imeibefore);
			   				common.setCookie(useCookieData.config.deivce_count, result.imeicount);
			   				common.setCookie(useCookieData.config.app, result.zjl);
			   				common.setCookie(useCookieData.config.timecount, 0);
			   				common.setCookie(useCookieData.config.datetime, new Date().getTime());
			   				useCookieData.init();
			   			}else{
			   				getLatticePoint();//获取失败重新请求
			   			}   			
			   		}
			   }
			});
		};
		//广告轮播,fn为广告点击处理方法
		var ads={
			init:function(data){
				if(data!=null){
					this.getAddData($(data.obj),data.data,data.modelId);
				}
			},
			getAddData:function(obj,data,modelId,fn){
				$.ajax({
					type : "GET",
					url :common.apiroot+"api/msg/gg",
					data:data,
					dataType:"jsonp",
					jsonp:"callback",
					success : function(data){
						if(data!=null){
							var ads_type=data.type;
							if(ads_type==2){
								//轮播类型广告
								if(data.cont&&data.cont.length>0){
									var imgs=[];
									var btns=[];
									imgs.push('<div class="add-pic_banner">');
									for(var i=0; i<data.cont.length; i++){
										var hrefType=data.cont[i].hrefType;
										if(i==0){
											imgs.push('<img src="'+common.imgroot+data.cont[i].imgUrl+'" pid="'+data.cont[i].id+'" hrefType="'+hrefType+'" href="'+data.cont[i].href+'"  modelId="'+modelId+'">');
											btns.push('<li class="show"></li>');
										}else{
											imgs.push('<img src="'+common.imgroot+data.cont[i].imgUrl+'" pid="'+data.cont[i].id+'" hrefType="'+hrefType+'" href="'+data.cont[i].href+'"   modelId="'+modelId+'" class="opacity0">');
											btns.push('<li></li>');
										}
									}
									imgs.push('</div><div><ul class="slide-control">'+btns.join('')+'</ul></div>');
									obj.html(imgs.join(''));
									var carBlock=obj;
									var carObj=obj.find('img');
									var carBtn=obj.find('ul.slide-control li');
									var carBox=obj.find('div.add-pic_banner');
									var app_add_carousel=new common.carousel({
										carBlock:carBlock,
										carBox:carBox,
										carObj:carObj,
										carBtn:carBtn,
										changeType:1,//1是淡入淡出
										btnClassName:'show'
									});
									ads.getDetailInfo(app_add_carousel);

								}
							}
						}
					},
					error:function(){

					}
				});
			},
			getDetailInfo:function(carousel){
				//获取详情信息
				if(carousel!=null){
					var carBlock=carousel.carBlock;
					var carObj=carousel.carObj;
					$(carBlock).click(function(){
						var targetObj=$(carObj).eq(carousel.num);
						var pid=targetObj.attr("pid");
						var href=targetObj.attr("href");
						var hrefType=targetObj.attr("hrefType");
						var modelId=targetObj.attr("modelId");
						if(hrefType==1){
							productDet(pid,modelId);
						}
						/*if(hrefType==2){//暂时还没有这种配置
							ads.getDetailContent(href);
						}*/
					});
				}
			},
			getDetailContent:function(href){
				if(href!=null){
					$.ajax({
						type : "GET",
						url :href,
						dataType:"jsonp",
						jsonp:"callback",
						success : function(data){
							
						},
						error:function(){

						}
					});
				}
			}
		};

		return {
			"checkCookieData":checkCookieData,//网点数据
			"productDet":productDet,//简介
			//"downloadApp":downloadApp,//下载
			"hotGame":hotGame, //游戏
			"hotapp":hotapp,//应用
			"getVersion":getVersion,//版本信息
			"ads":ads
		};
});